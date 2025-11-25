import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { pllCategories } from '../data/pllCases'

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

// Get all PLL case names for validation
const allPLLNames = pllCategories.flatMap(cat =>
  cat.cases.flatMap(entry => entry.map(c => c.name.toLowerCase()))
)

// Context type exported for child routes
export interface PLLContextType {
  debouncedSearch: string
  highlightedPll: string | null
  setSearch: (value: string) => void
  clearSearch: () => void
}

export default function PLL() {
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')
  const [instantValue, setInstantValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const debouncedFromInput = useDebounce(searchValue, 500)

  // Use instant value if it matches current search, otherwise use debounced
  const debouncedSearch = instantValue === searchValue ? instantValue : debouncedFromInput

  const isOverview = location.pathname.includes('/overview')

  // Derive highlightedPll from debouncedSearch
  const searchLower = debouncedSearch.toLowerCase().trim()
  const highlightedPll = allPLLNames.includes(searchLower) ? searchLower : null

  // Check if search value is invalid
  const isInvalidSearch = searchValue !== '' && !allPLLNames.includes(searchValue.toLowerCase().trim())

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

  // Scroll to highlighted PLL in detailed view (only if not already visible)
  useEffect(() => {
    if (highlightedPll !== null && !isOverview) {
      const element = document.getElementById(`pll-${highlightedPll}`)
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
  }, [highlightedPll, isOverview])

  // Context to pass to child routes
  const outletContext: PLLContextType = {
    debouncedSearch,
    highlightedPll,
    setSearch: setSearchImmediate,
    clearSearch,
  }

  return (
    <div className="page-bg">
      <div className="sticky top-0 z-20">
        {/* Header */}
        <header className="header-gradient text-center py-10">
          <h1 className="text-4xl font-bold mb-2">
            PLL - Permutation of Last Layer
          </h1>
          <p className="text-slate-300 text-sm">
            Permute all pieces to their correct positions
          </p>
        </header>

        {/* Tab nav + Search + Category links */}
        <nav className="section-nav">
          <div className="max-w-5xl mx-auto flex flex-col gap-3">
            {/* Top row: Tabs + Search */}
            <div className="flex justify-between items-center">
              {/* Tabs */}
              <div className="tab-nav">
                <Link
                  to="/pll/overview"
                  className={isOverview ? 'tab-active' : 'tab'}
                >
                  Overview
                </Link>
                <Link
                  to="/pll/detailed"
                  className={!isOverview ? 'tab-active' : 'tab'}
                >
                  Detailed
                </Link>
              </div>

              {/* Search */}
              <input
                ref={searchInputRef}
                type="search"
                maxLength={3}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="PLL name (press /)"
                aria-label="Search PLL case by name"
                className={`w-40 px-3 py-2 text-sm rounded-lg bg-white text-gray-800 placeholder-gray-400 border-2 focus:outline-none transition-colors ${
                  isInvalidSearch
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-gray-200 focus:border-blue-500'
                }`}
              />
            </div>

            {/* Category links - only in detailed view */}
            {!isOverview && (
              <div className="flex flex-wrap gap-2 justify-center items-center">
                <span className="text-slate-500 text-sm mr-2">Jump to:</span>
                {pllCategories.map((category) => (
                  <a
                    key={category.name}
                    href={`#${category.name.replace(/\s+/g, '-').toLowerCase()}`}
                    className="section-nav-link"
                  >
                    {category.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Child route content */}
      <Outlet context={outletContext} />
    </div>
  )
}
