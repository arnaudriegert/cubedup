import { Color, FaceColors } from '../types/cube'

// Helper to create a face with specific stickers highlighted
export function makeFace(
  center: Color,
  positions: { [key: number]: Color },
): FaceColors {
  const face: FaceColors = [
    Color.GRAY,
    Color.GRAY,
    Color.GRAY,
    Color.GRAY,
    center,
    Color.GRAY,
    Color.GRAY,
    Color.GRAY,
    Color.GRAY,
  ]
  for (const [pos, color] of Object.entries(positions)) {
    face[parseInt(pos)] = color
  }
  return face
}

// Baseline stickers showing solved cross and adjacent F2L context
// Left slot: front face shows right side (5,7,8), left face shows left side (3,6,7)
// Right slot: front face shows left side (3,6,7), right face shows right side (5,7,8)
export type ColorSet = {
  front: Color
  left: Color
  right: Color
}

export function makeLeftFront(
  c: ColorSet,
  extra: { [key: number]: Color } = {},
): FaceColors {
  return makeFace(c.front, {
    5: c.front,
    7: c.front,
    8: c.front,
    ...extra,
  })
}

export function makeLeftSide(
  c: ColorSet,
  extra: { [key: number]: Color } = {},
): FaceColors {
  return makeFace(c.left, {
    3: c.left,
    6: c.left,
    7: c.left,
    ...extra,
  })
}

export function makeRightFront(
  c: ColorSet,
  extra: { [key: number]: Color } = {},
): FaceColors {
  return makeFace(c.front, {
    3: c.front,
    6: c.front,
    7: c.front,
    ...extra,
  })
}

export function makeRightSide(
  c: ColorSet,
  extra: { [key: number]: Color } = {},
): FaceColors {
  return makeFace(c.right, {
    5: c.right,
    7: c.right,
    8: c.right,
    ...extra,
  })
}
