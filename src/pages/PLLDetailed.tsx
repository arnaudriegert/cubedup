import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { pllCategories, PLLCase } from '../data/pllCases'
import { PLLContextType } from './PLL'
import PLLGrid from '../components/PLLGrid'
import AlgorithmText from '../components/AlgorithmText'
import { Color } from '../types/cube'

function PLLCaseCard({
  pllCase, isHighlighted, selectedColor,
}: {
  pllCase: PLLCase
  isHighlighted?: boolean
  selectedColor: Color
}) {
  return (
    <div className={`group case-card transition-all duration-300 ${isHighlighted ? 'case-card-highlight' : ''}`}>
      <div className="flex flex-col items-center">
        <h3 className="case-card-title">
          {pllCase.name}
        </h3>

        <div className="mb-6">
          <PLLGrid pllCase={pllCase} selectedColor={selectedColor} />
        </div>

        <div className="w-full space-y-2">
          {pllCase.algorithms.map((algorithm, i) => {
            const displayText = algorithm.shorthand || algorithm.full
            return (
              <div key={i} className="algorithm-box text-center group-hover:algorithm-box-hover">
                <div className="group-hover:hidden">
                  <AlgorithmText text={displayText} />
                </div>
                <div className="hidden group-hover:block">
                  <AlgorithmText text={algorithm.full} />
                </div>
              </div>
            )
          })}
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
    <>
      {/* Main content */}
      <main className="main-content-detailed">
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
                          <PLLCaseCard pllCase={entry[0]} isHighlighted={highlightedPll === entry[0].name.toLowerCase()} selectedColor={selectedColor} />
                          <PLLCaseCard pllCase={entry[1]} isHighlighted={highlightedPll === entry[1].name.toLowerCase()} selectedColor={selectedColor} />
                        </div>
                      </div>,
                    )
                    position = 0
                  } else {
                    rendered.push(
                      <div key={entry[0].name} id={`pll-${entry[0].name.toLowerCase()}`}>
                        <PLLCaseCard pllCase={entry[0]} isHighlighted={highlightedPll === entry[0].name.toLowerCase()} selectedColor={selectedColor} />
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

      <footer className="page-footer">
        <p>&copy; 2025 CFOP Learning Guide</p>
      </footer>
    </>
  )
}
