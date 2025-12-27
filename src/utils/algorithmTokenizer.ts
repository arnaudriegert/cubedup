/**
 * Algorithm tokenizer - converts algorithms to displayable tokens
 *
 * Handles:
 * - Algorithm with steps (moves or refs to other algorithms)
 * - Runtime cancellation detection
 * - Markup: ~strikethrough~, **bold**
 * - Grouping: parentheses, brackets [rotations]
 * - Trigger notation: {sexy}, {chair}
 */

import type { Algorithm } from '../types/algorithm'
import { isMovesStep, isRefStep } from '../types/algorithm'
import { isCubeRotation } from '../types/cubeState'
import { parseMoves, moveToNotation } from './moveParser'
import type { ExpandedAlgorithm } from './algorithmExpander'
import type { MoveWithMeta } from './cancellation'
import type { Move } from '../types/cubeState'

export type TokenType = 'move' | 'trigger' | 'rotation' | 'groupStart' | 'groupEnd' | 'space'

export interface AlgorithmToken {
  type: TokenType
  value: string           // Display text
  rawMoves?: string       // For triggers: the underlying moves
  triggerName?: string    // e.g., "sexy" (without braces)
  isCancelled?: boolean   // For ~strikethrough~ markup
  isHighlighted?: boolean // For **bold** markup
  stepIndex?: number      // Which algorithm step this belongs to
  moveIndex?: number      // Global move index (for playback tracking)
  stepParity?: 'even' | 'odd'  // For alternating colors within consecutive same-category steps
  isFromTrigger?: boolean      // True if this move came from a trigger expansion
  // Cancellation display info
  isResult?: boolean           // This move is the result of a cancellation
  cancellationId?: number      // Links cancelled moves with their result
  originalMoves?: [Move, Move] // For result moves: the moves that combined
}

// Regex patterns for parsing algorithm notation
const OUTER_REGEX = /(~[^~]+~|\*\*[^*]+\*\*)/g
const PAREN_REGEX = /(\([^)]+\))/g

/**
 * Parse markup and return tokens with cancelled/highlighted flags
 */
function parseMarkup(text: string): Array<{ text: string; isCancelled?: boolean; isHighlighted?: boolean }> {
  const result: Array<{ text: string; isCancelled?: boolean; isHighlighted?: boolean }> = []
  const parts = text.split(OUTER_REGEX)

  for (const part of parts) {
    if (!part) continue

    if (part.match(/^~.+~$/)) {
      result.push({ text: part.slice(1, -1), isCancelled: true })
    } else if (part.match(/^\*\*.+\*\*$/)) {
      result.push({ text: part.slice(2, -2), isHighlighted: true })
    } else {
      result.push({ text: part })
    }
  }

  return result
}

/**
 * Parse a notation segment into tokens (handles parens, brackets, triggers)
 */
function parseSegment(
  text: string,
  options: {
    stepIndex?: number
    isCancelled?: boolean
    isHighlighted?: boolean
    stepParity?: 'even' | 'odd'
    isFromTrigger?: boolean
  },
  moveCounter: { current: number },
): AlgorithmToken[] {
  const tokens: AlgorithmToken[] = []
  const { stepIndex, isCancelled, isHighlighted, stepParity, isFromTrigger } = options

  // Split by parentheses first
  const parenParts = text.split(PAREN_REGEX)

  for (const part of parenParts) {
    if (!part.trim()) continue

    const isParen = part.match(/^\(.+\)$/)
    const content = isParen ? part.slice(1, -1) : part

    if (isParen) {
      tokens.push({ type: 'groupStart', value: '(' })
    }

    // Split content by brackets and triggers (include trailing superscripts and modifiers for triggers)
    // Modifiers: '2 (prime/double) can come before or after ²³⁴ (exponents)
    // Examples: {sexy}², {trigger}', {sexy}'², {trigger}2³
    const innerParts = content.split(/(\[[^\]]+\]|\{[^}]+\}['2]?[²³⁴]?['2]?)/g)

    for (const inner of innerParts) {
      if (!inner.trim()) {
        if (inner.includes(' ')) {
          tokens.push({ type: 'space', value: ' ' })
        }
        continue
      }

      // Check if it's a bracket (rotation)
      if (inner.match(/^\[.+\]$/)) {
        const rotationContent = inner.slice(1, -1)
        const moves = parseMoves(rotationContent)
        for (const move of moves) {
          tokens.push({
            type: 'rotation',
            value: moveToNotation(move),
            isCancelled,
            isHighlighted,
            stepIndex,
            moveIndex: moveCounter.current++,
            stepParity,
            isFromTrigger,
          })
        }
        continue
      }

      // Check if it's a trigger (handles {sexy}, {sexy}², {sexy}'², {trigger}', {trigger}2 etc.)
      const triggerMatch = inner.match(/^\{(.+)\}(['2]?)([²³⁴]?)(['2]?)$/)
      if (triggerMatch) {
        // Combine all modifiers: prime1 + exponent + prime2
        const triggerName = triggerMatch[1] + (triggerMatch[2] || '') + (triggerMatch[3] || '') + (triggerMatch[4] || '')

        tokens.push({
          type: 'trigger',
          value: triggerName,
          triggerName,
          isCancelled,
          isHighlighted,
          stepIndex,
          stepParity,
        })
        continue
      }

      // Regular moves (detect cube rotations x/y/z for special styling)
      const moves = parseMoves(inner)
      for (const move of moves) {
        const isRotation = isCubeRotation(move.base)
        tokens.push({
          type: isRotation ? 'rotation' : 'move',
          value: moveToNotation(move),
          isCancelled,
          isHighlighted,
          stepIndex,
          moveIndex: moveCounter.current++,
          stepParity,
          isFromTrigger,
        })
      }

      // Preserve spaces between moves
      if (inner.endsWith(' ')) {
        tokens.push({ type: 'space', value: ' ' })
      }
    }

    if (isParen) {
      tokens.push({ type: 'groupEnd', value: ')' })
    }
  }

  return tokens
}

