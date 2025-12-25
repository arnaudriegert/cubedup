import { Color, FaceColors } from '../types/cube'
import {
  CubeState, Move, FaceMove, WideMove, SliceMove, CubeRotation, MoveAnimation,
  isFaceMove, isWideMove, isSliceMove, isCubeRotation,
} from '../types/cubeState'
import {
  MOVE_METADATA, isFullCubeMove, getDegreesForModifier,
} from './moveMetadata'

/**
 * Create a solved cube with standard color orientation:
 * - Top: Yellow
 * - Bottom: White
 * - Front: Blue
 * - Back: Green
 * - Left: Orange
 * - Right: Red
 */
export function createSolvedCube(): CubeState {
  const solidFace = (color: Color): FaceColors => [
    color, color, color,
    color, color, color,
    color, color, color,
  ]

  return {
    top: solidFace(Color.YELLOW),
    bottom: solidFace(Color.WHITE),
    front: solidFace(Color.BLUE),
    back: solidFace(Color.GREEN),
    left: solidFace(Color.ORANGE),
    right: solidFace(Color.RED),
  }
}

/**
 * Rotate a face clockwise (the 9 stickers on the face itself)
 * Index mapping:
 * 0 1 2      6 3 0
 * 3 4 5  ->  7 4 1
 * 6 7 8      8 5 2
 */
function rotateFaceClockwise(face: FaceColors): FaceColors {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2],
  ]
}

/**
 * Rotate a face counter-clockwise
 * Index mapping:
 * 0 1 2      2 5 8
 * 3 4 5  ->  1 4 7
 * 6 7 8      0 3 6
 */
function rotateFaceCounterClockwise(face: FaceColors): FaceColors {
  return [
    face[2], face[5], face[8],
    face[1], face[4], face[7],
    face[0], face[3], face[6],
  ]
}

/**
 * Deep clone a cube state
 */
function cloneCube(state: CubeState): CubeState {
  return {
    top: [...state.top] as FaceColors,
    bottom: [...state.bottom] as FaceColors,
    front: [...state.front] as FaceColors,
    back: [...state.back] as FaceColors,
    left: [...state.left] as FaceColors,
    right: [...state.right] as FaceColors,
  }
}

/**
 * Apply a single clockwise quarter turn for a face move
 */
