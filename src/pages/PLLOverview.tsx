import { memo, useRef, useEffect, useCallback } from 'react'
import { useOutletContext } from 'react-router-dom'
import { pllCategories, PLLCase } from '../data/pllCases'
import { PLLContextType } from './PLL'
import PLLGrid from '../components/PLLGrid'
import AlgorithmText from '../components/AlgorithmText'

// Flatten all PLL cases for the overview grid (static, computed once)
const allCases: PLLCase[] = (() => {
  const cases: PLLCase[] = []
  for (const category of pllCategories) {
    for (const entry of category.cases) {
      cases.push(...entry)
    }
  }
  return cases
})()

interface CompactCardProps {
  pllCase: PLLCase
  isExpanded: boolean
  onSelect: (pllName: string) => void
  onDeselect: () => void
}

const CompactCard = memo(function CompactCard({
  pllCase,
  isExpanded,
  onSelect,
  onDeselect,
}: CompactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Scroll expanded card into view (overview only - detailed view uses parent scroll in PLL.tsx)
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
      onSelect(pllCase.name)
    }
  }

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`PLL ${pllCase.name}`}
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
            {pllCase.name}
          </h3>
          <div className="mb-6">
            <PLLGrid pllCase={pllCase} />
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
      ) : (
        <div className="flex flex-col items-center">
          <PLLGrid pllCase={pllCase} size="compact" />
          <span className="mt-1 text-xs font-medium text-gray-600">
            {pllCase.name}
          </span>
        </div>
      )}
    </div>
  )
})

export default function PLLOverview() {
  const {
    debouncedSearch,
    setSearch,
    clearSearch,
  } = useOutletContext<PLLContextType>()
  const gridRef = useRef<HTMLDivElement>(null)

  // Derive expanded case from search
  const searchLower = debouncedSearch.toLowerCase().trim()
  const expandedCase = allCases.find(c => c.name.toLowerCase() === searchLower)?.name || null

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
  const handleSelect = useCallback((pllName: string) => {
    setSearch(pllName)
  }, [setSearch])

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div
        ref={gridRef}
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))' }}
      >
        {allCases.map((pllCase) => (
          <CompactCard
            key={pllCase.name}
            pllCase={pllCase}
            isExpanded={expandedCase === pllCase.name}
            onSelect={handleSelect}
            onDeselect={clearSearch}
          />
        ))}
      </div>
    </main>
  )
}
