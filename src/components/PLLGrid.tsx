import LastLayerGrid, { GridSize } from './LastLayerGrid'
import { pllToColors } from '../utils/pllToColors'
import { PLLCase } from '../data/pllCases'

interface PLLGridProps {
  pllCase: PLLCase
  size?: GridSize
}

/**
 * PLLGrid - Specialized grid for PLL cases
 * @param pllCase - The PLL case containing side colors
 * @param size - 'normal' (default) or 'compact' for smaller display
 */
export default function PLLGrid({
  pllCase, size = 'normal',
}: PLLGridProps) {
  const colors = pllToColors(pllCase)
  return <LastLayerGrid colors={colors} size={size} />
}