function applyClockwiseTurn(state: CubeState, face: FaceMove): CubeState {
  const newState = cloneCube(state)

  switch (face) {
    case 'R': {
      // Rotate right face clockwise
      newState.right = rotateFaceClockwise(state.right)
      // Cycle: front[2,5,8] -> top[2,5,8] -> back[6,3,0] -> bottom[2,5,8] -> front
      const temp = [state.front[2], state.front[5], state.front[8]]
      newState.front[2] = state.bottom[2]
      newState.front[5] = state.bottom[5]
      newState.front[8] = state.bottom[8]
      newState.bottom[2] = state.back[6]
      newState.bottom[5] = state.back[3]
      newState.bottom[8] = state.back[0]
      newState.back[6] = state.top[2]
      newState.back[3] = state.top[5]
      newState.back[0] = state.top[8]
      newState.top[2] = temp[0]
      newState.top[5] = temp[1]
      newState.top[8] = temp[2]
      break
    }
    case 'L': {
      // Rotate left face clockwise
      newState.left = rotateFaceClockwise(state.left)
      // Cycle: front[0,3,6] -> bottom[0,3,6] -> back[8,5,2] -> top[0,3,6] -> front
      const temp = [state.front[0], state.front[3], state.front[6]]
      newState.front[0] = state.top[0]
      newState.front[3] = state.top[3]
      newState.front[6] = state.top[6]
      newState.top[0] = state.back[8]
      newState.top[3] = state.back[5]
      newState.top[6] = state.back[2]
      newState.back[8] = state.bottom[0]
      newState.back[5] = state.bottom[3]
      newState.back[2] = state.bottom[6]
      newState.bottom[0] = temp[0]
      newState.bottom[3] = temp[1]
      newState.bottom[6] = temp[2]
      break
    }
    case 'U': {
      // Rotate top face clockwise
      newState.top = rotateFaceClockwise(state.top)
      // Cycle: front[0,1,2] -> left[0,1,2] -> back[0,1,2] -> right[0,1,2] -> front
      const temp = [state.front[0], state.front[1], state.front[2]]
      newState.front[0] = state.right[0]
      newState.front[1] = state.right[1]
      newState.front[2] = state.right[2]
      newState.right[0] = state.back[0]
      newState.right[1] = state.back[1]
      newState.right[2] = state.back[2]
      newState.back[0] = state.left[0]
      newState.back[1] = state.left[1]
      newState.back[2] = state.left[2]
      newState.left[0] = temp[0]
      newState.left[1] = temp[1]
      newState.left[2] = temp[2]
      break
    }
    case 'D': {
      // Rotate bottom face clockwise
      newState.bottom = rotateFaceClockwise(state.bottom)
      // Cycle: front[6,7,8] -> right[6,7,8] -> back[6,7,8] -> left[6,7,8] -> front
      const temp = [state.front[6], state.front[7], state.front[8]]
      newState.front[6] = state.left[6]
      newState.front[7] = state.left[7]
      newState.front[8] = state.left[8]
      newState.left[6] = state.back[6]
      newState.left[7] = state.back[7]
      newState.left[8] = state.back[8]
      newState.back[6] = state.right[6]
      newState.back[7] = state.right[7]
      newState.back[8] = state.right[8]
      newState.right[6] = temp[0]
      newState.right[7] = temp[1]
      newState.right[8] = temp[2]
      break
    }
    case 'F': {
      // Rotate front face clockwise
      newState.front = rotateFaceClockwise(state.front)
      // Cycle: top[6,7,8] -> right[0,3,6] -> bottom[2,1,0] -> left[8,5,2] -> top
      const temp = [state.top[6], state.top[7], state.top[8]]
      newState.top[6] = state.left[8]
      newState.top[7] = state.left[5]
      newState.top[8] = state.left[2]
      newState.left[8] = state.bottom[2]
      newState.left[5] = state.bottom[1]
      newState.left[2] = state.bottom[0]
      newState.bottom[2] = state.right[0]
      newState.bottom[1] = state.right[3]
      newState.bottom[0] = state.right[6]
      newState.right[0] = temp[0]
      newState.right[3] = temp[1]
      newState.right[6] = temp[2]
      break
    }
    case 'B': {
      // Rotate back face clockwise
      newState.back = rotateFaceClockwise(state.back)
      // Cycle: top[0,1,2] -> left[6,3,0] -> bottom[8,7,6] -> right[2,5,8] -> top
      const temp = [state.top[0], state.top[1], state.top[2]]
      newState.top[0] = state.right[2]
      newState.top[1] = state.right[5]
      newState.top[2] = state.right[8]
      newState.right[2] = state.bottom[8]
      newState.right[5] = state.bottom[7]
      newState.right[8] = state.bottom[6]
      newState.bottom[8] = state.left[6]
      newState.bottom[7] = state.left[3]
      newState.bottom[6] = state.left[0]
      newState.left[6] = temp[0]
      newState.left[3] = temp[1]
      newState.left[0] = temp[2]
      break
    }
  }

  return newState
}

/**
 * Apply a single counter-clockwise quarter turn for a face move
 */
function applyCounterClockwiseTurn(state: CubeState, face: FaceMove): CubeState {
  // A counter-clockwise turn is equivalent to three clockwise turns
  let newState = applyClockwiseTurn(state, face)
  newState = applyClockwiseTurn(newState, face)
  newState = applyClockwiseTurn(newState, face)
  return newState
}

/**
 * Apply a clockwise cube rotation (x, y, or z)
 * x: rotate around R axis (R and L' combined effect on orientation)
 * y: rotate around U axis (U and D' combined effect on orientation)
 * z: rotate around F axis (F and B' combined effect on orientation)
 */
