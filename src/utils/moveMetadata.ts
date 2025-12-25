import type {
  MoveBase, FaceMove, WideMove, SliceMove, CubeRotation, RotationAxis,
} from '../types/cubeState'

// Move info for animation and analysis
export interface MoveInfo {
  axis: RotationAxis
  sign: number        // Animation sign for CSS 3D transforms
  layers: 1 | 2 | 3   // 1=face/slice, 2=wide, 3=full cube
}

// Combined metadata for all move types
// Signs are determined by CSS 3D transform behavior in the isometric view
export const MOVE_METADATA: Record<MoveBase, MoveInfo> = {
  // Face moves (single layer)
  R: { axis: 'x', sign: 1, layers: 1 },
  L: { axis: 'x', sign: -1, layers: 1 },
  U: { axis: 'y', sign: -1, layers: 1 },
  D: { axis: 'y', sign: 1, layers: 1 },
  F: { axis: 'z', sign: 1, layers: 1 },
  B: { axis: 'z', sign: -1, layers: 1 },

  // Slice moves (middle layer)
  M: { axis: 'x', sign: -1, layers: 1 }, // follows L
  S: { axis: 'z', sign: 1, layers: 1 },  // follows F
  E: { axis: 'y', sign: 1, layers: 1 },  // follows D

  // Wide moves (two layers)
  r: { axis: 'x', sign: 1, layers: 2 },  // follows R
  l: { axis: 'x', sign: -1, layers: 2 }, // follows L
  u: { axis: 'y', sign: -1, layers: 2 }, // follows U
  d: { axis: 'y', sign: 1, layers: 2 },  // follows D
  f: { axis: 'z', sign: 1, layers: 2 },  // follows F
  b: { axis: 'z', sign: -1, layers: 2 }, // follows B

  // Cube rotations (all layers)
  x: { axis: 'x', sign: 1, layers: 3 },
  y: { axis: 'y', sign: -1, layers: 3 },
  z: { axis: 'z', sign: 1, layers: 3 },
}

// Helper to check if a move is a full cube rotation
export function isFullCubeMove(base: MoveBase): base is CubeRotation {
  return MOVE_METADATA[base].layers === 3
}

// Get animation degrees for a move modifier
export function getDegreesForModifier(modifier: '' | "'" | '2'): number {
  if (modifier === '2') return 180
  if (modifier === "'") return -90
  return 90
}
