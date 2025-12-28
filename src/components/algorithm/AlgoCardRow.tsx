/**
 * AlgoCardRow - Reusable algorithm card row with demo button and centered display
 *
 * Used across OLL, PLL, F2L, and Triggers pages for consistent layout.
 * Provides:
 * - Ghost-style demo button (subtle → prominent on hover)
 * - Centered algorithm display with balanced spacing
 * - Inverse badge when algorithm has inverse relationship
 */

import { Link } from 'react-router-dom'
import type { Algorithm } from '../../types/algorithm'
import AlgorithmDisplay from './AlgorithmDisplay'
import InverseBadge from '../InverseBadge'
import './AlgoCardRow.css'

// Extract OLL number from algorithm ID (e.g., 'oll-25' -> 25)
function getOLLNumberFromId(algoId: string): number | null {
  const match = algoId.match(/^oll-(\d+)/)
  return match ? parseInt(match[1], 10) : null
}

export interface AlgoCardRowProps {
  // Algorithm to display (one of these)
  algorithm?: Algorithm
  notation?: string

  // Link for demo button (used when onDemo not provided)
  playgroundUrl?: string

  // Callback for in-place demo animation (takes precedence over playgroundUrl)
  onDemo?: () => void

  // Whether animation is currently playing
  isPlaying?: boolean

  // Whether animation finished and needs reset
  isFinished?: boolean

  // Callback when inverse badge is clicked (for navigation)
  onInverseClick?: (caseNumber: number) => void

  // Hide the inverse badge even if algorithm has inverse
  hideInverse?: boolean
}

export default function AlgoCardRow({
  algorithm,
  notation,
  playgroundUrl,
  onDemo,
  isPlaying,
  isFinished,
  onInverseClick,
  hideInverse,
}: AlgoCardRowProps) {
  // Check if this algorithm has an inverse
  const inverseNumber = !hideInverse && algorithm?.inverse ? getOLLNumberFromId(algorithm.inverse) : null

  // Determine button icon: playing -> ◼, finished -> ↺, idle -> ▶
  const getButtonIcon = () => {
    if (isPlaying) return '◼'
    if (isFinished) return '↺'
    return '▶'
  }

  const getButtonTitle = () => {
    if (isPlaying) return 'Playing...'
    if (isFinished) return 'Reset'
    return 'Demo'
  }

  return (
    <div className="group/algocard rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors p-3">
      <div className="flex items-center gap-2">
        {/* Demo button - ghost style, prominent on hover */}
        {onDemo ? (
          <button
            onClick={onDemo}
            disabled={isPlaying}
            title={getButtonTitle()}
            className={`ghost-icon-btn ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="text-sm">{getButtonIcon()}</span>
          </button>
        ) : playgroundUrl ? (
          <Link to={playgroundUrl} title="Demo" className="ghost-icon-btn">
            <span className="text-sm">▶</span>
          </Link>
        ) : (
          <div className="shrink-0 w-6 h-6" />
        )}

        {/* Algorithm display - centered */}
        <div className="flex-1 min-w-0">
          <AlgorithmDisplay
            algorithm={algorithm}
            notation={notation}
            size="sm"
            parentHoverGroup="algocard"
          />
        </div>

        {/* Inverse badge or spacer to balance demo button */}
        {inverseNumber ? (
          <InverseBadge inverseCaseNumber={inverseNumber} onClick={onInverseClick} />
        ) : (
          <div className="shrink-0 w-6 h-6" />
        )}
      </div>
    </div>
  )
}