function applyCubeRotationClockwise(state: CubeState, rotation: CubeRotation): CubeState {
  switch (rotation) {
    case 'x':
      // x rotation: front->top->back->bottom->front, right stays (CW), left stays (CCW)
      return {
        top: [...state.front] as FaceColors,
        front: [...state.bottom] as FaceColors,
        bottom: rotateFaceClockwise(rotateFaceClockwise(state.back)),
        back: rotateFaceClockwise(rotateFaceClockwise(state.top)),
        right: rotateFaceClockwise(state.right),
        left: rotateFaceCounterClockwise(state.left),
      }
    case 'y':
      // y rotation: front->left->back->right->front, top stays (CW), bottom stays (CCW)
      return {
        front: [...state.right] as FaceColors,
        right: [...state.back] as FaceColors,
        back: [...state.left] as FaceColors,
        left: [...state.front] as FaceColors,
        top: rotateFaceClockwise(state.top),
        bottom: rotateFaceCounterClockwise(state.bottom),
      }
    case 'z':
      // z rotation: top->right->bottom->left->top, front stays (CW), back stays (CCW)
      return {
        top: rotateFaceClockwise(state.left),
        right: rotateFaceClockwise(state.top),
        bottom: rotateFaceClockwise(state.right),
        left: rotateFaceClockwise(state.bottom),
        front: rotateFaceClockwise(state.front),
        back: rotateFaceCounterClockwise(state.back),
      }
  }
}

/**
 * Apply a counter-clockwise cube rotation
 */
function applyCubeRotationCounterClockwise(state: CubeState, rotation: CubeRotation): CubeState {
  // Counter-clockwise is three clockwise rotations
  let newState = applyCubeRotationClockwise(state, rotation)
  newState = applyCubeRotationClockwise(newState, rotation)
  newState = applyCubeRotationClockwise(newState, rotation)
  return newState
}

/**
 * Apply a clockwise slice move (M, S, E)
 * M: middle layer between R and L, follows L direction
 * S: standing layer between F and B, follows F direction
 * E: equatorial layer between U and D, follows D direction
 */
function applySliceClockwiseTurn(state: CubeState, slice: SliceMove): CubeState {
  const newState = cloneCube(state)

  switch (slice) {
    case 'M': {
      // M follows L direction: front[1,4,7] -> bottom -> back(reversed) -> top -> front
      const temp = [state.front[1], state.front[4], state.front[7]]
      newState.front[1] = state.top[1]
      newState.front[4] = state.top[4]
      newState.front[7] = state.top[7]
      newState.top[1] = state.back[7]
      newState.top[4] = state.back[4]
      newState.top[7] = state.back[1]
      newState.back[7] = state.bottom[1]
      newState.back[4] = state.bottom[4]
      newState.back[1] = state.bottom[7]
      newState.bottom[1] = temp[0]
      newState.bottom[4] = temp[1]
      newState.bottom[7] = temp[2]
      break
    }
    case 'S': {
      // S follows F direction: top[3,4,5] -> right[1,4,7] -> bottom[5,4,3] -> left[7,4,1] -> top
      const temp = [state.top[3], state.top[4], state.top[5]]
      newState.top[3] = state.left[7]
      newState.top[4] = state.left[4]
      newState.top[5] = state.left[1]
      newState.left[7] = state.bottom[5]
      newState.left[4] = state.bottom[4]
      newState.left[1] = state.bottom[3]
      newState.bottom[5] = state.right[1]
      newState.bottom[4] = state.right[4]
      newState.bottom[3] = state.right[7]
      newState.right[1] = temp[0]
      newState.right[4] = temp[1]
      newState.right[7] = temp[2]
      break
    }
    case 'E': {
      // E follows D direction: front[3,4,5] -> left -> back -> right -> front
      const temp = [state.front[3], state.front[4], state.front[5]]
      newState.front[3] = state.left[3]
      newState.front[4] = state.left[4]
      newState.front[5] = state.left[5]
      newState.left[3] = state.back[3]
      newState.left[4] = state.back[4]
      newState.left[5] = state.back[5]
      newState.back[3] = state.right[3]
      newState.back[4] = state.right[4]
      newState.back[5] = state.right[5]
      newState.right[3] = temp[0]
      newState.right[4] = temp[1]
      newState.right[5] = temp[2]
      break
    }
  }

  return newState
}

/**
 * Apply a counter-clockwise slice move
 */
