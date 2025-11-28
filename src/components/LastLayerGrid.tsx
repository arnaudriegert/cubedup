import { useMemo } from 'react'
import { Color, LastLayerColors, TopFaceColors, SideRowColors } from '../types/cube'

// Tailwind classes must be complete strings for JIT compilation
type GridSize = 'normal' | 'medium' | 'compact'

const STICKER_SIZES: Record<GridSize, string> = {
  normal: 'size-12',
  medium: 'size-8',
  compact: 'size-4',
}
const SIDE_STICKER_HORIZONTAL_SIZES: Record<GridSize, string> = {
  normal: 'w-12 h-8',
  medium: 'w-8 h-5',
  compact: 'w-4 h-2',
}
const SIDE_STICKER_VERTICAL_SIZES: Record<GridSize, string> = {
  normal: 'w-8 h-12',
  medium: 'w-5 h-8',
  compact: 'w-2 h-4',
}
const STICKER_SPACING = 'gap-[2px] p-[2px]'

const colorToTailwind: Record<Color, string> = {
  [Color.WHITE]: 'bg-white',
  [Color.YELLOW]: 'bg-yellow-400',
  [Color.RED]: 'bg-red-600',
  [Color.ORANGE]: 'bg-orange-500',
  [Color.BLUE]: 'bg-blue-600',
  [Color.GREEN]: 'bg-green-600',
  [Color.GRAY]: 'bg-gray-500',
}

// Border radius classes for top face stickers (CSS grid positions 0-8)
const topFaceBorderRadius: Record<number, string> = {
  1: 'rounded-b-xl',        // top-middle
  3: 'rounded-r-xl',        // middle-left
  4: 'rounded-2xl',         // center
  5: 'rounded-l-xl',        // middle-right
  7: 'rounded-t-xl',        // bottom-middle
}

const middleBorderRadius: Record<Exclude<StickerLocation, 'top'>, string> = {
  back: 'rounded-t-xl',
  front: 'rounded-b-xl',
  left: 'rounded-l-xl',
  right: 'rounded-r-xl',
}

type StickerLocation = 'top' | 'back' | 'front' | 'left' | 'right'

interface StickerProps {
  color: Color
  location: StickerLocation
  position?: number // Position within the face (0-8 for top, 0-2 for sides)
  size?: GridSize
  className?: string
}

function Sticker({
  color, location, position = 0, size = 'normal', className = '',
}: StickerProps) {
  const bgColor = colorToTailwind[color] || colorToTailwind[Color.GRAY]

  // Determine size classes based on location
  const sizeClasses = useMemo(() => {
    if (location === 'top') {
      return STICKER_SIZES[size]
    } else if (location === 'back' || location === 'front') {
      return SIDE_STICKER_HORIZONTAL_SIZES[size]
    } else {
      return SIDE_STICKER_VERTICAL_SIZES[size]
    }
  }, [location, size])

  // Determine border radius based on location and position
  const borderRadius = useMemo(() => {
    if (location === 'top') {
      return topFaceBorderRadius[position] || 'rounded-sm'
    } else if (position === 1) {
      return middleBorderRadius[location]
    } else {
      return 'rounded-sm'
    }
  }, [location, position])

  return (
    <div
      className={`${sizeClasses} ${borderRadius} ${bgColor} ${className}`}
    />
  )
}

export interface TopFaceProps {
  colors: TopFaceColors
  size?: GridSize
  className?: string
}

export function TopFace({
  colors, size = 'normal', className = '',
}: TopFaceProps) {
  return (
    <div className={`grid grid-cols-3 ${STICKER_SPACING} bg-gray-800 ${className}`}>
      {colors.map((color, i) => (
        <Sticker
          key={i}
          color={color}
          location="top"
          position={i}
          size={size}
        />
      ))}
    </div>
  )
}

interface SideRowProps {
  colors: SideRowColors
  side: 'back' | 'front' | 'left' | 'right'
  size?: GridSize
  className?: string
}

function SideRow({
  colors, side, size = 'normal', className = '',
}: SideRowProps) {
  const isVertical = side === 'left' || side === 'right'
  const layout = isVertical ? 'flex-col' : 'flex-row'
  const borderRadius = useMemo(() => {
    switch (side) {
      case 'back':
        return 'rounded-t-sm'
      case 'front':
        return 'rounded-b-sm'
      case 'left':
        return 'rounded-l-sm'
      case 'right':
        return 'rounded-r-sm'
    }
  }, [side])

  return (
    <div className={`flex ${layout} ${STICKER_SPACING} bg-gray-800 ${borderRadius} ${className}`}>
      {colors.map((color, i) => (
        <Sticker
          key={i}
          color={color}
          location={side}
          position={i}
          size={size}
        />
      ))}
    </div>
  )
}

interface LastLayerGridProps {
  colors: LastLayerColors
  size?: GridSize
}

/**
 * LastLayerGrid - Displays the last layer of a Rubik's cube
 * @param colors - Structured colors for top, back, left, right, front faces
 * @param size - 'normal' (default) or 'compact' for smaller display
 */
export default function LastLayerGrid({
  colors, size = 'normal',
}: LastLayerGridProps) {
  return (
    <div className="inline-flex flex-col items-center gap-1">
      {/* Back side */}
      <SideRow colors={colors.back} side="back" size={size} />

      {/* Middle row: Left + Top face + Right */}
      <div className="flex flex-row gap-1 items-center">
        <SideRow colors={colors.left} side="left" size={size} />
        <TopFace colors={colors.top} size={size} />
        <SideRow colors={colors.right} side="right" size={size} />
      </div>

      {/* Front side */}
      <SideRow colors={colors.front} side="front" size={size} />
    </div>
  )
}

export type { GridSize }
