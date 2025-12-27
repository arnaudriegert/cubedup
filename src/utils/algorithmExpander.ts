/**
 * Algorithm expansion utilities
 *
 * Recursively resolves algorithm references (refs) to get the full move sequence.
 * Handles arbitrary nesting depth and computes cancellations at step boundaries.
 */

import type { Move } from '../types/cubeState'
import type {
  Algorithm,
  AlgorithmId,
  AlgorithmStep,
} from '../types/algorithm'
import { isMovesStep, isRefStep } from '../types/algorithm'
import {
  parseMoves, invertMoves, movesToNotation,
} from './moveParser'
import {
  applyCancellations,
  getEffectiveMoves,
  type MoveWithMeta,
  type StepMoves,
} from './cancellation'
import { getAlgorithm } from '../data/algorithms'

// Maximum nesting depth to prevent infinite recursion
const MAX_DEPTH = 10

/**
 * Result of expanding an algorithm.
 */
export interface ExpandedAlgorithm {
  algorithm: Algorithm
  moves: Move[] // Fully expanded move sequence (after cancellations)
  movesWithMeta: MoveWithMeta[] // Moves with cancellation metadata for display
  movesByStep: StepMoves[] // Moves grouped by step (before cancellations)
}

/**
 * Metadata about an expanded step for display purposes.
 */
interface ExpandedStepInfo {
  moves: Move[]
  isFromRef: boolean
  refId?: string // The referenced algorithm ID (for display)
  isInverse?: boolean // Whether this is an inverted reference
}

/**
 * Expand a single step to its moves.
 * For refs, recursively expands the referenced algorithm.
 * Returns an array of StepMoves to handle repeat modifiers (each repetition is a separate step).
 */
function expandStep(
  step: AlgorithmStep,
  depth: number,
): ExpandedStepInfo[] {
  if (depth > MAX_DEPTH) {
    throw new Error(`Max nesting depth (${MAX_DEPTH}) exceeded`)
  }

  if (isMovesStep(step)) {
    return [{
      moves: parseMoves(step.moves),
      isFromRef: false,
    }]
  }

  if (isRefStep(step)) {
    const referenced = getAlgorithm(step.ref)
    if (!referenced) {
      throw new Error(`Referenced algorithm not found: ${step.ref}`)
    }

    // Recursively expand the referenced algorithm
    const expanded = expandAlgorithmInternal(referenced, depth + 1)
    let moves = expanded.moves

    // Apply inverse modifier if specified
    if (step.inverse) {
      moves = invertMoves(moves)
    }

    // Apply repeat modifier - each repetition becomes a separate step
    const repeatCount = step.repeat ?? 1
    const result: ExpandedStepInfo[] = []
    for (let i = 0; i < repeatCount; i++) {
      result.push({
        moves: [...moves],
        isFromRef: true,
        refId: step.ref,
        isInverse: step.inverse,
      })
    }
    return result
  }

  // Should never reach here
  throw new Error(`Unknown step type: ${JSON.stringify(step)}`)
}

/**
 * Internal expansion function that tracks depth.
 */
function expandAlgorithmInternal(
  algorithm: Algorithm,
  depth: number,
): ExpandedAlgorithm {
  // Expand each step (flatMap because expandStep returns array for repeats)
  const expandedSteps = algorithm.steps.flatMap((step) => expandStep(step, depth))

  // Assign sequential stepIndex to each expanded step
  const movesByStep: StepMoves[] = expandedSteps.map((s, index) => ({
    moves: s.moves,
    stepIndex: index,
    isFromRef: s.isFromRef,
    refId: s.refId,
    isInverse: s.isInverse,
  }))

  // Apply cancellation detection
  // Note: we need to clone movesByStep since applyCancellations mutates it
  const clonedMovesByStep = movesByStep.map((s) => ({
    moves: [...s.moves],
    stepIndex: s.stepIndex,
    isFromRef: s.isFromRef,
    refId: s.refId,
    isInverse: s.isInverse,
  }))
  const movesWithMeta = applyCancellations(clonedMovesByStep)

  // Get effective moves (non-cancelled)
  const moves = getEffectiveMoves(movesWithMeta)

  return {
    algorithm,
    moves,
    movesWithMeta,
    movesByStep,
  }
}

/**
 * Expand an algorithm by ID.
 * Recursively resolves all refs and computes cancellations.
 */
export function expandAlgorithm(id: AlgorithmId): ExpandedAlgorithm {
  const algorithm = getAlgorithm(id)
  if (!algorithm) {
    throw new Error(`Algorithm not found: ${id}`)
  }
  return expandAlgorithmInternal(algorithm, 0)
}

/**
 * Expand an algorithm object directly.
 */
export function expandAlgorithmObject(algorithm: Algorithm): ExpandedAlgorithm {
  return expandAlgorithmInternal(algorithm, 0)
}

/**
 * Get the full notation string for an algorithm (with cancellations applied).
 */
export function getAlgorithmNotation(id: AlgorithmId): string {
  const expanded = expandAlgorithm(id)
  return movesToNotation(expanded.moves)
}
