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
