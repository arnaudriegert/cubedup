import { LastLayerGrid, GridSize } from './cube'
import PLLArrowOverlay from './PLLArrowOverlay'
import { getCaseCubeState } from '../utils/derivedPatterns'
import { applyMask, type CFOPStep } from '../utils/pieceIdentity'
import { deriveLastLayerColors } from '../utils/patternDerivation'
import type { PLLSwapInfo } from '../types/algorithm'
import type { YRotation } from './ColorRemote'

interface CaseGridProps {
  caseId: string
  mask: CFOPStep
  size?: GridSize
  selectedRotation?: YRotation
  swaps?: PLLSwapInfo
}

/**
 * Renders a last-layer grid for a case with the specified mask.
 */
export default function CaseGrid({
  caseId,
  mask,
  size = 'normal',
  selectedRotation = '',
  swaps,
}: CaseGridProps) {
  const cubeState = getCaseCubeState(caseId, selectedRotation)
  if (!cubeState) return null

  const maskedState = applyMask(cubeState, mask)
  const colors = deriveLastLayerColors(maskedState)

  return (
    <div className="relative">
      <LastLayerGrid colors={colors} size={size} />
      {swaps && <PLLArrowOverlay swaps={swaps} size={size} />}
    </div>
  )
}
