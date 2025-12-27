/**
 * Derived pattern utilities
 *
 * Provides pattern data derived from algorithms instead of explicit storage.
 * Caches results for performance.
 */

import type { CaseId } from '../types/algorithm'
import type { OLLOrientations } from '../types/cube'
import { Color } from '../types/cube'
import {
  deriveCasePattern,
  getRotationForColor,
  type DerivedPattern,
  type PLLSideColors,
} from './patternDerivation'

// Pattern cache
const patternCache = new Map<CaseId, DerivedPattern>()

/**
 * Get derived pattern for a case (cached)
 */
export function getDerivedPattern(caseId: CaseId): DerivedPattern | null {
  const cached = patternCache.get(caseId)
  if (cached) return cached

  const pattern = deriveCasePattern(caseId)
  if (pattern) {
    patternCache.set(caseId, pattern)
  }
  return pattern
}

/**
 * Get OLL orientations for a case
 */
export function getOLLOrientations(caseId: CaseId): OLLOrientations | null {
  const pattern = getDerivedPattern(caseId)
  return pattern?.ollOrientations ?? null
}

/**
 * Get PLL side colors for a case
 */
export function getPLLSideColors(caseId: CaseId): PLLSideColors | null {
  const pattern = getDerivedPattern(caseId)
  return pattern?.pllSideColors ?? null
}

// Cache for rotated patterns: "caseId:color" -> DerivedPattern
const rotatedPatternCache = new Map<string, DerivedPattern>()

/**
 * Get PLL side colors for a case with a specific front color.
 *
 * The rotation is applied BEFORE the inverse algorithm, simulating
 * what the pattern looks like when viewing from a different angle.
 */
export function getPLLSideColorsRotated(
  caseId: CaseId,
  selectedColor: Color,
): PLLSideColors | null {
  // Default color (blue) uses non-rotated pattern
  if (selectedColor === Color.BLUE) {
    return getPLLSideColors(caseId)
  }

  // Check cache
  const cacheKey = `${caseId}:${selectedColor}`
  const cached = rotatedPatternCache.get(cacheKey)
  if (cached) {
    return cached.pllSideColors ?? null
  }

  // Derive with rotation
  const rotation = getRotationForColor(selectedColor)
  const pattern = deriveCasePattern(caseId, rotation)
  if (pattern) {
    rotatedPatternCache.set(cacheKey, pattern)
  }

  return pattern?.pllSideColors ?? null
}

