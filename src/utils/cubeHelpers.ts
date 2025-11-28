import { Color, type TopFaceColors } from '../types/cube'

// Solid color face helpers
export function solidFace(color: Color): TopFaceColors {
  return [color, color, color, color, color, color, color, color, color]
}

// F2L completed face (first two layers done, top row gray for last layer)
export function f2lFace(color: Color, topRowColor: Color = Color.GRAY): TopFaceColors {
  return [
    topRowColor, topRowColor, topRowColor,
    color, color, color,
    color, color, color,
  ]
}

