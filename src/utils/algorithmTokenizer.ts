/**
 * Algorithm tokenizer - converts algorithms to displayable tokens
 *
 * Handles:
 * - Decomposition steps with triggers
 * - Markup: ~strikethrough~, **bold**
 * - Grouping: parentheses, brackets [rotations]
 * - Trigger notation: {sexy}, {chair}
 */

import type { Algorithm, AlgorithmStep } from '../types/algorithm'
import { isCubeRotation } from '../types/cubeState'
import { parseMoves, moveToNotation } from './moveParser'

export type TokenType = 'move' | 'trigger' | 'rotation' | 'groupStart' | 'groupEnd' | 'space'

export interface AlgorithmToken {
  type: TokenType
  value: string           // Display text
  rawMoves?: string       // For triggers: the underlying moves
  triggerName?: string    // e.g., "sexy" (without braces)
  isCancelled?: boolean   // For ~strikethrough~ markup
  isHighlighted?: boolean // For **bold** markup
  stepIndex?: number      // Which decomposition step this belongs to
  moveIndex?: number      // Global move index (for playback tracking)
}

// Regex patterns for parsing algorithm notation
const OUTER_REGEX = /(~[^~]+~|\*\*[^*]+\*\*)/g
const PAREN_REGEX = /(\([^)]+\))/g

/**
 * Check if step needs parentheses wrapping
 * Skip if: single move, already has parens, or only contains rotations [...]
 */
function needsParens(moves: string): boolean {
  const isSingleMove = !moves.includes(' ')
  const alreadyGrouped = moves.includes('(')
  const onlyRotations = /^(\[[^\]]+\]\s*)+$/.test(moves)
  return !isSingleMove && !alreadyGrouped && !onlyRotations
}

/**
 * Build the full algorithm string from decomposition steps
 */
export function buildFullFromSteps(steps: AlgorithmStep[]): string {
  if (steps.length === 1) return steps[0].moves
  return steps.map(step => needsParens(step.moves) ? `(${step.moves})` : step.moves).join(' ')
}

/**
 * Build shorthand string from decomposition steps
 */
export function buildShorthandFromSteps(steps: AlgorithmStep[]): string {
  if (steps.length === 1) return steps[0].trigger || steps[0].moves
  return steps.map(step => {
    if (step.trigger) return step.trigger
    return needsParens(step.moves) ? `(${step.moves})` : step.moves
  }).join(' ')
}

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
    expandTriggers: boolean
  },
  moveCounter: { current: number },
): AlgorithmToken[] {
  const tokens: AlgorithmToken[] = []
  const { stepIndex, isCancelled, isHighlighted, expandTriggers } = options

  // Split by parentheses first
  const parenParts = text.split(PAREN_REGEX)

  for (const part of parenParts) {
    if (!part.trim()) continue

    const isParen = part.match(/^\(.+\)$/)
    const content = isParen ? part.slice(1, -1) : part

    if (isParen) {
      tokens.push({ type: 'groupStart', value: '(' })
    }

    // Split content by brackets and triggers (include trailing superscripts for triggers)
    const innerParts = content.split(/(\[[^\]]+\]|\{[^}]+\}[²³⁴]?)/g)

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
          })
        }
        continue
      }

      // Check if it's a trigger (handles {sexy}, {sexy}², {sexy}³ etc.)
      const triggerMatch = inner.match(/^\{(.+)\}([²³⁴]?)$/)
      if (triggerMatch) {
        const triggerName = triggerMatch[1] + (triggerMatch[2] || '')

        if (expandTriggers) {
          // When expanded, we'd need the raw moves - for now, show trigger name
          // In full integration, this would look up from registry
          tokens.push({
            type: 'trigger',
            value: triggerName,
            triggerName,
            isCancelled,
            isHighlighted,
            stepIndex,
          })
        } else {
          tokens.push({
            type: 'trigger',
            value: triggerName,
            triggerName,
            isCancelled,
            isHighlighted,
            stepIndex,
          })
        }
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
  options: { expandTriggers?: boolean; stepIndex?: number } = {},
): AlgorithmToken[] {
  const { expandTriggers = false, stepIndex } = options
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
        expandTriggers,
      },
      moveCounter,
    )
    tokens.push(...segmentTokens)
  }

  return tokens
}

/**
 * Tokenize an Algorithm object into display tokens
 */
export function tokenizeAlgorithm(
  algorithm: Algorithm,
  options: { expandTriggers?: boolean; useSimplified?: boolean } = {},
): AlgorithmToken[] {
  const { expandTriggers = false, useSimplified = true } = options

  // If simplifiedResult exists and we want to use it, tokenize that
  if (useSimplified && algorithm.simplifiedResult) {
    return tokenizeNotation(algorithm.simplifiedResult, { expandTriggers })
  }

  // Otherwise, build from decomposition
  const tokens: AlgorithmToken[] = []
  const moveCounter = { current: 0 }
  const multiStep = algorithm.decomposition.length > 1

  for (let stepIndex = 0; stepIndex < algorithm.decomposition.length; stepIndex++) {
    const step = algorithm.decomposition[stepIndex]

    // Add space between steps
    if (stepIndex > 0) {
      tokens.push({ type: 'space', value: ' ' })
    }

    // For multi-step algorithms, wrap in parens if needed
    const needsWrap = multiStep && needsParens(step.moves)

    if (needsWrap) {
      tokens.push({ type: 'groupStart', value: '(' })
    }

    // If step has a trigger and we're not expanding, show trigger
    if (step.trigger && !expandTriggers) {
      // Handle {trigger} and {trigger}² patterns
      const match = step.trigger.match(/^\{(.+)\}([²³⁴]?)$/)
      const triggerName = match ? match[1] + (match[2] || '') : step.trigger.slice(1, -1)
      tokens.push({
        type: 'trigger',
        value: triggerName,
        triggerName,
        rawMoves: step.moves,
        stepIndex,
      })
    } else {
      // Tokenize the moves
      const stepTokens = parseSegment(
        step.moves,
        { stepIndex, expandTriggers },
        moveCounter,
      )
      tokens.push(...stepTokens)
    }

    if (needsWrap) {
      tokens.push({ type: 'groupEnd', value: ')' })
    }
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
