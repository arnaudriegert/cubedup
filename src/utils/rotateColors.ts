import { Color } from '../types/cube'
import { PLLCase, PLLSideColors } from '../data/pllCases'
import {
  SIDE_COLORS, isSideColor, getRotationSteps,
} from './colors'

// All PLL cases are defined with blue as the reference (front) color
const REFERENCE_COLOR = Color.BLUE

export function rotatePLLColors(
  pllCase: PLLCase,
  targetFrontColor: Color,
): PLLCase['sideColors'] {
  // If target is not a side color, return original
  if (!isSideColor(targetFrontColor)) {
    return pllCase.sideColors
  }

  const steps = getRotationSteps(REFERENCE_COLOR, targetFrontColor)

  // No rotation needed
  if (steps === 0) return pllCase.sideColors

  // Build color mapping based on rotation steps
  const colorMap: Record<Color, Color> = {
    [Color.BLUE]: SIDE_COLORS[(0 + steps) % 4],
    [Color.RED]: SIDE_COLORS[(1 + steps) % 4],
    [Color.GREEN]: SIDE_COLORS[(2 + steps) % 4],
    [Color.ORANGE]: SIDE_COLORS[(3 + steps) % 4],
    // Non-side colors stay the same
    [Color.WHITE]: Color.WHITE,
    [Color.YELLOW]: Color.YELLOW,
    [Color.GRAY]: Color.GRAY,
  }

  const rotateSide = (side: PLLSideColors): PLLSideColors =>
    side.map(c => colorMap[c]) as PLLSideColors

  return {
    back: rotateSide(pllCase.sideColors.back),
    left: rotateSide(pllCase.sideColors.left),
    right: rotateSide(pllCase.sideColors.right),
    front: rotateSide(pllCase.sideColors.front),
  }
}
