import { useMemo } from 'react'
import type { CaseId } from '../types/algorithm'
import type { OLLOrientations } from '../types/cube'
import { Color } from '../types/cube'
import {
  getDerivedPattern,
  getOLLOrientations,
  getSideColorsRotated,
} from '../utils/derivedPatterns'
import type { DerivedPattern, SideColors } from '../utils/patternDerivation'

export interface UseDerivedPatternResult {
  /** Full derived pattern (for advanced use) */
  pattern: DerivedPattern | null
  /** OLL orientations (for OLL cases) */
  ollOrientations: OLLOrientations | null
  /** Side colors (for PLL cases, with rotation applied) */
  sideColors: SideColors | null
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
        sideColors: null,
      }
    }

    // Get the base pattern
    const pattern = getDerivedPattern(caseId)

    // Get type-specific data
    const ollOrientations = caseId.startsWith('oll-')
      ? getOLLOrientations(caseId)
      : null

    const sideColors = caseId.startsWith('pll-')
      ? getSideColorsRotated(caseId, selectedColor)
      : null

    return {
      pattern,
      ollOrientations,
      sideColors,
    }
  }, [caseId, selectedColor])
}

// Re-export types for convenience
export type { DerivedPattern, SideColors }
