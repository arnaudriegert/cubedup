import {
  memo, useRef, useEffect, useCallback, useMemo,
} from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { pllCategories, PLLCase } from '../data/pllCases'
import { PLLContextType } from './PLL'
import PLLGrid from '../components/PLLGrid'
import AlgorithmBox from '../components/AlgorithmBox'
import { Color } from '../types/cube'
import { getPlaygroundUrl } from '../utils/algorithmLinks'

// Build a map from case name to category name
const categoryByCase = new Map<string, string>()
for (const category of pllCategories) {
  for (const entry of category.cases) {
    for (const c of entry) {
      categoryByCase.set(c.name.toLowerCase(), category.name)
    }
  }
}

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
  selectedColor: Color
}

const CompactCard = memo(function CompactCard({
  pllCase,
  isExpanded,
  onSelect,
  onDeselect,
  selectedColor,
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
      className={isExpanded ? 'compact-card-expanded' : 'compact-card'}
    >
      {isExpanded ? (
        <div className="group flex flex-col items-center relative">
          {/* Demo button - visible on hover */}
          <Link
            to={getPlaygroundUrl(`pll-${pllCase.name.toLowerCase()}`)}
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity
              px-2.5 py-1 text-xs font-medium rounded-lg
              bg-indigo-100 text-indigo-700 hover:bg-indigo-200
              flex items-center gap-1"
          >
            <span>▶</span>
            <span>Demo</span>
          </Link>
          <h3 className="case-card-title">
            {pllCase.name}
          </h3>
          <div className="mb-6">
            <PLLGrid pllCase={pllCase} selectedColor={selectedColor} size="medium" />
          </div>
          <div className="w-full space-y-2">
            {pllCase.algorithms.map((algorithm, i) => (
              <AlgorithmBox key={i} algorithm={algorithm} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <PLLGrid pllCase={pllCase} size="compact" selectedColor={selectedColor} />
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
    selectedCategory,
    selectedColor,
  } = useOutletContext<PLLContextType>()
  const gridRef = useRef<HTMLDivElement>(null)

  // Filter cases based on selected category
  const filteredCases = useMemo(() => {
    if (selectedCategory === null) {
      return allCases
    }
    return allCases.filter(c => categoryByCase.get(c.name.toLowerCase()) === selectedCategory)
  }, [selectedCategory])

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
    <main className="main-content-overview">
      <div
        ref={gridRef}
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))' }}
      >
        {filteredCases.map((pllCase) => (
          <CompactCard
            key={pllCase.name}
            pllCase={pllCase}
            isExpanded={expandedCase === pllCase.name}
            onSelect={handleSelect}
            onDeselect={clearSearch}
            selectedColor={selectedColor}
          />
        ))}
      </div>
    </main>
  )
}
