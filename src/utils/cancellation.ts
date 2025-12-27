/**
 * Move cancellation detection and combination
 *
 * Two moves cancel when they have the same base:
 * - R + R' = nothing (full cancel)
 * - R + R = R2
 * - R + R2 = R'
 * - R2 + R2 = nothing
 *
 * Face + slice moves combine to wide moves:
 * - F + S = f, B + S' = b
 * - R + M' = r, L + M = l
 * - U + E' = u, D + E = d
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

// Wide move combinations: face + slice = wide
// sameDirection: true if modifiers match, false if slice modifier is inverted
const WIDE_PAIRS: Array<{
  face: MoveBase
  slice: MoveBase
  wide: MoveBase
  sameDirection: boolean
}> = [
  { face: 'F', slice: 'S', wide: 'f', sameDirection: true },
  { face: 'B', slice: 'S', wide: 'b', sameDirection: false },
  { face: 'R', slice: 'M', wide: 'r', sameDirection: false },
  { face: 'L', slice: 'M', wide: 'l', sameDirection: true },
  { face: 'U', slice: 'E', wide: 'u', sameDirection: false },
  { face: 'D', slice: 'E', wide: 'd', sameDirection: true },
]

/**
 * Invert a modifier: '' <-> "'" (2 stays 2)
 */
function invertModifier(mod: MoveModifier): MoveModifier {
  if (mod === '') return "'"
  if (mod === "'") return ''
  return '2'
}

/**
 * Check if two moves can combine into a wide move.
 */
export function canCombineToWide(move1: Move, move2: Move): boolean {
  for (const pair of WIDE_PAIRS) {
    // Check face + slice order
    if (move1.base === pair.face && move2.base === pair.slice) {
      const expectedSliceMod = pair.sameDirection ? move1.modifier : invertModifier(move1.modifier)
      return move2.modifier === expectedSliceMod
    }
    // Check slice + face order
    if (move1.base === pair.slice && move2.base === pair.face) {
      const expectedSliceMod = pair.sameDirection ? move2.modifier : invertModifier(move2.modifier)
      return move1.modifier === expectedSliceMod
    }
  }
  return false
}

/**
 * Combine face + slice into a wide move.
 */
export function combineToWide(move1: Move, move2: Move): Move | null {
  for (const pair of WIDE_PAIRS) {
    // Check face + slice order
    if (move1.base === pair.face && move2.base === pair.slice) {
      const expectedSliceMod = pair.sameDirection ? move1.modifier : invertModifier(move1.modifier)
      if (move2.modifier === expectedSliceMod) {
        return { base: pair.wide, modifier: move1.modifier }
      }
    }
    // Check slice + face order
    if (move1.base === pair.slice && move2.base === pair.face) {
      const expectedSliceMod = pair.sameDirection ? move2.modifier : invertModifier(move2.modifier)
      if (move1.modifier === expectedSliceMod) {
        return { base: pair.wide, modifier: move2.modifier }
      }
    }
  }
  return null
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
  cancellationId?: number // Links cancelled moves with their result (or each other for full cancels)
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

// Counter for generating unique cancellation IDs
let cancellationIdCounter = 0

/**
 * Process cancellations at a single step boundary.
 * Handles cascading cancellations (e.g., R' R fully cancels, then U2 U = U').
 * All cascading cancellations at the same boundary share the same cancellationId.
 *
 * @param inheritedId - If provided, reuse this ID (for linking cross-step bridging)
 * @returns The cancellationId used (if any cancellation occurred)
 */
function processBoundary(
  step1: MoveWithMeta[],
  step2: MoveWithMeta[],
  inheritedId?: number,
): number | null {
  // Use inherited ID if provided, otherwise generate new one on first cancellation
  let boundaryGroupId: number | null = inheritedId ?? null

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
    if (lastIdx === -1) return boundaryGroupId // All of step1 is cancelled/result

    // Find first non-cancelled move in step2 (including result moves)
    let firstIdx = -1
    for (let i = 0; i < step2.length; i++) {
      if (!step2[i].isCancelled) {
        firstIdx = i
        break
      }
    }
    if (firstIdx === -1) return boundaryGroupId // All of step2 is cancelled

    const last = step1[lastIdx]
    const first = step2[firstIdx]

    // Check for same-base combination (cancellation)
    let combined: Move | null = null
    if (canCombine(last.move, first.move)) {
      combined = combineMoves(last.move, first.move)
    } else if (canCombineToWide(last.move, first.move)) {
      // Check for face+slice → wide combination
      combined = combineToWide(last.move, first.move)
    } else {
      return boundaryGroupId // No combination possible at this boundary
    }

    // Create ID on first cancellation at this boundary
    if (boundaryGroupId === null) {
      boundaryGroupId = cancellationIdCounter++
    }

    // Mark both as cancelled with the same cancellation ID
    last.isCancelled = true
    last.cancellationId = boundaryGroupId
    first.isCancelled = true
    first.cancellationId = boundaryGroupId

    if (combined !== null) {
      // Partial cancellation - insert result after the cancelled move
      const resultMove: MoveWithMeta = {
        move: combined,
        stepIndex: first.stepIndex,
        isCancelled: false,
        isResult: true,
        originalMoves: [last.move, first.move],
        cancellationId: boundaryGroupId, // Link result to its cancelled moves
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
 *
 * Also handles cross-step bridging: when a step becomes fully cancelled,
 * continues to check if the previous step can cancel with the next non-empty step.
 * Example: R F' | F R -> R F' F fully cancels, then R + R = R2
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

  // Helper: count non-cancelled, non-result moves across all steps
  const countNonCancelled = () =>
    stepArrays.reduce(
      (sum, arr) => sum + arr.filter((m) => !m.isCancelled && !m.isResult).length,
      0,
    )

  // Process cancellations repeatedly until no more changes
  // This handles cross-step bridging when intermediate steps become fully cancelled
  let prevCount = -1
  while (countNonCancelled() !== prevCount) {
    prevCount = countNonCancelled()

    // Find pairs of adjacent non-empty steps and process their boundary
    for (let s = 0; s < stepArrays.length; s++) {
      // Skip if this step has no non-cancelled, non-result moves
      const hasNonCancelled = stepArrays[s].some((m) => !m.isCancelled && !m.isResult)
      if (!hasNonCancelled) continue

      // Find the next step with non-cancelled moves (skip fully-cancelled steps)
      // Track skipped steps to link their cancellation IDs
      let t = s + 1
      const skippedSteps: number[] = []

      while (t < stepArrays.length) {
        if (stepArrays[t].some((m) => !m.isCancelled)) break
        skippedSteps.push(t)
        t++
      }
      if (t >= stepArrays.length) break

      // If we skipped any steps, inherit their cancellation ID
      // This links cross-step bridging cancellations together
      let inheritedId: number | undefined
      for (const skippedIdx of skippedSteps) {
        const cancelledMove = stepArrays[skippedIdx].find((m) => m.cancellationId !== undefined)
        if (cancelledMove?.cancellationId !== undefined) {
          inheritedId = cancelledMove.cancellationId
          break
        }
      }

      // Process boundary between s and t
      const usedId = processBoundary(stepArrays[s], stepArrays[t], inheritedId)

      // If we skipped steps and a cancellation occurred, update all skipped moves
      // to use the same ID so they display as one group
      if (skippedSteps.length > 0 && usedId !== null) {
        for (const skippedIdx of skippedSteps) {
          for (const m of stepArrays[skippedIdx]) {
            if (m.cancellationId !== undefined) {
              m.cancellationId = usedId
            }
          }
        }
      }
    }
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
