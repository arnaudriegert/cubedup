import {
  useState, useMemo, useCallback,
} from 'react'
import type { Case, CaseGroup } from '../types/algorithm'

export interface UseCategoryFilterOptions<T> {
  /** All cases to filter */
  allCases: T[]
  /** Case groups that define categories */
  groups: CaseGroup[]
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
  groups,
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

/**
 * Build a map from case identifier to category name.
 * Useful for fast category lookups.
 */
export function buildCategoryMap<T extends Case>(
  groups: CaseGroup[],
  getKey: (caseData: T) => string | number | undefined,
): Map<string | number, string> {
  const map = new Map<string | number, string>()

  for (const group of groups) {
    for (const entry of group.cases) {
      for (const caseId of entry) {
        // Note: This would need getCase to resolve the case
        // For now, we just return the caseId mapping
        map.set(caseId, group.name)
      }
    }
  }

  return map
}
