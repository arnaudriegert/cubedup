import { Color } from '../../types/cube'
import { CubeState } from '../../types/cubeState'
import { colorToTailwind } from '../../utils/colors'
import { GridSize, STICKER_SIZE_REM } from './constants'
import { getStickerTransform } from './stickerUtils'

interface Sticker3DProps {
  face: keyof CubeState
  index: number // 0-8 position within face
  color: Color
  size: GridSize
}

/**
 * A single sticker positioned in 3D space.
 */
export default function Sticker3D({ face, index, color, size }: Sticker3DProps) {
  const stickerSize = STICKER_SIZE_REM[size]
  const bgColor = colorToTailwind[color] || colorToTailwind[Color.GRAY]
  const transform = getStickerTransform(face, index, size)

  return (
    <div
      className={`absolute ${bgColor} rounded-sm`}
      style={{
        width: `${stickerSize}rem`,
        height: `${stickerSize}rem`,
        // Center the sticker at its transform origin
        marginLeft: `${-stickerSize / 2}rem`,
        marginTop: `${-stickerSize / 2}rem`,
        left: '50%',
        top: '50%',
        transform,
        backfaceVisibility: 'hidden',
      }}
    />
  )
}
