import { Color, type FaceColors } from '../types/cube'
import type { CubeState } from '../types/cubeState'

// Gray face for default/unknown state
const grayFace: FaceColors = [
  Color.GRAY, Color.GRAY, Color.GRAY,
  Color.GRAY, Color.GRAY, Color.GRAY,
  Color.GRAY, Color.GRAY, Color.GRAY,
]

// Build a full CubeState from partial faces (missing faces become gray)
export interface PartialCubeFaces {
  top?: FaceColors
  bottom?: FaceColors
  front?: FaceColors
  back?: FaceColors
  left?: FaceColors
  right?: FaceColors
}

export function buildCubeState(faces: PartialCubeFaces): CubeState {
  return {
    top: faces.top ?? grayFace,
    bottom: faces.bottom ?? grayFace,
    front: faces.front ?? grayFace,
    back: faces.back ?? grayFace,
    left: faces.left ?? grayFace,
    right: faces.right ?? grayFace,
  }
}

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

