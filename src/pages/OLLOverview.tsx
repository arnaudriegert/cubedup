import {
  memo, useRef, useEffect, useCallback, useMemo,
} from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import {
  ollGroups, getCase, getAlgorithmsForCase,
} from '../data/cases'

import { OLLContextType } from './OLL'
import OLLGrid from '../components/OLLGrid'
import { AlgorithmDisplay } from '../components/algorithm'
import InverseBadge from '../components/InverseBadge'
import { getPlaygroundUrlForAlgorithm } from '../utils/algorithmLinks'
import { useClickOutside, useEscapeKey } from '../hooks'
import type { AlgorithmId, Case } from '../types/algorithm'

// Build a map from case number to category name
const categoryByCase = new Map<number, string>()
for (const group of ollGroups) {
  for (const entry of group.cases) {
    for (const caseId of entry) {
      const c = getCase(caseId)
      if (c?.number) {
        categoryByCase.set(c.number, group.name)
      }
    }
  }
}

// Flatten all OLL cases for the overview grid (static, computed once)
const allCases: Case[] = (() => {
  const caseList: Case[] = []
  for (const group of ollGroups) {
    for (const entry of group.cases) {
      for (const caseId of entry) {
        const c = getCase(caseId)
        if (c) caseList.push(c)
      }
    }
  }
  return caseList.sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
})()

interface CompactCardProps {
  caseData: Case
  isExpanded: boolean
  onSelect: (ollNumber: number) => void
  onDeselect: () => void
}

const CompactCard = memo(function CompactCard({
  caseData,
  isExpanded,
  onSelect,
  onDeselect,
}: CompactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const caseNumber = caseData.number ?? 0
  const inverseCase = caseData.inverseOf ? getCase(caseData.inverseOf) : null
  const inverseNumber = inverseCase?.number

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
      onSelect(caseNumber)
    }
  }

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`OLL ${caseNumber} - ${caseData.name}`}
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
              {inverseNumber && (
                <InverseBadge
                  inverseCaseNumber={inverseNumber}
                  onClick={onSelect}
                  className="absolute top-0 right-0"
                />
              )}
              <h3 className="case-card-title text-left">
                OLL {caseNumber} - {caseData.name}
              </h3>
              <div className="mb-6 flex justify-center">
                <OLLGrid caseId={caseData.id} size="medium" />
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
        <div className="flex flex-col items-center relative">
          {inverseNumber && (
            <span
              className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full"
              title={`Has inverse: OLL ${inverseNumber}`}
            />
          )}
          <OLLGrid caseId={caseData.id} size="compact" />
          <span className="mt-1 text-xs font-medium text-gray-600">
            {caseNumber}
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
    return allCases.filter(c => c.number && categoryByCase.get(c.number) === selectedCategory)
  }, [selectedCategory])

  // Derive expanded case from search
  const searchNum = parseInt(debouncedSearch, 10)
  const expandedCase = (searchNum >= 1 && searchNum <= 57) ? searchNum : null

  // Close expanded card when clicking outside the grid or pressing Escape
  useClickOutside({
    containerRef: gridRef,
    onClickOutside: clearSearch,
    enabled: expandedCase !== null,
  })
  useEscapeKey(clearSearch, expandedCase !== null)

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
        {filteredCases.map((caseData) => (
          <CompactCard
            key={caseData.number}
            caseData={caseData}
            isExpanded={expandedCase === caseData.number}
            onSelect={handleSelect}
            onDeselect={clearSearch}
          />
        ))}
      </div>
    </main>
  )
}
