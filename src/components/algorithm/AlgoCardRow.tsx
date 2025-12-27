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

  // Link for demo button
  playgroundUrl: string

  // Callback when inverse badge is clicked (for navigation)
  onInverseClick?: (caseNumber: number) => void
}

export default function AlgoCardRow({
  algorithm,
  notation,
  playgroundUrl,
  onInverseClick,
}: AlgoCardRowProps) {
  // Check if this algorithm has an inverse
  const inverseNumber = algorithm?.inverse ? getOLLNumberFromId(algorithm.inverse) : null

  return (
    <div className="group/algocard rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors p-3">
      <div className="flex items-center gap-2">
        {/* Demo button - ghost style, prominent on hover */}
        <Link to={playgroundUrl} title="Demo" className="ghost-icon-btn">
          <span className="text-sm">▶</span>
        </Link>

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
