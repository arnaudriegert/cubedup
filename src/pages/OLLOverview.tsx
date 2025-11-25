import { memo, useRef, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ollCategories, OLLCase } from '../data/ollCases'
import { OLLContextType } from './OLL'
import OLLGrid from '../components/OLLGrid'
import AlgorithmText from '../components/AlgorithmText'

// Flatten all OLL cases for the overview grid (static, computed once)
const allCases: OLLCase[] = (() => {
  const cases: OLLCase[] = []
  for (const category of ollCategories) {
    for (const entry of category.cases) {
      cases.push(...entry)
    }
  }
  return cases.sort((a, b) => a.number - b.number)
})()

interface CompactCardProps {
  ollCase: OLLCase
  isExpanded: boolean
  onSelect: (ollNumber: number) => void
  onDeselect: () => void
}

const CompactCard = memo(function CompactCard({
  ollCase,
  isExpanded,
  onSelect,
  onDeselect,
}: CompactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Scroll expanded card into view (overview only - detailed view uses parent scroll in OLL.tsx)
  useEffect(() => {
    if (isExpanded && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [isExpanded])

  const handleClick = () => {
    if (isExpanded) {
      onDeselect()
    } else {
      onSelect(ollCase.number)
    }
  }

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`OLL ${ollCase.number} - ${ollCase.name}`}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
      className={`
        cursor-pointer transition-all duration-300 ease-in-out
        ${isExpanded
      ? 'col-span-2 row-span-2 sm:col-span-3 md:col-span-4 p-4 bg-white rounded-xl shadow-lg border-2 border-blue-300'
      : 'p-3 bg-white rounded-lg shadow hover:shadow-md hover:scale-105 border border-gray-200'
    }
      `}
    >
      {isExpanded ? (
        <div className="group flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            OLL {ollCase.number} - {ollCase.name}
          </h3>
          <div className="mb-6">
            <OLLGrid orientations={ollCase.orientations} />
          </div>
          <div className="w-full space-y-2">
            {ollCase.algorithms.map((algorithm, i) => {
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
      ) : (
        <div className="flex flex-col items-center">
          <OLLGrid orientations={ollCase.orientations} size="compact" />
          <span className="mt-1 text-xs font-medium text-gray-600">
            {ollCase.number}
          </span>
        </div>
      )}
    </div>
  )
})

export default function OLLOverview() {
  const {
    debouncedSearch,
    setSearch,
    clearSearch,
  } = useOutletContext<OLLContextType>()
  const gridRef = useRef<HTMLDivElement>(null)

  // Derive expanded case from search
  const searchNum = parseInt(debouncedSearch, 10)
  const expandedCase = (searchNum >= 1 && searchNum <= 57) ? searchNum : null

  // Close expanded card when clicking outside the grid
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (expandedCase !== null && gridRef.current) {
        const target = e.target as HTMLElement
        // Don't clear if clicking on navigation, header, or input
        if (target.closest('nav') || target.closest('header') || target.closest('input')) {
          return
        }
        if (!gridRef.current.contains(target)) {
          clearSearch()
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [expandedCase, clearSearch])

  // Escape to close expanded card
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !(e.target instanceof HTMLInputElement)) {
        clearSearch()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [clearSearch])

  // Stable callbacks for memoized cards
  const handleSelect = useCallback((ollNumber: number) => {
    setSearch(String(ollNumber))
  }, [setSearch])

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div
        ref={gridRef}
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))' }}
      >
        {allCases.map((ollCase) => (
          <CompactCard
            key={ollCase.number}
            ollCase={ollCase}
            isExpanded={expandedCase === ollCase.number}
            onSelect={handleSelect}
            onDeselect={clearSearch}
          />
        ))}
      </div>
    </main>
  )
}
