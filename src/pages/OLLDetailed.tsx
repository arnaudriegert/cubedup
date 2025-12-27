import { useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  ollGroups, getCase, getAlgorithmsForCase,
} from '../data/cases'

import { OLLContextType } from './OLL'
import OLLGrid from '../components/OLLGrid'
import { AlgoCardRow } from '../components/algorithm'
import { getPlaygroundUrlForAlgorithm } from '../utils/algorithmLinks'
import { useClickOutside } from '../hooks'
import type { CaseId, Case } from '../types/algorithm'

function OLLCaseCard({
  caseData, isHighlighted, onNavigateToCase,
}: {
  caseData: Case
  isHighlighted?: boolean
  onNavigateToCase?: (caseNumber: number) => void
}) {
  const caseId = caseData.id
  const algorithms = getAlgorithmsForCase(caseId)

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
          {algorithms.map((algorithm, i) => (
            <AlgoCardRow
              key={i}
              algorithm={algorithm}
              playgroundUrl={getPlaygroundUrlForAlgorithm(algorithm.id)}
              onInverseClick={onNavigateToCase}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper to extract OLL number from case ID
function getOLLNumber(caseId: CaseId): number {
  return parseInt(caseId.replace('oll-', ''), 10)
}

// Selectors to ignore when detecting clicks outside
const DETAILED_IGNORE_SELECTORS = ['nav', 'header', 'input', '.case-card']

export default function OLLDetailed() {
  const {
    highlightedOll,
    clearSearch,
    setSearch,
  } = useOutletContext<OLLContextType>()
  const mainRef = useRef<HTMLElement>(null)

  const handleNavigateToCase = (caseNumber: number) => {
    setSearch(String(caseNumber))
  }

  // Clear highlight when clicking outside cards
  useClickOutside({
    containerRef: mainRef,
    onClickOutside: clearSearch,
    enabled: highlightedOll !== null,
    ignoreSelectors: DETAILED_IGNORE_SELECTORS,
  })

  return (
    <main ref={mainRef} className="main-content-detailed">
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
