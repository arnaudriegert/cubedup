import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ollCategories, OLLCase } from '../data/ollCases'
import { OLLContextType } from './OLL'
import OLLGrid from '../components/OLLGrid'
import AlgorithmBox from '../components/AlgorithmBox'

function OLLCaseCard({
  ollCase, isHighlighted,
}: {
  ollCase: OLLCase
  isHighlighted?: boolean
}) {
  return (
    <div className={`group case-card transition-all duration-300 ${isHighlighted ? 'case-card-highlight' : ''}`}>
      <div className="flex flex-col items-center">
        <h3 className="case-card-title">
          OLL {ollCase.number} - {ollCase.name}
        </h3>

        <div className="mb-6">
          <OLLGrid orientations={ollCase.orientations} />
        </div>

        <div className="w-full space-y-2">
          {ollCase.algorithms.map((algorithm, i) => (
            <AlgorithmBox key={i} algorithm={algorithm} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function OLLDetailed() {
  const {
    highlightedOll,
    clearSearch,
  } = useOutletContext<OLLContextType>()

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

      {ollCategories.map((category, categoryIndex) => (
        <section key={categoryIndex} id={category.name.replace(/\s+/g, '-').toLowerCase()} className="case-group scroll-mt-72">
          <h2 className="section-title">{category.name}</h2>
          <p className="section-description">{category.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(() => {
              const rendered = []
              let position = 0

              for (const entry of category.cases) {
                const isRelatedPair = entry.length === 2

                if (isRelatedPair && position === 1) {
                  rendered.push(<div key={`spacer-${entry[0].number}`} className="hidden md:block" />)
                  position = (position + 1) % 2
                }

                if (isRelatedPair) {
                  rendered.push(
                    <div key={entry[0].number} id={`oll-${entry[0].number}`} className="md:col-span-2">
                      <div id={`oll-${entry[1].number}`} className="pair-container">
                        <OLLCaseCard ollCase={entry[0]} isHighlighted={highlightedOll === entry[0].number} />
                        <OLLCaseCard ollCase={entry[1]} isHighlighted={highlightedOll === entry[1].number} />
                      </div>
                    </div>,
                  )
                  position = 0
                } else {
                  rendered.push(
                    <div key={entry[0].number} id={`oll-${entry[0].number}`}>
                      <OLLCaseCard ollCase={entry[0]} isHighlighted={highlightedOll === entry[0].number} />
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
