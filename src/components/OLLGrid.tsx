import { LastLayerGrid, GridSize } from './cube'
import { ollToColors } from '../utils/ollToColors'
import type { OLLOrientations } from '../types/cube'
import { getOLLOrientations } from '../utils/derivedPatterns'

interface OLLGridProps {
  /** Explicit orientations (optional override) */
  orientations?: OLLOrientations
  /** Case ID to derive orientations from (e.g., "oll-21") */
  caseId?: string
  size?: GridSize
}

/**
 * OLLGrid - Specialized grid for OLL cases
 *
 * Accepts either explicit orientations or a caseId to derive from.
 * When caseId is provided, orientations are derived from the algorithm.
 */
export default function OLLGrid({
  orientations,
  caseId,
  size = 'normal',
}: OLLGridProps) {
  // Use explicit orientations if provided, otherwise derive from caseId
  const effectiveOrientations = orientations ?? (caseId ? getOLLOrientations(caseId) : null)

  if (!effectiveOrientations) {
    // Fallback: show empty grid if no data
    return null
  }

  const colors = ollToColors(effectiveOrientations)
  return <LastLayerGrid colors={colors} size={size} />
}
