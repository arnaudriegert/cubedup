import { useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  ollGroups, getCase, getAlgorithmsForCase,
} from '../data/cases'

import { OLLContextType } from './OLL'
import OLLGrid from '../components/OLLGrid'
import { AlgorithmDisplay } from '../components/algorithm'
import InverseBadge from '../components/InverseBadge'
import { getPlaygroundUrlForAlgorithm } from '../utils/algorithmLinks'
import type {
  AlgorithmId, CaseId, Case,
} from '../types/algorithm'

function OLLCaseCard({
  caseData, isHighlighted, onNavigateToCase,
}: {
  caseData: Case
  isHighlighted?: boolean
  onNavigateToCase?: (caseNumber: number) => void
}) {
  const caseId = caseData.id
  const algorithms = getAlgorithmsForCase(caseId)
  const inverseCase = caseData.inverseOf ? getCase(caseData.inverseOf) : null
  const inverseNumber = inverseCase?.number

  return (
    <div className={`case-card transition-all duration-300 relative ${isHighlighted ? 'case-card-highlight' : ''}`}>
      <div className="flex flex-col">
        <h3 className="case-card-title text-left">
          OLL {caseData.number} - {caseData.name}
        </h3>

        <div className="mb-6 flex justify-center">
          <OLLGrid caseId={caseId} />
        </div>

        <div className="w-full space-y-3">
          {algorithms.map((algorithm, i) => {
            const algorithmId: AlgorithmId = algorithm.id
            const isFirstAlgo = i === 0

            return (
              <div
                key={i}
                className="group/algocard relative rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors p-3"
              >
                {/* Play button - positioned left, shown on hover */}
                <Link
                  to={getPlaygroundUrlForAlgorithm(algorithmId)}
                  title="Demo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded
                    text-indigo-600 hover:bg-indigo-100 transition-opacity
                    opacity-0 group-hover/algocard:opacity-100 z-10"
                >
                  <span className="text-sm">▶</span>
                </Link>
                {/* Algorithm display - centered with padding for buttons */}
                <div className="px-6">
                  <AlgorithmDisplay
                    algorithm={algorithm}
                    size="sm"
                    pinnable
                    parentHoverGroup="algocard"
                  />
                </div>
                {/* Inverse badge - positioned right, shown on hover */}
                {isFirstAlgo && inverseNumber && onNavigateToCase ? (
                  <InverseBadge
                    inverseCaseNumber={inverseNumber}
                    onClick={onNavigateToCase}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover/algocard:opacity-100 transition-opacity z-10"
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Helper to extract OLL number from case ID
function getOLLNumber(caseId: CaseId): number {
  return parseInt(caseId.replace('oll-', ''), 10)
}

export default function OLLDetailed() {
  const {
    highlightedOll,
    clearSearch,
    setSearch,
  } = useOutletContext<OLLContextType>()

  const handleNavigateToCase = (caseNumber: number) => {
    setSearch(String(caseNumber))
  }

  // Clear highlight when clicking outside cards (but not on nav/header/input)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (highlightedOll === null) return

      const target = e.target as HTMLElement
      // Don't clear if clicking on navigation, header, or input
      if (target.closest('nav') || target.closest('header') || target.closest('input')) {
        return
      }
      // Don't clear if clicking on a card
      if (target.closest('.case-card')) {
        return
      }
      clearSearch()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [highlightedOll, clearSearch])

  return (
    <main className="main-content-detailed">
      {/* Collapsible intro */}
      <details className="collapsible">
        <summary className="collapsible-trigger">About OLL cases</summary>
        <div className="collapsible-content">
          <p>
            The 57 OLL cases cover every possible last-layer orientation. Cases are grouped by the shape
            formed by incorrectly-oriented pieces: edges form patterns (lines, dots, L-shapes) while
            corners create the characteristic silhouette.
          </p>
          <p>
            <strong>Learning strategy:</strong> Start with Solved Cross cases—you likely know some from 2-look OLL.
            Then learn one category at a time. Mirror pairs share muscle memory; learn them together.
            Small categories (T-shapes, C-shapes) are quick wins.
          </p>
        </div>
      </details>

      {ollGroups.map((group, groupIndex) => (
        <section key={groupIndex} id={group.name.replace(/\s+/g, '-').toLowerCase()} className="case-group scroll-mt-72">
          <h2 className="section-title">{group.name}</h2>
          <p className="section-description">{group.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(() => {
              const rendered = []
              let position = 0

              for (const entry of group.cases) {
                const isRelatedPair = entry.length === 2
                const firstCaseId = entry[0]
                const firstCase = getCase(firstCaseId)
                if (!firstCase) continue

                const firstNumber = getOLLNumber(firstCaseId)

                if (isRelatedPair && position === 1) {
                  rendered.push(<div key={`spacer-${firstNumber}`} className="hidden md:block" />)
                  position = (position + 1) % 2
                }

                if (isRelatedPair) {
                  const secondCaseId = entry[1]
                  const secondCase = getCase(secondCaseId)
                  if (!secondCase) continue

                  const secondNumber = getOLLNumber(secondCaseId)

                  rendered.push(
                    <div key={firstNumber} id={`oll-${firstNumber}`} className="md:col-span-2">
                      <div id={`oll-${secondNumber}`} className="pair-container">
                        <OLLCaseCard
                          caseData={firstCase}
                          isHighlighted={highlightedOll === firstNumber}
                          onNavigateToCase={handleNavigateToCase}
                        />
                        <OLLCaseCard
                          caseData={secondCase}
                          isHighlighted={highlightedOll === secondNumber}
                          onNavigateToCase={handleNavigateToCase}
                        />
                      </div>
                    </div>,
                  )
                  position = 0
                } else {
                  rendered.push(
                    <div key={firstNumber} id={`oll-${firstNumber}`}>
                      <OLLCaseCard
                        caseData={firstCase}
                        isHighlighted={highlightedOll === firstNumber}
                        onNavigateToCase={handleNavigateToCase}
                      />
                    </div>,
                  )
                  position = (position + 1) % 2
                }
              }

              return rendered
            })()}
          </div>
        </section>
      ))}
    </main>
  )
}
