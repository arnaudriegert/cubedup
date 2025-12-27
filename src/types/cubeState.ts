import type { FaceColors } from './cube'
import { Color } from './cube'

// Re-export for convenience
export type { FaceColors }
export { Color }

// Complete cube state - all 6 faces required
export interface CubeState {
  top: FaceColors     // Yellow (standard orientation)
  bottom: FaceColors  // White
  front: FaceColors   // Blue
  back: FaceColors    // Green
  left: FaceColors    // Orange
  right: FaceColors   // Red
}

// Face indexing convention (looking at the face):
// 0 1 2
// 3 4 5
// 6 7 8

// Move types
export type FaceMove = 'R' | 'L' | 'U' | 'D' | 'F' | 'B'
export type WideMove = 'r' | 'l' | 'u' | 'd' | 'f' | 'b' // Two-layer moves
export type SliceMove = 'M' | 'S' | 'E' // Middle layer moves
export type CubeRotation = 'x' | 'y' | 'z'
export type MoveBase = FaceMove | WideMove | SliceMove | CubeRotation
export type MoveModifier = '' | "'" | '2'

export interface Move {
  base: MoveBase
  modifier: MoveModifier
}

// Type guard to check if a move is a face move
export function isFaceMove(base: MoveBase): base is FaceMove {
  return ['R', 'L', 'U', 'D', 'F', 'B'].includes(base)
}

// Type guard to check if a move is a wide move
export function isWideMove(base: MoveBase): base is WideMove {
  return ['r', 'l', 'u', 'd', 'f', 'b'].includes(base)
}

// Type guard to check if a move is a slice move
export function isSliceMove(base: MoveBase): base is SliceMove {
  return ['M', 'S', 'E'].includes(base)
}

// Type guard to check if a move is a cube rotation
export function isCubeRotation(base: MoveBase): base is CubeRotation {
  return ['x', 'y', 'z'].includes(base)
}

// Rotation axis for animation
export type RotationAxis = 'x' | 'y' | 'z'

// Animation direction info
export interface MoveAnimation {
  move: MoveBase
  axis: RotationAxis
  degrees: number // 90, -90, or 180
  isFullCube: boolean // true for x, y, z rotations
}

// View angle for the cube
export type CubeView = 'top-front-right' | 'top-front-left' | 'bottom-front-right'
