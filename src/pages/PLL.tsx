import { useState, useEffect } from 'react'
import {
  Outlet, Link, useLocation,
} from 'react-router-dom'
import { pllGroups, getPLLCases } from '../data/cases'
import CategoryNav from '../components/CategoryNav'
import ColorRemote from '../components/ColorRemote'
import SEOHead from '../components/SEOHead'
import { Color } from '../types/cube'
import { useCaseSearch, scrollToHighlighted } from '../hooks'

// Get all PLL case names for validation
const allPLLNames = getPLLCases().map(c => c.name.toLowerCase())

// PLL search validation: must be a valid PLL name
function validatePLLSearch(value: string): string | null {
  const lower = value.toLowerCase().trim()
  return allPLLNames.includes(lower) ? lower : null
}

// Context type exported for child routes
export interface PLLContextType {
  debouncedSearch: string
  highlightedPll: string | null
  setSearch: (value: string) => void
  clearSearch: () => void
  selectedCategory: string | null
  selectedColor: Color
}

export default function PLL() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialSelect = searchParams.get('select') || ''

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color>(Color.BLUE)

  const {
    searchValue,
    debouncedSearch,
    highlightedCase: highlightedPll,
    isInvalidSearch,
    setSearch,
    setSearchImmediate,
    clearSearch,
    searchInputRef,
  } = useCaseSearch({
    validateSearch: validatePLLSearch,
    initialValue: initialSelect,
  })

  const isOverview = location.pathname.includes('/overview')

  // Scroll to highlighted PLL in detailed view
  useEffect(() => {
    if (highlightedPll !== null && !isOverview) {
      scrollToHighlighted(`pll-${highlightedPll}`)
    }
  }, [highlightedPll, isOverview])

  // Context to pass to child routes
  const outletContext: PLLContextType = {
    debouncedSearch,
    highlightedPll,
    setSearch: setSearchImmediate,
    clearSearch,
    selectedCategory,
    selectedColor,
  }

  return (
    <>
      <SEOHead
        title="PLL - Permutation of Last Layer"
        description="Learn all 21 PLL algorithms organized by symmetry. Master last layer permutation with headlight recognition and swap patterns for faster solving."
        path="/pll"
      />

      {/* Header */}
      <header className="header-gradient text-center py-10">
        <h1 className="page-header-title">
          PLL - Permutation of Last Layer
        </h1>
        <p className="page-header-subtitle text-slate-300">
          Permute all pieces to their correct positions
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
                to="/pll/detailed"
                className={!isOverview ? 'tab-active' : 'tab'}
              >
                Detailed
              </Link>
              <Link
                to="/pll/overview"
                className={isOverview ? 'tab-active' : 'tab'}
              >
                Overview
              </Link>
            </div>

            {/* Search */}
            <input
              ref={searchInputRef}
              type="search"
              maxLength={3}
              value={searchValue}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="PLL name (press /)"
              aria-label="Search PLL case by name"
              className={`w-40 search-input ${isInvalidSearch ? 'search-input-error' : 'search-input-valid'}`}
            />
          </div>

          {/* Category navigation */}
          <CategoryNav
            categories={pllGroups}
            mode={isOverview ? 'filter' : 'jump'}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </nav>

      {/* Child route content */}
      <Outlet context={outletContext} />

      {/* Floating color remote */}
      <ColorRemote
        selectedColor={selectedColor}
        onColorSelect={setSelectedColor}
      />
    </>
  )
}
