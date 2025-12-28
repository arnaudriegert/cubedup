// Rubik's cube colors
export enum Color {
  WHITE = 'white',
  YELLOW = 'yellow',
  RED = 'red',
  ORANGE = 'orange',
  BLUE = 'blue',
  GREEN = 'green',
  GRAY = 'gray', // Unspecified
}

// 9 stickers for any face of the cube (3x3 grid)
export type FaceColors = [
  Color, Color, Color, // row 1: top-left, top-middle, top-right
  Color, Color, Color, // row 2: middle-left, center, middle-right
  Color, Color, Color, // row 3: bottom-left, bottom-middle, bottom-right
]

export type SideRowColors = [
  Color, // left/top corner
  Color, // middle edge
  Color, // right/bottom corner
]

export interface LastLayerColors {
  top: FaceColors
  back: SideRowColors
  left: SideRowColors
  right: SideRowColors
  front: SideRowColors
}
