/**
 * Derived pattern utilities
 *
 * Provides pattern data derived from algorithms instead of explicit storage.
 * Caches results for performance.
 */

import type { CaseId } from '../types/algorithm'
import type { CubeState } from '../types/cubeState'
import { deriveCasePattern, type DerivedPattern } from './patternDerivation'
import { parseMoves } from './moveParser'

// Pattern cache
const patternCache = new Map<CaseId, DerivedPattern>()

// Cache for rotated patterns: "caseId:rotation" -> DerivedPattern
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
 * Get cube state for a case (with optional y-rotation)
 */
export function getCaseCubeState(caseId: CaseId, rotation: string = ''): CubeState | null {
  // No rotation uses non-rotated pattern
  if (!rotation) {
    const pattern = getDerivedPattern(caseId)
    return pattern?.cubeState ?? null
  }

  // Check rotated cache
  const cacheKey = `${caseId}:${rotation}`
  const cached = rotatedPatternCache.get(cacheKey)
  if (cached) {
    return cached.cubeState
  }

  // Derive with rotation
  const moves = parseMoves(rotation)
  const pattern = deriveCasePattern(caseId, moves)
  if (pattern) {
    rotatedPatternCache.set(cacheKey, pattern)
  }

  return pattern?.cubeState ?? null
}
