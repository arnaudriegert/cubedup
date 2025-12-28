import {
  useState, useEffect, type ReactNode,
} from 'react'
import {
  Outlet, Link, useLocation,
} from 'react-router-dom'
import CategoryNav from './CategoryNav'
import { useCaseSearch, scrollToHighlighted } from '../hooks'
import type { CaseGroup } from '../types/algorithm'

export interface CasePageContextParams {
  debouncedSearch: string
  highlightedCase: string | null
  setSearch: (value: string) => void
  clearSearch: () => void
  selectedCategory: string | null
}

export interface CasePageLayoutProps {
  title: string
  subtitle: string
  basePath: string
  scrollIdPrefix: string
  searchPlaceholder: string
  searchInputMode?: 'numeric' | 'text'
  validateSearch: (value: string) => string | null
  groups: CaseGroup[]
  buildContext: (params: CasePageContextParams) => unknown
  children?: ReactNode
}

export function CasePageLayout({
  title,
  subtitle,
  basePath,
  scrollIdPrefix,
  searchPlaceholder,
  searchInputMode,
  validateSearch,
  groups,
  buildContext,
  children,
}: CasePageLayoutProps) {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const initialSelect = searchParams.get('select') || ''

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const {
    searchValue,
    debouncedSearch,
    highlightedCase,
    isInvalidSearch,
    setSearch,
    setSearchImmediate,
    clearSearch,
    searchInputRef,
  } = useCaseSearch({
    validateSearch,
    initialValue: initialSelect,
  })

  const isOverview = location.pathname.includes('/overview')

  useEffect(() => {
    if (highlightedCase !== null && !isOverview) {
      scrollToHighlighted(`${scrollIdPrefix}-${highlightedCase}`)
    }
  }, [highlightedCase, isOverview, scrollIdPrefix])

  const outletContext = buildContext({
    debouncedSearch,
    highlightedCase,
    setSearch: setSearchImmediate,
    clearSearch,
    selectedCategory,
  })

  return (
    <>
      <header className="header-gradient text-center py-10">
        <h1 className="page-header-title">{title}</h1>
        <p className="page-header-subtitle text-slate-300">{subtitle}</p>
      </header>

      <nav className="section-nav sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <div className="tab-nav">
              <Link to={`${basePath}/detailed`} className={!isOverview ? 'tab-active' : 'tab'}>
                Detailed
              </Link>
              <Link to={`${basePath}/overview`} className={isOverview ? 'tab-active' : 'tab'}>
                Overview
              </Link>
            </div>

            <input
              ref={searchInputRef}
              type="search"
              inputMode={searchInputMode}
              maxLength={3}
              value={searchValue}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className={`w-40 search-input ${isInvalidSearch ? 'search-input-error' : 'search-input-valid'}`}
            />
          </div>

          <CategoryNav
            categories={groups}
            mode={isOverview ? 'filter' : 'jump'}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </nav>

      <Outlet context={outletContext} />
      {children}
    </>
  )
}
