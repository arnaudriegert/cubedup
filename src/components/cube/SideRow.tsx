import { useMemo } from 'react'
import { SideRowColors } from '../../types/cube'
import { GridSize, GRID_SPACING_CLASS } from './constants'
import Sticker from './Sticker'

interface SideRowProps {
  colors: SideRowColors
  side: 'back' | 'front' | 'left' | 'right'
  size?: GridSize
  className?: string
}

export default function SideRow({
  colors,
  side,
  size = 'normal',
  className = '',
}: SideRowProps) {
  // Layout direction handles visual orientation from top-down view
  // Stickers are indexed [0,1,2] from cube state; CSS handles display order
  const layout = useMemo(() => {
    switch (side) {
      case 'back':
        return 'flex-row-reverse' // Display right-to-left (index 0 on right)
      case 'front':
        return 'flex-row' // Display left-to-right (index 0 on left)
      case 'left':
        return 'flex-col' // Display top-to-bottom (index 0 at top)
      case 'right':
        return 'flex-col-reverse' // Display bottom-to-top (index 0 at bottom)
    }
  }, [side])

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
    <div className={`flex ${layout} ${GRID_SPACING_CLASS} bg-gray-800 ${borderRadius} ${className}`}>
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
