import { LastLayerGrid, GridSize } from './cube'
import PLLArrowOverlay from './PLLArrowOverlay'
import { getCaseCubeState } from '../utils/derivedPatterns'
import { applyMask } from '../utils/pieceIdentity'
import { deriveLastLayerColors } from '../utils/patternDerivation'
import type { PLLSwapInfo } from '../types/algorithm'
import type { YRotation } from './ColorRemote'

interface CaseGridProps {
  caseId: string
  size?: GridSize
  selectedRotation?: YRotation
  showArrows?: boolean
  swaps?: PLLSwapInfo
}

/**
 * Unified grid for OLL and PLL cases.
 * Uses mask-based rendering for both case types.
 */
export default function CaseGrid({
  caseId,
  size = 'normal',
  selectedRotation = '',
  showArrows = false,
  swaps,
}: CaseGridProps) {
  const isOLL = caseId.startsWith('oll-')
  const isPLL = caseId.startsWith('pll-')

  if (!isOLL && !isPLL) return null

  // Get cube state (with rotation applied)
  const cubeState = getCaseCubeState(caseId, selectedRotation)
  if (!cubeState) return null

  // Apply appropriate mask and extract last layer colors
  const maskStep = isOLL ? 'oll' : 'pll'
  const maskedState = applyMask(cubeState, maskStep)
  const colors = deriveLastLayerColors(maskedState)

  if (isOLL) {
    return <LastLayerGrid colors={colors} size={size} />
  }

  return (
    <div className="relative">
      <LastLayerGrid colors={colors} size={size} />
      {showArrows && swaps && <PLLArrowOverlay swaps={swaps} size={size} />}
    </div>
  )
}
