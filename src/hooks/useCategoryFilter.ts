import {
  useState, useMemo, useCallback,
} from 'react'

export interface UseCategoryFilterOptions<T> {
  /** All cases to filter */
  allCases: T[]
  /** Get the category name for a case */
  getCaseCategory: (caseItem: T) => string | undefined
}

export interface UseCategoryFilterResult<T> {
  /** Currently selected category (null = all) */
  selectedCategory: string | null
  /** Set the selected category */
  setCategory: (category: string | null) => void
  /** Clear the category filter */
  clearCategory: () => void
  /** Cases filtered by selected category */
  filteredCases: T[]
}

/**
 * Hook for category-based filtering of cases.
 * Used in Overview views to filter by case group.
 */
export function useCategoryFilter<T>({
  allCases,
  getCaseCategory,
}: UseCategoryFilterOptions<T>): UseCategoryFilterResult<T> {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const clearCategory = useCallback(() => {
    setSelectedCategory(null)
  }, [])

  const filteredCases = useMemo(() => {
    if (selectedCategory === null) {
      return allCases
    }
    return allCases.filter(caseItem => getCaseCategory(caseItem) === selectedCategory)
  }, [allCases, selectedCategory, getCaseCategory])

  return {
    selectedCategory,
    setCategory: setSelectedCategory,
    clearCategory,
    filteredCases,
  }
}
