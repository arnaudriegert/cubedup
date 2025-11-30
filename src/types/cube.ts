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

// Sticker orientations for OLL
export enum Orientation {
  TOP = 'top',
  BACK = 'back',   // was NORTH
  LEFT = 'left',   // was WEST
  RIGHT = 'right', // was EAST
  FRONT = 'front', // was SOUTH
}

// Mapping of top face positions to their adjacent side positions
// Top face layout (indices):
// 0 1 2
// 3 4 5
// 6 7 8
//
// Side faces: Back[0,1,2], Left[0,1,2], Right[0,1,2], Front[0,1,2]
type SideMapping = {
  back?: number
  left?: number
  right?: number
  front?: number
}

export const TOP_TO_SIDES: Record<number, SideMapping> = {
  // Corners
  0: {
    back: 0,
    left: 0,
  },
  2: {
    back: 2,
    right: 0,
  },
  6: {
    front: 0,
    left: 2,
  },
  8: {
    front: 2,
    right: 2,
  },
  // Edges
  1: { back: 1 },
  3: { left: 1 },
  5: { right: 1 },
  7: { front: 1 },
  // Center (4) has no adjacent sides in our representation
}

// Type-safe orientation specification for each top face position
// Corners can be oriented in 3 directions: TOP or one of two adjacent sides
// Edges can be oriented in 2 directions: TOP or one adjacent side
// Center can only be oriented TOP

type CornerBL = Orientation.TOP | Orientation.BACK | Orientation.LEFT
type CornerBR = Orientation.TOP | Orientation.BACK | Orientation.RIGHT
type CornerFL = Orientation.TOP | Orientation.FRONT | Orientation.LEFT
type CornerFR = Orientation.TOP | Orientation.FRONT | Orientation.RIGHT
type EdgeB = Orientation.TOP | Orientation.BACK
type EdgeL = Orientation.TOP | Orientation.LEFT
type EdgeR = Orientation.TOP | Orientation.RIGHT
type EdgeF = Orientation.TOP | Orientation.FRONT
type Center = Orientation.TOP

// Type-safe tuple for OLL case orientations
// Layout:
// 0(BL)  1(B)  2(BR)
// 3(L)   4(C)  5(R)
// 6(FL)  7(F)  8(FR)
export type OLLOrientations = [
  CornerBL, // 0: top-left corner (back-left)
  EdgeB,    // 1: top edge (back)
  CornerBR, // 2: top-right corner (back-right)
  EdgeL,    // 3: left edge
  Center,   // 4: center (always TOP)
  EdgeR,    // 5: right edge
  CornerFL, // 6: bottom-left corner (front-left)
  EdgeF,    // 7: bottom edge (front)
  CornerFR, // 8: bottom-right corner (front-right)
]

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
