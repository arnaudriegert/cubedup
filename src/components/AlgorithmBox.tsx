import { useState } from 'react'
import { Algorithm } from '../data/ollCases'
import AlgorithmText from './AlgorithmText'
import PinBadge from './PinBadge'

interface AlgorithmBoxProps {
  algorithm: Algorithm
  className?: string
}

/**
 * AlgorithmBox - Displays an algorithm with expand/collapse behavior
 * - Desktop: hover to show full, click to pin
 * - Mobile: tap to toggle
 */
export default function AlgorithmBox({ algorithm, className = '' }: AlgorithmBoxProps) {
  const [isPinned, setIsPinned] = useState(false)
  const displayText = algorithm.shorthand || algorithm.full
  const hasShorthand = !!algorithm.shorthand

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
        <AlgorithmText text={algorithm.full} />
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
        <AlgorithmText text={displayText} />
      </div>
      {/* Full: shown when pinned OR when hovering */}
      <div className={isPinned ? 'block' : 'hidden group-hover/algo:block'}>
        <AlgorithmText text={algorithm.full} />
      </div>
    </div>
  )
}
