/**
 * Move cancellation detection and combination
 *
 * Two moves cancel when they have the same base:
 * - R + R' = nothing (full cancel)
 * - R + R = R2
 * - R + R2 = R'
 * - R2 + R2 = nothing
 */

import type {
  Move, MoveModifier, MoveBase,
} from '../types/cubeState'

// Modifier value in quarter turns clockwise (0-3)
const MODIFIER_VALUE: Record<MoveModifier, number> = {
  '': 1, // Single clockwise
  "'": 3, // Counter-clockwise = 3 quarters
  '2': 2, // Half turn
}

// Reverse lookup: quarter turns to modifier
const VALUE_TO_MODIFIER: Record<number, MoveModifier | null> = {
  0: null, // Full cancellation
  1: '',
  2: '2',
  3: "'",
}

/**
 * Combine two moves of the same base.
 * Returns the resulting move, or null if they fully cancel.
 */
export function combineMoves(move1: Move, move2: Move): Move | null {
  if (move1.base !== move2.base) {
    throw new Error(
      `Cannot combine moves with different bases: ${move1.base} vs ${move2.base}`,
    )
  }

  const val1 = MODIFIER_VALUE[move1.modifier]
  const val2 = MODIFIER_VALUE[move2.modifier]
  const combined = (val1 + val2) % 4

  const resultModifier = VALUE_TO_MODIFIER[combined]
  if (resultModifier === null) {
    return null // Full cancellation
  }

  return { base: move1.base, modifier: resultModifier }
}

/**
 * Check if two moves can be combined (same base).
 */
export function canCombine(move1: Move, move2: Move): boolean {
  return move1.base === move2.base
}

/**
 * A move with cancellation metadata for display purposes.
 */
export interface MoveWithMeta {
  move: Move
  stepIndex: number
  isCancelled: boolean
  isResult: boolean // This move is the result of a cancellation
  originalMoves?: [Move, Move] // The moves that combined to form this one
  isFromRef?: boolean // This move came from a ref step (trigger)
  refId?: string // The referenced algorithm ID (for display)
  isInverse?: boolean // Whether this is an inverted reference
}

/**
 * Input for cancellation detection: moves grouped by step.
 */
export interface StepMoves {
  moves: Move[]
  stepIndex: number
  isFromRef?: boolean // This step came from a ref (trigger)
  refId?: string // The referenced algorithm ID (for display)
  isInverse?: boolean // Whether this is an inverted reference
}

/**
 * Process cancellations at a single step boundary.
 * Handles cascading cancellations (e.g., R' R fully cancels, then U' U2 = U).
 */
function processBoundary(step1: MoveWithMeta[], step2: MoveWithMeta[]): void {
  // Keep processing until no more cancellations
  while (true) {
    // Find last non-cancelled, non-result move in step1
    let lastIdx = -1
    for (let i = step1.length - 1; i >= 0; i--) {
      if (!step1[i].isCancelled && !step1[i].isResult) {
        lastIdx = i
        break
      }
    }
    if (lastIdx === -1) return // All of step1 is cancelled/result

    // Find first non-cancelled move in step2 (including result moves)
    let firstIdx = -1
    for (let i = 0; i < step2.length; i++) {
      if (!step2[i].isCancelled) {
        firstIdx = i
        break
      }
    }
    if (firstIdx === -1) return // All of step2 is cancelled

    const last = step1[lastIdx]
    const first = step2[firstIdx]

    if (!canCombine(last.move, first.move)) {
      return // No more cancellations at this boundary
    }

    const combined = combineMoves(last.move, first.move)

    // Mark both as cancelled
    last.isCancelled = true
    first.isCancelled = true

    if (combined !== null) {
      // Partial cancellation - insert result after the cancelled move
      const resultMove: MoveWithMeta = {
        move: combined,
        stepIndex: first.stepIndex,
        isCancelled: false,
        isResult: true,
        originalMoves: [last.move, first.move],
        isFromRef: last.isFromRef || first.isFromRef,
        // Inherit ref metadata from the first move (or last if first doesn't have it)
        refId: first.refId ?? last.refId,
        isInverse: first.isInverse ?? last.isInverse,
      }
      step2.splice(firstIdx + 1, 0, resultMove)
      // Continue loop to check if result can cancel with more from step1
    }
    // Full cancellation or partial - continue loop either way
  }
}

/**
 * Detect and apply cancellations at step boundaries.
 *
 * Considers cancellations between the last move of step N
 * and the first move of step N+1. Handles cascading cancellations
 * when a full cancellation exposes another cancellable pair.
 */
export function applyCancellations(stepMoves: StepMoves[]): MoveWithMeta[] {
  if (stepMoves.length === 0) return []

  // Convert to MoveWithMeta arrays per step
  const stepArrays: MoveWithMeta[][] = stepMoves.map(({
    moves, stepIndex, isFromRef, refId, isInverse,
  }) =>
    moves.map((move) => ({
      move,
      stepIndex,
      isCancelled: false,
      isResult: false,
      isFromRef,
      refId,
      isInverse,
    })))

  // Process each boundary between steps
  for (let s = 0; s < stepArrays.length - 1; s++) {
    processBoundary(stepArrays[s], stepArrays[s + 1])
  }

  // Flatten the result
  return stepArrays.flat()
}

/**
 * Get the effective moves (non-cancelled) from a cancellation result.
 */
export function getEffectiveMoves(movesWithMeta: MoveWithMeta[]): Move[] {
  return movesWithMeta.filter((m) => !m.isCancelled).map((m) => m.move)
}

/**
 * Check if a base is the same move type (for advanced cancellation rules).
 * Currently just checks equality, but could be extended for parallel moves
 * like R and L which don't interfere.
 */
export function areParallelMoves(_base1: MoveBase, _base2: MoveBase): boolean {
  // Parallel pairs that don't interfere: R/L, U/D, F/B
  // For now, we don't apply this - just return false
  return false
}
