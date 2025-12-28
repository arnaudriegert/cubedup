/**
 * 2-Look OLL utilities
 *
 * Functions for analyzing and displaying 2-look OLL paths.
 * Helps learners compare one-look vs two-look approaches.
 */

import { getAlgorithm } from '../data/algorithms'
import { getCase } from '../data/cases'
import { isRefStep, isMovesStep } from '../types/algorithm'
import type {
  Algorithm, AlgorithmId, AlgorithmStep,
} from '../types/algorithm'
import { expandAlgorithmObject } from './algorithmExpander'

// ==========================================================================
// Types
// ==========================================================================

export interface TwoLookPath {
  edgeCase: AlgorithmId | null  // null for corner cases (21-27) which have solved edges
  cornerCase: AlgorithmId
  aufBetween: string            // e.g., "U2", "U'", "" (empty if no AUF needed)
  rotation?: string             // Initial rotation if needed (e.g., "y'")
  steps: AlgorithmStep[]        // The raw steps for expansion/display
}

// ==========================================================================
// Display Names
// ==========================================================================

// Simple names for edge patterns (no numbers)
const EDGE_PATTERN_NAMES: Record<string, string> = {
  'oll-2': 'Dot',
  'oll-44': 'L-shape',
  'oll-45': 'Line',
}

// Corner case names (matching official OLL names from cases.ts)
const CORNER_CASE_NAMES: Record<string, string> = {
  'oll-21': 'H',
  'oll-22': 'Pi',
  'oll-23': 'Headlights',
  'oll-24': 'Chameleon',
  'oll-25': 'Bowtie',
  'oll-26': 'Anti-Sune',
  'oll-27': 'Sune',
}

/**
 * Get simple display name for a 2-look OLL case.
 * Returns just the pattern name: "L-shape", "Sune", etc.
 */
export function getTwoLookCaseName(algoId: AlgorithmId): string {
  return EDGE_PATTERN_NAMES[algoId] ?? CORNER_CASE_NAMES[algoId] ?? algoId
}

// ==========================================================================
// Path Extraction
// ==========================================================================

/**
 * Get the 2-look path for an OLL case.
 * Returns null if no 2-look path exists for this case.
 */
export function getTwoLookPath(caseId: string): TwoLookPath | null {
  const caseData = getCase(caseId)
  if (!caseData?.twoLookPath) {
    return null
  }

  const steps = caseData.twoLookPath

  // Parse the steps to extract edge case, AUF, and corner case
  let edgeCase: AlgorithmId | null = null
  let cornerCase: AlgorithmId | null = null
  let aufBetween = ''
  let rotation: string | undefined

  for (const step of steps) {
    if (isRefStep(step)) {
      const refId = step.ref
      // Check if it's an edge case
      if (refId === 'oll-2' || refId === 'oll-44' || refId === 'oll-45') {
        edgeCase = refId
      } else if (/^oll-2[1-7]$/.test(refId)) {
        // Corner case (21-27)
        cornerCase = refId
      }
    } else if (isMovesStep(step)) {
      const moves = step.moves.trim()
      // Check for rotation at the start
      if (/^y['2]?$/.test(moves) && !edgeCase && !cornerCase) {
        rotation = moves
      } else if (/^U['2]?$/.test(moves) && edgeCase && !cornerCase) {
        // AUF between edge and corner
        aufBetween = moves
      }
    }
  }

  if (!cornerCase) {
    return null
  }

  return {
    edgeCase,
    cornerCase,
    aufBetween,
    rotation,
    steps,
  }
}

/**
 * Flatten 2-look steps for display.
 *
 * Expands oll- refs (edge and corner cases) to show their internal triggers,
 * while preserving the structure (moves stay as moves, triggers show as triggers).
 */
export function flattenTwoLookSteps(steps: AlgorithmStep[]): AlgorithmStep[] {
  const flattenedSteps: AlgorithmStep[] = []

  for (const step of steps) {
    if (isMovesStep(step)) {
      flattenedSteps.push(step)
    } else if (isRefStep(step)) {
      // Check if this is an OLL case ref (edge or corner)
      const isOllRef = /^oll-\d+$/.test(step.ref)

      if (isOllRef) {
        // Expand this ref to its internal steps
        const referenced = getAlgorithm(step.ref)
        if (referenced) {
          const repeatCount = step.repeat ?? 1
          for (let i = 0; i < repeatCount; i++) {
            flattenedSteps.push(...referenced.steps)
          }
        } else {
          flattenedSteps.push(step)
        }
      } else {
        // Keep trigger refs as-is (sexy, chair, etc.)
        flattenedSteps.push(step)
      }
    }
  }

  return flattenedSteps
}

// ==========================================================================
// Move Counting
// ==========================================================================

/**
 * Get the move count for an algorithm (after cancellations).
 */
function getAlgorithmMoveCount(algoId: string): number {
  const algo = getAlgorithm(algoId)
  if (!algo) return 0

  const expanded = expandAlgorithmObject(algo)
  return expanded.moves.length
}

/**
 * Get the total move count for a 2-look path.
 * Includes: edge case + AUF + corner case (excludes initial rotation)
 */
export function getTwoLookMoveCount(path: TwoLookPath): number {
  let count = 0

  // Don't count initial rotation - it's setup, not part of the algorithm
  if (path.edgeCase) count += getAlgorithmMoveCount(path.edgeCase)
  if (path.aufBetween) count += 1
  count += getAlgorithmMoveCount(path.cornerCase)

  return count
}

/**
 * Get the move count difference between one-look and 2-look.
 * Positive = 2-look uses more moves (one-look is better).
 */
export function getMoveCountDiff(caseId: string): number {
  const path = getTwoLookPath(caseId)
  if (!path) return 0

  const oneLookCount = getAlgorithmMoveCount(caseId)
  const twoLookCount = getTwoLookMoveCount(path)

  return twoLookCount - oneLookCount
}
