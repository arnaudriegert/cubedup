import {
  useState, useEffect, useCallback, useRef,
} from 'react'
import { useDebounce } from './useDebounce'

export interface UseCaseSearchOptions<T> {
  /** Validate and normalize search input. Return null if invalid. */
  validateSearch: (value: string) => T | null
  /** Initial search value (e.g., from URL params) */
  initialValue?: string
  /** Debounce delay in ms (default: 500) */
  debounceMs?: number
}

export interface UseCaseSearchResult<T> {
  /** Current raw search input value */
  searchValue: string
  /** Debounced search value */
  debouncedSearch: string
  /** Validated/normalized search result (null if invalid) */
  highlightedCase: T | null
  /** Whether current search value is invalid */
  isInvalidSearch: boolean
  /** Set search value (with normal debounce) */
  setSearch: (value: string) => void
  /** Set search value immediately (no debounce) */
  setSearchImmediate: (value: string) => void
  /** Clear search value */
  clearSearch: () => void
  /** Ref to attach to search input for keyboard shortcuts */
  searchInputRef: React.RefObject<HTMLInputElement | null>
}

/**
 * Shared search hook for case pages (OLL, PLL).
 * Handles debouncing, validation, and keyboard shortcuts (/ to focus, Escape to clear).
 */
export function useCaseSearch<T>({
  validateSearch,
  initialValue = '',
  debounceMs = 500,
}: UseCaseSearchOptions<T>): UseCaseSearchResult<T> {
  const [searchValue, setSearchValue] = useState(initialValue)
  const [instantValue, setInstantValue] = useState(initialValue)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const debouncedFromInput = useDebounce(searchValue, debounceMs)

  // Use instant value if it matches current search, otherwise use debounced
  const debouncedSearch = instantValue === searchValue ? instantValue : debouncedFromInput

  // Derive highlighted case from debounced search
  const highlightedCase = validateSearch(debouncedSearch)

  // Check if search value is invalid
  const isInvalidSearch = searchValue !== '' && validateSearch(searchValue) === null

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

  return {
    searchValue,
    debouncedSearch,
    highlightedCase,
    isInvalidSearch,
    setSearch: setSearchValue,
    setSearchImmediate,
    clearSearch,
    searchInputRef,
  }
}

/**
 * Scroll to a highlighted element if not visible.
 * Call this in a useEffect when highlightedCase changes.
 */
export function scrollToHighlighted(elementId: string, headerHeight = 288): void {
  const element = document.getElementById(elementId)
  if (element) {
    const rect = element.getBoundingClientRect()
    const isVisible = rect.top >= headerHeight && rect.bottom <= window.innerHeight
    if (!isVisible) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }
}
