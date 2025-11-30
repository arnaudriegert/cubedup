import { FaceColors } from '../../types/cube'
import { GridSize, GRID_SPACING_CLASS } from './constants'
import Sticker from './Sticker'

export interface FaceProps {
  colors: FaceColors
  size?: GridSize
  className?: string
}

export default function Face({
  colors,
  size = 'normal',
  className = '',
}: FaceProps) {
  return (
    <div className={`grid grid-cols-3 ${GRID_SPACING_CLASS} bg-gray-800 ${className}`}>
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
