import { useState, useEffect, useRef, useCallback } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { ollCategories } from '../data/ollCases'

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
}

export default function OLL() {
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')
  const [instantValue, setInstantValue] = useState('')
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
  }

  return (
    <div className="page-bg">
      <div className="sticky top-0 z-20">
        {/* Header */}
        <header className="header-gradient text-center py-10">
          <h1 className="text-4xl font-bold mb-2">
            OLL - Orientation of Last Layer
          </h1>
          <p className="text-slate-300 text-sm">
            Orient all pieces on the last layer
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
                  to="/oll/overview"
                  className={isOverview ? 'tab-active' : 'tab'}
                >
                  Overview
                </Link>
                <Link
                  to="/oll/detailed"
                  className={!isOverview ? 'tab-active' : 'tab'}
                >
                  Detailed
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
                className={`w-36 px-3 py-2 text-sm rounded-lg bg-white text-gray-800 placeholder-gray-400 border-2 focus:outline-none transition-colors ${
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
                {ollCategories.map((category) => (
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
