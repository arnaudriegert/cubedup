import { Color } from '../types/cube'

// Tailwind background classes for cube colors
export const colorToTailwind: Record<Color, string> = {
  [Color.WHITE]: 'bg-white',
  [Color.YELLOW]: 'bg-yellow-400',
  [Color.RED]: 'bg-red-600',
  [Color.ORANGE]: 'bg-orange-500',
  [Color.BLUE]: 'bg-blue-600',
  [Color.GREEN]: 'bg-green-600',
  [Color.GRAY]: 'bg-gray-500',
}

// The 4 side face colors (excludes top/bottom)
export const SIDE_COLORS = [Color.BLUE, Color.RED, Color.GREEN, Color.ORANGE] as const
export type SideColor = (typeof SIDE_COLORS)[number]

// Color rotation type
export interface ColorRotation {
  front: Color
  right: Color
  back: Color
  left: Color
}

// All 4 Y-axis rotations starting from blue-front
// Standard orientation: Yellow top, looking at front face
const BASE_ROTATIONS: ColorRotation[] = SIDE_COLORS.map((_, i) => ({
  front: SIDE_COLORS[i],
  right: SIDE_COLORS[(i + 1) % 4],
  back: SIDE_COLORS[(i + 2) % 4],
  left: SIDE_COLORS[(i + 3) % 4],
}))

/**
 * Get all 4 color rotations starting from a specific front color
 * Useful for F2L patterns where you want to show all orientations
 */
export function getColorRotations(startingFront: SideColor = Color.BLUE): ColorRotation[] {
  const startIndex = SIDE_COLORS.indexOf(startingFront)
  return [0, 1, 2, 3].map(i => BASE_ROTATIONS[(startIndex + i) % 4])
}

