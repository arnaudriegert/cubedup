import LastLayerGrid, { GridSize } from './LastLayerGrid'
import { ollToColors } from '../utils/ollToColors'
import { OLLOrientations } from '../types/cube'

interface OLLGridProps {
  orientations: OLLOrientations
  size?: GridSize
}

/**
 * OLLGrid - Specialized grid for OLL cases
 * @param orientations - Tuple of 9 orientations (one per top face sticker)
 * @param size - 'normal' (default) or 'compact' for smaller display
 */
export default function OLLGrid({
  orientations, size = 'normal',
}: OLLGridProps) {
  const colors = ollToColors(orientations)
  return <LastLayerGrid colors={colors} size={size} />
}
