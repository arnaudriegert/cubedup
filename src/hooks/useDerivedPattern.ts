import { useMemo } from 'react'
import type { CaseId } from '../types/algorithm'
import type { OLLOrientations } from '../types/cube'
import { Color } from '../types/cube'
import {
  getDerivedPattern,
  getOLLOrientations,
  getPLLSideColorsRotated,
  type PLLSideColors,
} from '../utils/derivedPatterns'
import type { DerivedPattern } from '../utils/patternDerivation'

export interface UseDerivedPatternResult {
  /** Full derived pattern (for advanced use) */
  pattern: DerivedPattern | null
  /** OLL orientations (for OLL cases) */
  ollOrientations: OLLOrientations | null
  /** PLL side colors (for PLL cases, with rotation applied) */
  pllSideColors: PLLSideColors | null
}

/**
 * Hook to get derived pattern data for a case.
 *
 * For OLL cases, returns orientations.
 * For PLL cases, applies color rotation to side colors.
 *
 * Results are memoized and use the underlying pattern cache.
 */
export function useDerivedPattern(
  caseId: CaseId | undefined,
  selectedColor: Color = Color.BLUE,
): UseDerivedPatternResult {
  return useMemo(() => {
    if (!caseId) {
      return {
        pattern: null,
        ollOrientations: null,
        pllSideColors: null,
      }
    }

    // Get the base pattern
    const pattern = getDerivedPattern(caseId)

    // Get type-specific data
    const ollOrientations = caseId.startsWith('oll-')
      ? getOLLOrientations(caseId)
      : null

    const pllSideColors = caseId.startsWith('pll-')
      ? getPLLSideColorsRotated(caseId, selectedColor)
      : null

    return {
      pattern,
      ollOrientations,
      pllSideColors,
    }
  }, [caseId, selectedColor])
}

// Re-export types for convenience
export type { DerivedPattern, PLLSideColors }
