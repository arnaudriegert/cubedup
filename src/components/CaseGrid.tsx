import { LastLayerGrid, GridSize } from './cube'
import PLLArrowOverlay from './PLLArrowOverlay'
import { ollToColors } from '../utils/ollToColors'
import { getOLLOrientations, getSideColorsRotated } from '../utils/derivedPatterns'
import type { PLLSwapInfo } from '../types/algorithm'
import {
  Color, type LastLayerColors, type FaceColors,
} from '../types/cube'

interface CaseGridProps {
  caseId: string
  size?: GridSize
  selectedColor?: Color
  showArrows?: boolean
  swaps?: PLLSwapInfo
}

/**
 * Unified grid for OLL and PLL cases.
 * Automatically detects case type from caseId prefix.
 */
export default function CaseGrid({
  caseId,
  size = 'normal',
  selectedColor = Color.BLUE,
  showArrows = false,
  swaps,
}: CaseGridProps) {
  const isOLL = caseId.startsWith('oll-')
  const isPLL = caseId.startsWith('pll-')

  if (isOLL) {
    const orientations = getOLLOrientations(caseId)
    if (!orientations) return null
    const colors = ollToColors(orientations)
    return <LastLayerGrid colors={colors} size={size} />
  }

  if (isPLL) {
    const sideColors = getSideColorsRotated(caseId, selectedColor)
    if (!sideColors) return null

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
        {showArrows && swaps && <PLLArrowOverlay swaps={swaps} size={size} />}
      </div>
    )
  }

  return null
}
