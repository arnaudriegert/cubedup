import { useState, useEffect } from 'react'
import {
  Outlet, Link, useLocation,
} from 'react-router-dom'
import { ollGroups } from '../data/cases'
import CategoryNav from '../components/CategoryNav'
import SEOHead from '../components/SEOHead'
import { useCaseSearch, scrollToHighlighted } from '../hooks'

// OLL search validation: must be number 1-57
function validateOLLSearch(value: string): number | null {
  const num = parseInt(value, 10)
  return (num >= 1 && num <= 57) ? num : null
}

// Context type exported for child routes
export interface OLLContextType {
  debouncedSearch: string
  highlightedOll: number | null
  setSearch: (value: string) => void
  clearSearch: () => void
  selectedCategory: string | null
}

export default function OLL() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialSelect = searchParams.get('select') || ''

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const {
    searchValue,
    debouncedSearch,
    highlightedCase: highlightedOll,
    isInvalidSearch,
    setSearch,
    setSearchImmediate,
    clearSearch,
    searchInputRef,
  } = useCaseSearch({
    validateSearch: validateOLLSearch,
    initialValue: initialSelect,
  })

  const isOverview = location.pathname.includes('/overview')

  // Scroll to highlighted OLL in detailed view
  useEffect(() => {
    if (highlightedOll !== null && !isOverview) {
      scrollToHighlighted(`oll-${highlightedOll}`)
    }
  }, [highlightedOll, isOverview])

  // Context to pass to child routes
  const outletContext: OLLContextType = {
    debouncedSearch,
    highlightedOll,
    setSearch: setSearchImmediate,
    clearSearch,
    selectedCategory,
  }

  return (
    <>
      <SEOHead
        title="OLL - Orientation of Last Layer"
        description="Learn all 57 OLL algorithms organized by symmetry. Master last layer orientation with visual patterns and related case groupings for faster memorization."
        path="/oll"
      />

      {/* Header */}
      <header className="header-gradient text-center py-10">
        <h1 className="page-header-title">
          OLL - Orientation of Last Layer
        </h1>
        <p className="page-header-subtitle text-slate-300">
          Orient all pieces on the last layer
        </p>
      </header>

      {/* Tab nav + Search + Category links */}
      <nav className="section-nav sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          {/* Top row: Tabs + Search */}
          <div className="flex justify-between items-center">
            {/* Tabs */}
            <div className="tab-nav">
              <Link
                to="/oll/detailed"
                className={!isOverview ? 'tab-active' : 'tab'}
              >
                Detailed
              </Link>
              <Link
                to="/oll/overview"
                className={isOverview ? 'tab-active' : 'tab'}
              >
                Overview
              </Link>
            </div>

            {/* Search */}
            <input
              ref={searchInputRef}
              type="search"
              inputMode="numeric"
              maxLength={2}
              value={searchValue}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="OLL # (press /)"
              aria-label="Search OLL case by number"
              className={`w-36 search-input ${isInvalidSearch ? 'search-input-error' : 'search-input-valid'}`}
            />
          </div>

          {/* Category navigation */}
          <CategoryNav
            categories={ollGroups}
            mode={isOverview ? 'filter' : 'jump'}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </nav>

      {/* Child route content */}
      <Outlet context={outletContext} />
    </>
  )
}