/**
 * Tokenize a notation string (handles markup, triggers, etc.)
 */
export function tokenizeNotation(
  notation: string,
  options: { stepIndex?: number } = {},
): AlgorithmToken[] {
  const { stepIndex } = options
  const tokens: AlgorithmToken[] = []
  const moveCounter = { current: 0 }

  // Parse outer markup (strikethrough, bold)
  const markedSegments = parseMarkup(notation)

  for (const segment of markedSegments) {
    const segmentTokens = parseSegment(
      segment.text,
      {
        stepIndex,
        isCancelled: segment.isCancelled,
        isHighlighted: segment.isHighlighted,
      },
      moveCounter,
    )
    tokens.push(...segmentTokens)
  }

  return tokens
}

/**
 * Count the total number of moves in tokens (for playback progress)
 */
export function countMoves(tokens: AlgorithmToken[]): number {
  return tokens.filter(t => t.type === 'move' || t.type === 'rotation').length
}

/**
 * Get the move at a specific index from tokens
 */
export function getMoveAtIndex(tokens: AlgorithmToken[], moveIndex: number): AlgorithmToken | undefined {
  return tokens.find(t => t.moveIndex === moveIndex)
}

// =========================================================================
// New Algorithm Format Support
// =========================================================================

/**
 * Determine step category from MoveWithMeta for expanded algorithm
 */
type ExpandedStepCategory = 'rotation' | 'trigger' | 'moves'

function getExpandedStepCategory(stepMoves: MoveWithMeta[]): ExpandedStepCategory {
  if (stepMoves.length === 0) return 'moves'

  // If any move is from a ref, it's a trigger step
  if (stepMoves.some(m => m.isFromRef)) return 'trigger'

  // If all moves are rotations, it's a rotation step
  if (stepMoves.every(m => isCubeRotation(m.move.base))) return 'rotation'

  return 'moves'
}

/**
 * Tokenize an ExpandedAlgorithm (new format with computed cancellations)
 *
 * This function works with the new algorithm structure where:
 * - Algorithms have `steps` with refs or moves
 * - Cancellations are computed at runtime
 * - movesWithMeta contains cancellation flags
 */
export function tokenizeExpandedAlgorithm(
  expanded: ExpandedAlgorithm,
  options: { showCancellations?: boolean } = {},
): AlgorithmToken[] {
  const { showCancellations = true } = options
  const tokens: AlgorithmToken[] = []

  // Group moves by stepIndex to determine categories
  const stepGroups = new Map<number, MoveWithMeta[]>()
  for (const meta of expanded.movesWithMeta) {
    const group = stepGroups.get(meta.stepIndex) || []
    group.push(meta)
    stepGroups.set(meta.stepIndex, group)
  }

  // Get sorted step indices
  const stepIndices = Array.from(stepGroups.keys()).sort((a, b) => a - b)

  // Pre-compute categories and parities - parity resets when category changes
  const stepCategories = stepIndices.map(idx => getExpandedStepCategory(stepGroups.get(idx)!))
  const stepParityMap = new Map<number, 'even' | 'odd'>()

  let prevCategory: ExpandedStepCategory | null = null
  let categoryCount = 0

  for (let i = 0; i < stepIndices.length; i++) {
    const category = stepCategories[i]
    if (category === prevCategory) {
      categoryCount++
    } else {
      categoryCount = 0
      prevCategory = category
    }
    stepParityMap.set(stepIndices[i], categoryCount % 2 === 0 ? 'even' : 'odd')
  }

  // Track step boundaries for spacing
  let currentStepIndex = -1

  for (let i = 0; i < expanded.movesWithMeta.length; i++) {
    const meta = expanded.movesWithMeta[i]
    const { move, stepIndex, isCancelled, isResult, isFromRef, cancellationId, originalMoves } = meta

    // Add space when step changes
    if (stepIndex !== currentStepIndex) {
      currentStepIndex = stepIndex

      // Add space between steps (except first)
      if (tokens.length > 0) {
        tokens.push({ type: 'space', value: ' ' })
      }
    }

    // Skip cancelled moves if not showing cancellations
    if (isCancelled && !showCancellations) {
      continue
    }

    const isRotation = isCubeRotation(move.base)
    const stepParity = stepParityMap.get(stepIndex) || 'even'

    tokens.push({
      type: isRotation ? 'rotation' : 'move',
      value: moveToNotation(move),
      isCancelled,
      isHighlighted: isResult,
      stepIndex,
      moveIndex: i,
      stepParity,
      isFromTrigger: isFromRef,
      isResult,
      cancellationId,
      originalMoves,
    })
  }

  return tokens
}

