/**
 * Derived pattern utilities
 *
 * Provides pattern data derived from algorithms instead of explicit storage.
 * Caches results for performance.
 */

import type { CaseId } from '../types/algorithm'
import type { CubeState } from '../types/cubeState'
import { Color } from '../types/cube'
import {
  deriveCasePattern,
  getRotationForColor,
  type DerivedPattern,
} from './patternDerivation'

// Pattern cache
const patternCache = new Map<CaseId, DerivedPattern>()

// Cache for rotated patterns: "caseId:color" -> DerivedPattern
const rotatedPatternCache = new Map<string, DerivedPattern>()

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
 * Get cube state for a case (with optional rotation for selected color)
 */
export function getCaseCubeState(caseId: CaseId, selectedColor: Color = Color.BLUE): CubeState | null {
  // Default color (blue) uses non-rotated pattern
  if (selectedColor === Color.BLUE) {
    const pattern = getDerivedPattern(caseId)
    return pattern?.cubeState ?? null
  }

  // Check rotated cache
  const cacheKey = `${caseId}:${selectedColor}`
  const cached = rotatedPatternCache.get(cacheKey)
  if (cached) {
    return cached.cubeState
  }

  // Derive with rotation
  const rotation = getRotationForColor(selectedColor)
  const pattern = deriveCasePattern(caseId, rotation)
  if (pattern) {
    rotatedPatternCache.set(cacheKey, pattern)
  }

  return pattern?.cubeState ?? null
}
