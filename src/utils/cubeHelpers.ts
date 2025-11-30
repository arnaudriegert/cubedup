import { Color, type FaceColors } from '../types/cube'

// Solid color face helpers
export function solidFace(color: Color): FaceColors {
  return [color, color, color, color, color, color, color, color, color]
}

// Cross pattern on a face (center + edges, corners gray)
export function crossFace(centerColor: Color, edgeColor: Color, cornerColor: Color = Color.GRAY): FaceColors {
  return [
    cornerColor, edgeColor, cornerColor,
    edgeColor, centerColor, edgeColor,
    cornerColor, edgeColor, cornerColor,
  ]
}

// F2L completed face (first two layers done, top row gray for last layer)
export function f2lFace(color: Color, topRowColor: Color = Color.GRAY): FaceColors {
  return [
    topRowColor, topRowColor, topRowColor,
    color, color, color,
    color, color, color,
  ]
}

