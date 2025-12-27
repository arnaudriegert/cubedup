import { LastLayerGrid, GridSize } from './cube'
import type { PLLSwapInfo } from '../types/algorithm'
import {
  Color, type LastLayerColors, type FaceColors,
} from '../types/cube'
import PLLArrowOverlay from './PLLArrowOverlay'
import { getPLLSideColorsRotated } from '../utils/derivedPatterns'

interface PLLGridProps {
  /** Case ID to derive patterns from (e.g., "pll-ua") */
  caseId?: string
  /** Swaps for arrow overlay */
  swaps?: PLLSwapInfo
  size?: GridSize
  selectedColor?: Color
  showArrows?: boolean
}

/**
 * PLLGrid - Specialized grid for PLL cases
 *
 * Uses caseId to derive side colors from algorithms.
 * Provide swaps separately for arrow overlay.
 */
export default function PLLGrid({
  caseId,
  swaps,
  size = 'normal',
  selectedColor = Color.BLUE,
  showArrows = false,
}: PLLGridProps) {
  if (!caseId) {
    return null
  }

  // Derive side colors with rotation applied BEFORE inverse algorithm
  const sideColors = getPLLSideColorsRotated(caseId, selectedColor)

  if (!sideColors) {
    return null
  }

  // Build LastLayerColors (PLL always has solved yellow top)
  const solvedTop: FaceColors = [
    Color.YELLOW, Color.YELLOW, Color.YELLOW,
    Color.YELLOW, Color.YELLOW, Color.YELLOW,
    Color.YELLOW, Color.YELLOW, Color.YELLOW,
  ]

  const colors: LastLayerColors = {
    top: solvedTop,
    back: sideColors.back,
    left: sideColors.left,
    right: sideColors.right,
    front: sideColors.front,
  }

  return (
    <div className="relative">
      <LastLayerGrid colors={colors} size={size} />
      {showArrows && swaps && (
        <PLLArrowOverlay swaps={swaps} size={size} />
      )}
    </div>
  )
}
