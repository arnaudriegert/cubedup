import { Color, LastLayerColors, TopFaceColors } from '../types/cube'
import { PLLCase } from '../data/pllCases'

/**
 * Converts PLL case side colors to the LastLayerColors format
 * for rendering with LastLayerGrid.
 *
 * For PLL, the top face is always solved (all yellow).
 */
export function pllToColors(pllCase: PLLCase): LastLayerColors {
  const solvedTop: TopFaceColors = [
    Color.YELLOW, Color.YELLOW, Color.YELLOW,
    Color.YELLOW, Color.YELLOW, Color.YELLOW,
    Color.YELLOW, Color.YELLOW, Color.YELLOW,
  ]

  return {
    top: solvedTop,
    back: pllCase.sideColors.back,
    left: pllCase.sideColors.left,
    right: pllCase.sideColors.right,
    front: pllCase.sideColors.front,
  }
}
