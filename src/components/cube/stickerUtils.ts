import { CubeState } from '../../types/cubeState'
import { GridSize, STICKER_SIZE_REM } from './constants'

// Gap between stickers in rem (from gap-0.5 = 0.125rem)
const GAP_REM = 0.125

/**
 * Get the 3D transform for a sticker based on its face and position.
 *
 * The transform positions the sticker in 3D space:
 * 1. Face rotation orients the sticker's plane
 * 2. TranslateZ pushes it to the face surface
 * 3. TranslateX/Y offsets it within the face grid
 */
export function getStickerTransform(
  face: keyof CubeState,
  index: number,
  size: GridSize,
): string {
  const stickerSize = STICKER_SIZE_REM[size]
  // Distance from cube center to face surface
  const halfFaceSize = (3 * stickerSize + 4 * GAP_REM) / 2

  // Pitch = distance between sticker centers
  const pitch = stickerSize + GAP_REM

  // Calculate row/col from index (0-8)
  const row = Math.floor(index / 3)
  const col = index % 3

  // Offset from face center (-1, 0, or 1 times pitch)
  const xOffset = (col - 1) * pitch
  const yOffset = (row - 1) * pitch

  // Face rotation and position (matching IsometricCube transforms)
  const faceTransforms: Record<keyof CubeState, string> = {
    front: `translateZ(${halfFaceSize}rem)`,
    back: `rotateY(180deg) translateZ(${halfFaceSize}rem)`,
    right: `rotateY(90deg) translateZ(${halfFaceSize}rem)`,
    left: `rotateY(-90deg) translateZ(${halfFaceSize}rem)`,
    top: `rotateX(90deg) translateZ(${halfFaceSize}rem)`,
    bottom: `rotateX(-90deg) translateZ(${halfFaceSize}rem)`,
  }

  return `${faceTransforms[face]} translateX(${xOffset}rem) translateY(${yOffset}rem)`
}
