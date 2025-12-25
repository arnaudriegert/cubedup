import { useMemo } from 'react'
import { Color } from '../../types/cube'
import { colorToTailwind } from '../../utils/colors'
import {
  type GridSize,
  STICKER_CLASSES,
  SIDE_HORIZONTAL_CLASSES,
  SIDE_VERTICAL_CLASSES,
  TOP_FACE_BORDER_RADIUS,
  SIDE_MIDDLE_BORDER_RADIUS,
} from './constants'

export type StickerLocation = 'top' | 'back' | 'front' | 'left' | 'right'

interface StickerProps {
  color: Color
  location: StickerLocation
  position?: number // Position within the face (0-8 for top, 0-2 for sides)
  size?: GridSize
  className?: string
}

export default function Sticker({
  color,
  location,
  position = 0,
  size = 'normal',
  className = '',
}: StickerProps) {
  const bgColor = colorToTailwind[color] || colorToTailwind[Color.GRAY]

  // Determine size classes based on location
  const sizeClasses = useMemo(() => {
    if (location === 'top') {
      return STICKER_CLASSES[size]
    } else if (location === 'back' || location === 'front') {
      return SIDE_HORIZONTAL_CLASSES[size]
    } else {
      return SIDE_VERTICAL_CLASSES[size]
    }
  }, [location, size])

  // Determine border radius based on location and position
  const borderRadius = useMemo(() => {
    if (location === 'top') {
      return TOP_FACE_BORDER_RADIUS[position] ?? 'rounded-sm'
    } else if (position === 1) {
      return SIDE_MIDDLE_BORDER_RADIUS[location] ?? 'rounded-sm'
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
