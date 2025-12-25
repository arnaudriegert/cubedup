import { useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { pllCategories, PLLCase } from '../data/pllCases'
import { PLLContextType } from './PLL'
import PLLGrid from '../components/PLLGrid'
import AlgorithmBox from '../components/AlgorithmBox'
import { Color } from '../types/cube'
import { CORNER_COLOR, EDGE_COLOR } from '../components/PLLArrowOverlay'
import { getPlaygroundUrl } from '../utils/algorithmLinks'

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
  pllCase, isHighlighted, selectedColor,
}: {
  pllCase: PLLCase
  isHighlighted?: boolean
  selectedColor: Color
}) {
  return (
    <div className={`group case-card transition-all duration-300 relative ${isHighlighted ? 'case-card-highlight' : ''}`}>
      {/* Demo button - visible on hover */}
      <Link
        to={getPlaygroundUrl(`pll-${pllCase.name.toLowerCase()}`)}
        className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity
          px-2.5 py-1 text-xs font-medium rounded-lg
          bg-indigo-100 text-indigo-700 hover:bg-indigo-200
          flex items-center gap-1"
      >
        <span>▶</span>
        <span>Demo</span>
      </Link>
      <div className="flex flex-col items-center">
        <h3 className="case-card-title">
          {pllCase.name}
        </h3>

        <div className="mb-4">
          <PLLGrid pllCase={pllCase} selectedColor={selectedColor} showArrows />
        </div>

        {pllCase.swaps && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
            <ColorCodedDescription text={pllCase.swaps.description} />
          </p>
        )}

        <div className="w-full space-y-2">
          {pllCase.algorithms.map((algorithm, i) => (
            <AlgorithmBox key={i} algorithm={algorithm} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PLLDetailed() {
  const {
    highlightedPll,
    clearSearch,
    selectedColor,
  } = useOutletContext<PLLContextType>()

  // Clear highlight when clicking outside cards (but not on nav/header/input)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (highlightedPll === null) return

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
  }, [highlightedPll, clearSearch])

  return (
    <main className="main-content-detailed">
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

      {pllCategories.map((category, categoryIndex) => (
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
                  rendered.push(<div key={`spacer-${entry[0].name}`} className="hidden md:block" />)
                  position = (position + 1) % 2
                }

                if (isRelatedPair) {
                  rendered.push(
                    <div key={entry[0].name} id={`pll-${entry[0].name.toLowerCase()}`} className="md:col-span-2">
                      <div id={`pll-${entry[1].name.toLowerCase()}`} className="pair-container">
                        <PLLCaseCard
                          pllCase={entry[0]}
                          isHighlighted={highlightedPll === entry[0].name.toLowerCase()}
                          selectedColor={selectedColor}
                        />
                        <PLLCaseCard
                          pllCase={entry[1]}
                          isHighlighted={highlightedPll === entry[1].name.toLowerCase()}
                          selectedColor={selectedColor}
                        />
                      </div>
                    </div>,
                  )
                  position = 0
                } else {
                  rendered.push(
                    <div key={entry[0].name} id={`pll-${entry[0].name.toLowerCase()}`}>
                      <PLLCaseCard
                        pllCase={entry[0]}
                        isHighlighted={highlightedPll === entry[0].name.toLowerCase()}
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