function applySliceCounterClockwiseTurn(state: CubeState, slice: SliceMove): CubeState {
  // Counter-clockwise is three clockwise turns
  let newState = applySliceClockwiseTurn(state, slice)
  newState = applySliceClockwiseTurn(newState, slice)
  newState = applySliceClockwiseTurn(newState, slice)
  return newState
}

/**
 * Apply a wide move (two-layer move)
 * Wide moves combine a face move with a slice move:
 * r = R + M', l = L + M, u = U + E', d = D + E, f = F + S, b = B + S'
 */
function applyWideMoveClockwise(state: CubeState, wideMove: WideMove): CubeState {
  // Map wide moves to face + slice combinations
  const wideMoveMap: Record<WideMove, { face: FaceMove; slice: SliceMove; sliceInverse: boolean }> = {
    r: { face: 'R', slice: 'M', sliceInverse: true },  // r = R + M'
    l: { face: 'L', slice: 'M', sliceInverse: false }, // l = L + M
    u: { face: 'U', slice: 'E', sliceInverse: true },  // u = U + E'
    d: { face: 'D', slice: 'E', sliceInverse: false }, // d = D + E
    f: { face: 'F', slice: 'S', sliceInverse: false }, // f = F + S
    b: { face: 'B', slice: 'S', sliceInverse: true },  // b = B + S'
  }

  const { face, slice, sliceInverse } = wideMoveMap[wideMove]
  let newState = applyClockwiseTurn(state, face)
  newState = sliceInverse
    ? applySliceCounterClockwiseTurn(newState, slice)
    : applySliceClockwiseTurn(newState, slice)
  return newState
}

/**
 * Apply a counter-clockwise wide move
 */
function applyWideMoveCounterClockwise(state: CubeState, wideMove: WideMove): CubeState {
  // Three clockwise turns = one counter-clockwise
  let newState = applyWideMoveClockwise(state, wideMove)
  newState = applyWideMoveClockwise(newState, wideMove)
  newState = applyWideMoveClockwise(newState, wideMove)
  return newState
}

/**
 * Apply a move to the cube state (handles face moves, wide moves, slice moves, and cube rotations)
 */
export function applyMove(state: CubeState, move: Move): CubeState {
  const { base, modifier } = move

  if (isFaceMove(base)) {
    switch (modifier) {
      case '':
        return applyClockwiseTurn(state, base)
      case "'":
        return applyCounterClockwiseTurn(state, base)
      case '2':
        return applyClockwiseTurn(applyClockwiseTurn(state, base), base)
      default:
        return state
    }
  } else if (isWideMove(base)) {
    switch (modifier) {
      case '':
        return applyWideMoveClockwise(state, base)
      case "'":
        return applyWideMoveCounterClockwise(state, base)
      case '2':
        return applyWideMoveClockwise(applyWideMoveClockwise(state, base), base)
      default:
        return state
    }
  } else if (isSliceMove(base)) {
    switch (modifier) {
      case '':
        return applySliceClockwiseTurn(state, base)
      case "'":
        return applySliceCounterClockwiseTurn(state, base)
      case '2':
        return applySliceClockwiseTurn(applySliceClockwiseTurn(state, base), base)
      default:
        return state
    }
  } else if (isCubeRotation(base)) {
    switch (modifier) {
      case '':
        return applyCubeRotationClockwise(state, base)
      case "'":
        return applyCubeRotationCounterClockwise(state, base)
      case '2':
        return applyCubeRotationClockwise(applyCubeRotationClockwise(state, base), base)
      default:
        return state
    }
  }

  return state
}

/**
 * Apply multiple moves in sequence
 */
export function applyMoves(state: CubeState, moves: Move[]): CubeState {
  return moves.reduce((currentState, move) => applyMove(currentState, move), state)
}

/**
 * Get animation info for a move (axis and degrees)
 */
export function getMoveAnimation(move: Move): MoveAnimation {
  const { base, modifier } = move
  const { axis, sign } = MOVE_METADATA[base]
  const degrees = getDegreesForModifier(modifier)

  return {
    move: base,
    axis,
    degrees: degrees * sign,
    isFullCube: isFullCubeMove(base),
  }
}

/**
 * Check if two cube states are equal
 */
export function cubesEqual(a: CubeState, b: CubeState): boolean {
  const faces: (keyof CubeState)[] = ['top', 'bottom', 'front', 'back', 'left', 'right']
  return faces.every(face =>
    a[face].every((color, index) => color === b[face][index]))
}

