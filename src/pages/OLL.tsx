import {
  useState, useEffect, useRef, useCallback,
} from 'react'
import {
  Outlet, Link, useLocation,
} from 'react-router-dom'
import { ollCategories } from '../data/ollCases'
import CategoryNav from '../components/CategoryNav'
import SEOHead from '../components/SEOHead'

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
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
  const [searchValue, setSearchValue] = useState('')
  const [instantValue, setInstantValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const debouncedFromInput = useDebounce(searchValue, 500)

  // Use instant value if it matches current search, otherwise use debounced
  const debouncedSearch = instantValue === searchValue ? instantValue : debouncedFromInput

  const isOverview = location.pathname.includes('/overview')

  // Derive highlightedOll from debouncedSearch (no separate state needed)
  const searchNum = parseInt(debouncedSearch, 10)
  const highlightedOll = (searchNum >= 1 && searchNum <= 57) ? searchNum : null

  // Check if search value is invalid
  const isInvalidSearch = searchValue !== '' && (
    !/^\d+$/.test(searchValue) ||
    parseInt(searchValue, 10) < 1 ||
    parseInt(searchValue, 10) > 57
  )

  const clearSearch = useCallback(() => {
    setSearchValue('')
    setInstantValue('')
  }, [])

  const setSearchImmediate = useCallback((value: string) => {
    setSearchValue(value)
    setInstantValue(value)
  }, [])

  // Keyboard shortcut: '/' to focus search, Escape to clear
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === 'Escape') {
          searchInputRef.current?.blur()
          clearSearch()
        }
        return
      }
      if (e.key === '/') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [clearSearch])

  // Scroll to highlighted OLL in detailed view (only if not already visible)
  useEffect(() => {
    if (highlightedOll !== null && !isOverview) {
      const element = document.getElementById(`oll-${highlightedOll}`)
      if (element) {
        const rect = element.getBoundingClientRect()
        // Account for sticky header (approximately 288px / 18rem)
        const headerHeight = 288
        const isVisible = rect.top >= headerHeight && rect.bottom <= window.innerHeight
        if (!isVisible) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }
      }
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
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="OLL # (press /)"
              aria-label="Search OLL case by number"
              className={`w-36 search-input ${isInvalidSearch ? 'search-input-error' : 'search-input-valid'}`}
            />
          </div>

          {/* Category navigation */}
          <CategoryNav
            categories={ollCategories}
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
