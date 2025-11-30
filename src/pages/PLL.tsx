import {
  useState, useEffect, useRef, useCallback,
} from 'react'
import {
  Outlet, Link, useLocation,
} from 'react-router-dom'
import { pllCategories } from '../data/pllCases'
import CategoryNav from '../components/CategoryNav'
import ColorRemote from '../components/ColorRemote'
import SEOHead from '../components/SEOHead'
import { Color } from '../types/cube'

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
  cat.cases.flatMap(entry => entry.map(c => c.name.toLowerCase())))

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
  const [searchValue, setSearchValue] = useState('')
  const [instantValue, setInstantValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color>(Color.BLUE)
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

      {/* Introduction */}
      <section className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="body-text text-slate-600 mb-3">
            The 21 PLL cases rearrange last-layer pieces without disturbing their orientation.
            Recognition is key: identify cases quickly from side-face patterns. Look for
            <strong> headlights</strong> (two matching colors on one side)—their presence and position
            narrows down possibilities dramatically.
          </p>
          <p className="text-sm text-slate-500">
            <strong>Learning strategy:</strong> Start with Edges Only (Ua, Ub, H, Z)—common cases with short algorithms.
            Then learn T and Jb from Adjacent Corners; they appear frequently. G-perms can wait until last;
            they're complex but occur less often. Use the color selector to practice recognition from any angle.
          </p>
        </div>
      </section>

      {/* Tab nav + Search + Category links */}
      <nav className="section-nav sticky top-0 z-20">
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
              className={`w-40 search-input ${isInvalidSearch ? 'search-input-error' : 'search-input-valid'}`}
            />
          </div>

          {/* Category navigation */}
          <CategoryNav
            categories={pllCategories}
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