/**
 * Check if the cube is solved
 */
export function isSolved(state: CubeState): boolean {
  return cubesEqual(state, createSolvedCube())
}

// Edge strip from an adjacent face (3 stickers that rotate with a layer)
export type EdgeStrip = [Color, Color, Color]

// All the stickers that rotate with a layer move
export interface LayerStickers {
  face: FaceColors  // The 9 stickers on the rotating face
  // Adjacent strips in clockwise order (when looking at the face)
  strips: {
    face: keyof CubeState
    indices: [number, number, number]
    colors: EdgeStrip
  }[]
}

/**
 * Extract all stickers that belong to a rotating layer
 */
export function getLayerStickers(state: CubeState, faceMove: FaceMove): LayerStickers {
  switch (faceMove) {
    case 'R':
      return {
        face: state.right,
        strips: [
          { face: 'front', indices: [2, 5, 8], colors: [state.front[2], state.front[5], state.front[8]] },
          { face: 'top', indices: [2, 5, 8], colors: [state.top[2], state.top[5], state.top[8]] },
          { face: 'back', indices: [6, 3, 0], colors: [state.back[6], state.back[3], state.back[0]] },
          { face: 'bottom', indices: [2, 5, 8], colors: [state.bottom[2], state.bottom[5], state.bottom[8]] },
        ],
      }
    case 'L':
      return {
        face: state.left,
        strips: [
          { face: 'front', indices: [0, 3, 6], colors: [state.front[0], state.front[3], state.front[6]] },
          { face: 'bottom', indices: [0, 3, 6], colors: [state.bottom[0], state.bottom[3], state.bottom[6]] },
          { face: 'back', indices: [8, 5, 2], colors: [state.back[8], state.back[5], state.back[2]] },
          { face: 'top', indices: [0, 3, 6], colors: [state.top[0], state.top[3], state.top[6]] },
        ],
      }
    case 'U':
      return {
        face: state.top,
        strips: [
          { face: 'front', indices: [0, 1, 2], colors: [state.front[0], state.front[1], state.front[2]] },
          { face: 'left', indices: [0, 1, 2], colors: [state.left[0], state.left[1], state.left[2]] },
          { face: 'back', indices: [0, 1, 2], colors: [state.back[0], state.back[1], state.back[2]] },
          { face: 'right', indices: [0, 1, 2], colors: [state.right[0], state.right[1], state.right[2]] },
        ],
      }
    case 'D':
      return {
        face: state.bottom,
        strips: [
          { face: 'front', indices: [6, 7, 8], colors: [state.front[6], state.front[7], state.front[8]] },
          { face: 'right', indices: [6, 7, 8], colors: [state.right[6], state.right[7], state.right[8]] },
          { face: 'back', indices: [6, 7, 8], colors: [state.back[6], state.back[7], state.back[8]] },
          { face: 'left', indices: [6, 7, 8], colors: [state.left[6], state.left[7], state.left[8]] },
        ],
      }
    case 'F':
      return {
        face: state.front,
        strips: [
          { face: 'top', indices: [6, 7, 8], colors: [state.top[6], state.top[7], state.top[8]] },
          { face: 'right', indices: [0, 3, 6], colors: [state.right[0], state.right[3], state.right[6]] },
          { face: 'bottom', indices: [2, 1, 0], colors: [state.bottom[2], state.bottom[1], state.bottom[0]] },
          { face: 'left', indices: [8, 5, 2], colors: [state.left[8], state.left[5], state.left[2]] },
        ],
      }
    case 'B':
      return {
        face: state.back,
        strips: [
          { face: 'top', indices: [2, 1, 0], colors: [state.top[2], state.top[1], state.top[0]] },
          { face: 'left', indices: [0, 3, 6], colors: [state.left[0], state.left[3], state.left[6]] },
          { face: 'bottom', indices: [6, 7, 8], colors: [state.bottom[6], state.bottom[7], state.bottom[8]] },
          { face: 'right', indices: [8, 5, 2], colors: [state.right[8], state.right[5], state.right[2]] },
        ],
      }
  }
}
