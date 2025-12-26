import {
  memo, useRef, useEffect, useCallback, useMemo,
} from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ollCategories, OLLCase } from '../data/ollCases'
import { OLLContextType } from './OLL'
import OLLGrid from '../components/OLLGrid'
import { AlgorithmDisplay } from '../components/algorithm'
import InverseBadge from '../components/InverseBadge'
import { getPlaygroundUrlForAlgorithm } from '../utils/algorithmLinks'
import type { AlgorithmId } from '../types/algorithm'

// Build a map from case number to category name
const categoryByCase = new Map<number, string>()
for (const category of ollCategories) {
  for (const entry of category.cases) {
    for (const c of entry) {
      categoryByCase.set(c.number, category.name)
    }
  }
}

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
      className={isExpanded ? 'compact-card-expanded' : 'compact-card'}
    >
      {isExpanded ? (
        (() => {
          const firstAlgorithmId: AlgorithmId = `oll-${ollCase.number}-1`
          return (
            <div className="group flex flex-col relative">
              {/* Demo button - visible on hover */}
              <Link
                to={getPlaygroundUrlForAlgorithm(firstAlgorithmId)}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity
                  px-2.5 py-1 text-xs font-medium rounded-lg
                  bg-indigo-100 text-indigo-700 hover:bg-indigo-200
                  flex items-center gap-1"
              >
                <span>▶</span>
                <span>Demo</span>
              </Link>
              {ollCase.inverseOf && (
                <InverseBadge
                  inverseCaseNumber={ollCase.inverseOf}
                  onClick={onSelect}
                  className="absolute top-0 right-0"
                />
              )}
              <h3 className="case-card-title text-left">
                OLL {ollCase.number} - {ollCase.name}
              </h3>
              <div className="mb-6 flex justify-center">
                <OLLGrid orientations={ollCase.orientations} size="medium" />
              </div>
              <div className="w-full space-y-3">
                {ollCase.algorithms.map((algorithm, i) => (
                  <AlgorithmDisplay key={i} algorithm={algorithm} size="sm" pinnable />
                ))}
              </div>
            </div>
          )
        })()
      ) : (
        <div className="flex flex-col items-center relative">
          {ollCase.inverseOf && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"
              title={`Has inverse: OLL ${ollCase.inverseOf}`}
            />
          )}
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
    selectedCategory,
  } = useOutletContext<OLLContextType>()
  const gridRef = useRef<HTMLDivElement>(null)

  // Filter cases based on selected category
  const filteredCases = useMemo(() => {
    if (selectedCategory === null) {
      return allCases
    }
    return allCases.filter(c => categoryByCase.get(c.number) === selectedCategory)
  }, [selectedCategory])

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
    <main className="main-content-overview">
      <div
        ref={gridRef}
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(7rem, 1fr))' }}
      >
        {filteredCases.map((ollCase) => (
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
