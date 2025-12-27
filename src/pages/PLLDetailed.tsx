import { useRef } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  pllGroups, getCase, getPLLSwaps, getAlgorithmsForCase,
} from '../data/cases'

import { PLLContextType } from './PLL'
import PLLGrid from '../components/PLLGrid'
import { AlgoCardRow } from '../components/algorithm'
import { Color } from '../types/cube'
import { CORNER_COLOR, EDGE_COLOR } from '../components/PLLArrowOverlay'
import { getPlaygroundUrlForAlgorithm } from '../utils/algorithmLinks'
import { useClickOutside } from '../hooks'
import type { Case, CaseId } from '../types/algorithm'

// Highlights "corner(s)" and "edge(s)" words with their respective colors
function ColorCodedDescription({ text }: { text: string }) {
  const parts = text.split(/(corners?|edges?)/gi)
  return (
    <>
      {parts.map((part, i) => {
        const lower = part.toLowerCase()
        if (lower === 'corner' || lower === 'corners') {
          return <span key={i} style={{
            color: CORNER_COLOR,
            fontWeight: 500,
          }}>{part}</span>
        }
        if (lower === 'edge' || lower === 'edges') {
          return <span key={i} style={{
            color: EDGE_COLOR,
            fontWeight: 500,
          }}>{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </>
  )
}

function PLLCaseCard({
  caseData, isHighlighted, selectedColor,
}: {
  caseData: Case
  isHighlighted?: boolean
  selectedColor: Color
}) {
  const caseId = caseData.id
  const algorithms = getAlgorithmsForCase(caseId)
  const swaps = getPLLSwaps(caseId)

  return (
    <div className={`case-card transition-all duration-300 relative ${isHighlighted ? 'case-card-highlight' : ''}`}>
      <div className="flex flex-col items-center">
        <h3 className="case-card-title">
          {caseData.name}
        </h3>

        <div className="mb-4">
          <PLLGrid caseId={caseId} swaps={swaps} selectedColor={selectedColor} showArrows />
        </div>

        {swaps && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
            <ColorCodedDescription text={swaps.description} />
          </p>
        )}

        <div className="w-full space-y-3">
          {algorithms.map((algorithm, i) => (
            <AlgoCardRow
              key={i}
              algorithm={algorithm}
              playgroundUrl={getPlaygroundUrlForAlgorithm(algorithm.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper to get PLL name from case ID (e.g., "pll-ua" -> "ua")
function getPLLName(caseId: CaseId): string {
  return caseId.replace('pll-', '')
}

// Selectors to ignore when detecting clicks outside
const DETAILED_IGNORE_SELECTORS = ['nav', 'header', 'input', '.case-card']

export default function PLLDetailed() {
  const {
    highlightedPll,
    clearSearch,
    selectedColor,
  } = useOutletContext<PLLContextType>()
  const mainRef = useRef<HTMLElement>(null)

  // Clear highlight when clicking outside cards
  useClickOutside({
    containerRef: mainRef,
    onClickOutside: clearSearch,
    enabled: highlightedPll !== null,
    ignoreSelectors: DETAILED_IGNORE_SELECTORS,
  })

  return (
    <main ref={mainRef} className="main-content-detailed">
      {/* Collapsible intro */}
      <details className="collapsible">
        <summary className="collapsible-trigger">About PLL cases</summary>
        <div className="collapsible-content">
          <p>
            The 21 PLL cases rearrange last-layer pieces without disturbing their orientation.
            Recognition is key: identify cases quickly from side-face patterns. Look for
            <strong> headlights</strong> (two matching colors on one side)—their presence and position
            narrows down possibilities dramatically.
          </p>
          <p>
            <strong>Learning strategy:</strong> Start with Edges Only (Ua, Ub, H, Z)—common cases with short algorithms.
            Then learn T and Jb from Adjacent Corners; they appear frequently. G-perms can wait until last;
            they're complex but occur less often. Use the color selector to practice recognition from any angle.
          </p>
        </div>
      </details>

      {pllGroups.map((group, groupIndex) => (
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

                const firstName = getPLLName(firstCaseId)

                if (isRelatedPair && position === 1) {
                  rendered.push(<div key={`spacer-${firstName}`} className="hidden md:block" />)
                  position = (position + 1) % 2
                }

                if (isRelatedPair) {
                  const secondCaseId = entry[1]
                  const secondCase = getCase(secondCaseId)
                  if (!secondCase) continue

                  const secondName = getPLLName(secondCaseId)

                  rendered.push(
                    <div key={firstName} id={`pll-${firstName}`} className="md:col-span-2">
                      <div id={`pll-${secondName}`} className="pair-container">
                        <PLLCaseCard
                          caseData={firstCase}
                          isHighlighted={highlightedPll === firstName}
                          selectedColor={selectedColor}
                        />
                        <PLLCaseCard
                          caseData={secondCase}
                          isHighlighted={highlightedPll === secondName}
                          selectedColor={selectedColor}
                        />
                      </div>
                    </div>,
                  )
                  position = 0
                } else {
                  rendered.push(
                    <div key={firstName} id={`pll-${firstName}`}>
                      <PLLCaseCard
                        caseData={firstCase}
                        isHighlighted={highlightedPll === firstName}
                        selectedColor={selectedColor}
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