/**
 * Build shorthand notation from Algorithm format
 * Shows trigger names for ref steps, with ' suffix for inverses
 */
export function buildShorthandFromNewAlgorithm(
  algorithm: Algorithm,
  getAlgorithmName?: (id: string) => string | undefined,
): string {
  const parts: string[] = []

  for (const step of algorithm.steps) {
    if (isMovesStep(step)) {
      parts.push(step.moves)
    } else if (isRefStep(step)) {
      // Format as trigger: {triggerName} or {triggerName'} for inverse
      const baseName = getAlgorithmName?.(step.ref) ?? step.ref
      const name = step.inverse ? `${baseName}'` : baseName
      const trigger = `{${name}}`
      if (step.repeat && step.repeat > 1) {
        // Show repeated refs as multiple triggers
        parts.push(Array(step.repeat).fill(trigger).join(' '))
      } else {
        parts.push(trigger)
      }
    }
  }

  return parts.join(' ')
}

/**
 * Determine step category for new algorithm format
 */
type NewStepCategory = 'rotation' | 'trigger' | 'moves'

function getNewStepCategory(step: Algorithm['steps'][0]): NewStepCategory {
  if (isRefStep(step)) return 'trigger'
  if (isMovesStep(step)) {
    // Check if step only contains rotations
    const onlyBracketedRotations = /^(\[[^\]]+\]\s*)+$/.test(step.moves)
    const onlyStandaloneRotations = /^[xyz]['2]?$/i.test(step.moves.trim())
    if (onlyBracketedRotations || onlyStandaloneRotations) return 'rotation'
  }
  return 'moves'
}

/**
 * Tokenize Algorithm format in shorthand mode (showing trigger names)
 */
export function tokenizeNewAlgorithmShorthand(
  algorithm: Algorithm,
  getAlgorithmName?: (id: string) => string | undefined,
): AlgorithmToken[] {
  const tokens: AlgorithmToken[] = []
  let stepIndex = 0
  const moveCounter = { current: 0 }

  // Pre-compute categories and parities - parity resets when category changes
  const stepCategories = algorithm.steps.map(step => getNewStepCategory(step))
  const stepParities: Array<'even' | 'odd'> = []

  let prevCategory: NewStepCategory | null = null
  let categoryCount = 0

  for (let i = 0; i < stepCategories.length; i++) {
    const category = stepCategories[i]
    if (category === prevCategory) {
      categoryCount++
    } else {
      categoryCount = 0
      prevCategory = category
    }
    stepParities.push(categoryCount % 2 === 0 ? 'even' : 'odd')
  }

  for (const step of algorithm.steps) {
    const stepParity = stepParities[stepIndex]

    // Add space between steps
    if (tokens.length > 0) {
      tokens.push({ type: 'space', value: ' ' })
    }

    if (isMovesStep(step)) {
      // Parse and tokenize moves
      const stepTokens = parseSegment(
        step.moves,
        { stepIndex, stepParity, isFromTrigger: false },
        moveCounter,
      )
      tokens.push(...stepTokens)
    } else if (isRefStep(step)) {
      // Show as trigger token(s)
      // Add ' suffix for inverse refs (e.g., "sexy" becomes "sexy'")
      const baseName = getAlgorithmName?.(step.ref) ?? step.ref
      const name = step.inverse ? `${baseName}'` : baseName
      const repeatCount = step.repeat ?? 1

      // For repeated refs, parity alternates within the same category
      const baseParityNum = stepParity === 'even' ? 0 : 1
      for (let i = 0; i < repeatCount; i++) {
        if (i > 0) {
          tokens.push({ type: 'space', value: ' ' })
        }
        const subParity = (baseParityNum + i) % 2 === 0 ? 'even' : 'odd' as const
        tokens.push({
          type: 'trigger',
          value: name,
          triggerName: name,
          stepIndex: repeatCount > 1 ? stepIndex * 100 + i : stepIndex,
          stepParity: subParity,
        })
      }
    }

    stepIndex++
  }

  return tokens
}
