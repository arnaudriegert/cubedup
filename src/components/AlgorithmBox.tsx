import { useState, useMemo } from 'react'
import { Algorithm, AlgorithmStep } from '../data/ollCases'
import AlgorithmText from './AlgorithmText'
import PinBadge from './PinBadge'

interface AlgorithmBoxProps {
  algorithm: Algorithm
  className?: string
}


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
 * Wraps multi-move steps in parentheses (unless single step)
 */
function buildFullFromSteps(steps: AlgorithmStep[]): string {
  if (steps.length === 1) return steps[0].moves
  return steps.map(step => needsParens(step.moves) ? `(${step.moves})` : step.moves).join(' ')
}

/**
 * Build shorthand string from decomposition steps
 * Uses trigger notation when available, falls back to moves (wrapped in parens)
 */
function buildShorthandFromSteps(steps: AlgorithmStep[]): string {
  if (steps.length === 1) return steps[0].trigger || steps[0].moves
  return steps.map(step => {
    if (step.trigger) return step.trigger
    return needsParens(step.moves) ? `(${step.moves})` : step.moves
  }).join(' ')
}


/**
 * AlgorithmBox - Displays an algorithm with expand/collapse behavior
 * - Desktop: hover to show full, click to pin
 * - Mobile: tap to toggle
 */
export default function AlgorithmBox({ algorithm, className = '' }: AlgorithmBoxProps) {
  const [isPinned, setIsPinned] = useState(false)

  // Build full algorithm and shorthand from decomposition (source of truth)
  // Use simplifiedResult if available (shows cancellations), otherwise derive from steps
  const full = useMemo(() => algorithm.simplifiedResult || buildFullFromSteps(algorithm.decomposition), [algorithm])
  const shorthand = useMemo(() => buildShorthandFromSteps(algorithm.decomposition), [algorithm])
  const hasShorthand = shorthand !== full

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (hasShorthand) {
      setIsPinned(prev => !prev)
    }
  }

  // No toggle needed if there's no shorthand
  if (!hasShorthand) {
    return (
      <div className={`algorithm-box text-center ${className}`}>
        <AlgorithmText text={full} />
      </div>
    )
  }

  return (
    <div
      onClick={handleClick}
      className={`algorithm-box text-center cursor-pointer group/algo relative ${className}`}
    >
      {isPinned && <PinBadge className="absolute -top-2 -right-2" />}
      {/* Shorthand: hidden when pinned OR when hovering */}
      <div className={isPinned ? 'hidden' : 'group-hover/algo:hidden'}>
        <AlgorithmText text={shorthand} />
      </div>
      {/* Full: shown when pinned OR when hovering */}
      <div className={isPinned ? 'block' : 'hidden group-hover/algo:block'}>
        <AlgorithmText text={full} />
      </div>
    </div>
  )
}
