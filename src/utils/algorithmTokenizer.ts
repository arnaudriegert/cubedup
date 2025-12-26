/**
 * Algorithm tokenizer - converts algorithm decompositions to displayable tokens
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
  stepParity?: 'even' | 'odd'  // For alternating colors within consecutive same-category steps
  isFromTrigger?: boolean      // True if this move came from a trigger expansion
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
 * No parentheses - visual separation is handled by color alternation
 */
export function buildFullFromSteps(steps: AlgorithmStep[]): string {
  if (steps.length === 1) return steps[0].moves
  return steps.map(step => step.moves).join(' ')
}

/**
 * Determine the category of a step for parity tracking
 * Categories: 'rotation' | 'trigger' | 'moves'
 */
type StepCategory = 'rotation' | 'trigger' | 'moves'

function getStepCategory(step: AlgorithmStep): StepCategory {
  // If step has a trigger, it's a trigger step
  if (step.trigger) return 'trigger'
  // If step only contains rotations (bracketed [x y z] or standalone x/y/z with modifiers)
  const onlyBracketedRotations = /^(\[[^\]]+\]\s*)+$/.test(step.moves)
  const onlyStandaloneRotations = /^[xyz]['2]?$/i.test(step.moves.trim())
  if (onlyBracketedRotations || onlyStandaloneRotations) return 'rotation'
  // Otherwise it's regular moves
  return 'moves'
}

/**
 * Check if a step at given index is isolated (surrounded by steps of different categories)
 * Isolated steps don't need parentheses for visual separation
 */
function isIsolatedStep(steps: AlgorithmStep[], index: number): boolean {
  if (steps.length <= 1) return true

  const currentCategory = getStepCategory(steps[index])
  const prevCategory = index > 0 ? getStepCategory(steps[index - 1]) : null
  const nextCategory = index < steps.length - 1 ? getStepCategory(steps[index + 1]) : null

  // Step is isolated if neither neighbor has the same category
  return prevCategory !== currentCategory && nextCategory !== currentCategory
}

/**
 * Build shorthand string from decomposition steps
 * Parentheses are only added when there are consecutive non-trigger steps
 */
export function buildShorthandFromSteps(steps: AlgorithmStep[]): string {
  if (steps.length === 1) {
    const step = steps[0]
    if (step.trigger) {
      // Expand exponents: {sexy}³ → {sexy} {sexy} {sexy}
      const exponentMatch = step.trigger.match(/^(\{.+\}['2]?)([²³⁴])$/)
      if (exponentMatch) {
        const base = exponentMatch[1]
        const count = { '²': 2, '³': 3, '⁴': 4 }[exponentMatch[2]] || 1
        return Array(count).fill(base).join(' ')
      }
      return step.trigger
    }
    return step.moves
  }
  return steps.map((step, index) => {
    if (step.trigger) {
      // Expand exponents: {sexy}³ → {sexy} {sexy} {sexy}
      const exponentMatch = step.trigger.match(/^(\{.+\}['2]?)([²³⁴])$/)
      if (exponentMatch) {
        const base = exponentMatch[1]
        const count = { '²': 2, '³': 3, '⁴': 4 }[exponentMatch[2]] || 1
        return Array(count).fill(base).join(' ')
      }
      return step.trigger
    }
    // Skip parens if step is isolated (surrounded by triggers or different categories)
    if (isIsolatedStep(steps, index)) return step.moves
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
 * Tokenize an Algorithm object into display tokens
 */
export function tokenizeAlgorithm(
  algorithm: Algorithm,
  options: { expandTriggers?: boolean; useSimplified?: boolean } = {},
): AlgorithmToken[] {
  const { expandTriggers = false, useSimplified = true } = options

  // If simplifiedResult exists and we want to use it, tokenize that
  // This shows cancellation markup properly
  if (useSimplified && algorithm.simplifiedResult) {
    // Check if all decomposition steps are from triggers
    const allFromTriggers = algorithm.decomposition.every(step => !!step.trigger)
    const tokens = tokenizeNotation(algorithm.simplifiedResult)
    // Mark all move tokens as from trigger if all steps were triggers
    if (allFromTriggers) {
      for (const token of tokens) {
        if (token.type === 'move') {
          token.isFromTrigger = true
        }
      }
    }
    return tokens
  }

  // Otherwise, build from decomposition
  const tokens: AlgorithmToken[] = []
  const moveCounter = { current: 0 }

  // Pre-compute categories and parities for all steps
  // Parity alternates only for consecutive steps of the same category
  const stepCategories = algorithm.decomposition.map(step => getStepCategory(step))
  const stepParities: Array<'even' | 'odd'> = []

  let prevCategory: StepCategory | null = null
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

  for (let stepIndex = 0; stepIndex < algorithm.decomposition.length; stepIndex++) {
    const step = algorithm.decomposition[stepIndex]
    const baseParity = stepParities[stepIndex]
    const isFromTrigger = !!step.trigger

    // Add space between steps
    if (stepIndex > 0) {
      tokens.push({ type: 'space', value: ' ' })
    }

    // Check for trigger exponent (²³⁴) - can be before or after prime modifier
    // Examples: {sexy}², {sexy}'², {trigger}2
    const exponentMatch = step.trigger?.match(/^\{(.+)\}['2]?([²³⁴])['2]?$/)
    const exponent = exponentMatch ? { '²': 2, '³': 3, '⁴': 4 }[exponentMatch[2]] || 1 : 1

    // If step has a trigger and we're not expanding, show trigger tokens
    if (step.trigger && !expandTriggers) {
      // Handle all trigger patterns with modifiers
      const match = step.trigger.match(/^\{(.+)\}(['2]?)([²³⁴]?)(['2]?)$/)
      // Extract base trigger name (without exponent) and modifiers
      const baseTriggerName = match ? match[1] + (match[2] || '') + (match[4] || '') : step.trigger.slice(1, -1)

      // If there's an exponent, generate multiple trigger tokens
      const baseParityNum = baseParity === 'even' ? 0 : 1
      for (let i = 0; i < exponent; i++) {
        if (i > 0) {
          tokens.push({ type: 'space', value: ' ' })
        }
        const subParity = (baseParityNum + i) % 2 === 0 ? 'even' : 'odd' as const
        tokens.push({
          type: 'trigger',
          value: baseTriggerName,
          triggerName: baseTriggerName,
          rawMoves: step.moves,
          stepIndex: exponent > 1 ? stepIndex * 100 + i : stepIndex,
          stepParity: subParity,
        })
      }
    } else {
      // Tokenize the moves - for triggers with exponents, split into sub-steps
      if (isFromTrigger && exponent > 1) {
        // Split moves by parentheses groups for sub-step parity
        // Sub-step parity alternates starting from the step's base parity
        const groups = step.moves.match(/\([^)]+\)/g) || [step.moves]
        const baseParityNum = baseParity === 'even' ? 0 : 1
        for (let i = 0; i < groups.length; i++) {
          if (i > 0) {
            tokens.push({ type: 'space', value: ' ' })
          }
          const subStepParity = (baseParityNum + i) % 2 === 0 ? 'even' : 'odd' as const
          const stepTokens = parseSegment(
            groups[i].replace(/^\(|\)$/g, ''), // Remove outer parens
            { stepIndex: stepIndex * 100 + i, stepParity: subStepParity, isFromTrigger },
            moveCounter,
          )
          tokens.push(...stepTokens)
        }
      } else {
        const stepTokens = parseSegment(
          step.moves,
          { stepIndex, stepParity: baseParity, isFromTrigger },
          moveCounter,
        )
        tokens.push(...stepTokens)
      }
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
