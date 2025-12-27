import {
  memo, useRef, useEffect, useCallback, useMemo,
} from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  pllGroups, getCase, getAlgorithmsForCase,
} from '../data/cases'

import { PLLContextType } from './PLL'
import PLLGrid from '../components/PLLGrid'
import { AlgorithmDisplay } from '../components/algorithm'
import { Color } from '../types/cube'
import { getPlaygroundUrlForAlgorithm } from '../utils/algorithmLinks'
import { useClickOutside, useEscapeKey } from '../hooks'
import type { AlgorithmId, Case } from '../types/algorithm'

// Build a map from case name to category name
const categoryByCase = new Map<string, string>()
for (const group of pllGroups) {
  for (const entry of group.cases) {
    for (const caseId of entry) {
      const c = getCase(caseId)
      if (c) {
        categoryByCase.set(c.name.toLowerCase(), group.name)
      }
    }
  }
}

// Flatten all PLL cases for the overview grid (static, computed once)
const allCases: Case[] = (() => {
  const caseList: Case[] = []
  for (const group of pllGroups) {
    for (const entry of group.cases) {
      for (const caseId of entry) {
        const c = getCase(caseId)
        if (c) caseList.push(c)
      }
    }
  }
  return caseList
})()

interface CompactCardProps {
  caseData: Case
  isExpanded: boolean
  onSelect: (pllName: string) => void
  onDeselect: () => void
  selectedColor: Color
}

const CompactCard = memo(function CompactCard({
  caseData,
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
      onSelect(caseData.name)
    }
  }

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`PLL ${caseData.name}`}
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
          const algorithms = getAlgorithmsForCase(caseData.id)
          const firstAlgorithmId: AlgorithmId = algorithms[0]?.id ?? caseData.id
          return (
            <div className="group flex flex-col items-center relative">
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
              <h3 className="case-card-title">
                {caseData.name}
              </h3>
              <div className="mb-6">
                <PLLGrid caseId={caseData.id} selectedColor={selectedColor} size="medium" />
              </div>
              <div className="w-full space-y-3">
                {algorithms.map((algorithm, i) => (
                  <AlgorithmDisplay key={i} algorithm={algorithm} size="sm" pinnable />
                ))}
              </div>
            </div>
          )
        })()
      ) : (
        <div className="flex flex-col items-center">
          <PLLGrid caseId={caseData.id} size="compact" selectedColor={selectedColor} />
          <span className="mt-1 text-xs font-medium text-gray-600">
            {caseData.name}
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

  // Close expanded card when clicking outside the grid or pressing Escape
  useClickOutside({
    containerRef: gridRef,
    onClickOutside: clearSearch,
    enabled: expandedCase !== null,
  })
  useEscapeKey(clearSearch, expandedCase !== null)

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
        {filteredCases.map((caseData) => (
          <CompactCard
            key={caseData.name}
            caseData={caseData}
            isExpanded={expandedCase === caseData.name}
            onSelect={handleSelect}
            onDeselect={clearSearch}
            selectedColor={selectedColor}
          />
        ))}
      </div>
    </main>
  )
}
