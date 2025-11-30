import {
  Color,
  Orientation,
  OLLOrientations,
  LastLayerColors,
  FaceColors,
  SideRowColors,
  TOP_TO_SIDES,
} from '../types/cube'

/**
 * Converts OLL orientation data (9 orientations for top face)
 * into LastLayerColors structure
 */
export function ollToColors(orientations: OLLOrientations): LastLayerColors {
  // Initialize all colors as gray
  const topColors: Color[] = new Array(9).fill(Color.GRAY)
  const backColors: Color[] = new Array(3).fill(Color.GRAY)
  const leftColors: Color[] = new Array(3).fill(Color.GRAY)
  const rightColors: Color[] = new Array(3).fill(Color.GRAY)
  const frontColors: Color[] = new Array(3).fill(Color.GRAY)

  // Process each top face sticker
  orientations.forEach((orientation, topIndex) => {
    const adjacentSides = TOP_TO_SIDES[topIndex]

    if (orientation === Orientation.TOP) {
      // Sticker is oriented correctly (yellow on top)
      topColors[topIndex] = Color.YELLOW
      // Adjacent sides remain gray
    } else if (orientation === Orientation.BACK && adjacentSides?.back !== undefined) {
      topColors[topIndex] = Color.GRAY
      backColors[adjacentSides.back] = Color.YELLOW
    } else if (orientation === Orientation.LEFT && adjacentSides?.left !== undefined) {
      topColors[topIndex] = Color.GRAY
      leftColors[adjacentSides.left] = Color.YELLOW
    } else if (orientation === Orientation.RIGHT && adjacentSides?.right !== undefined) {
      topColors[topIndex] = Color.GRAY
      rightColors[adjacentSides.right] = Color.YELLOW
    } else if (orientation === Orientation.FRONT && adjacentSides?.front !== undefined) {
      topColors[topIndex] = Color.GRAY
      frontColors[adjacentSides.front] = Color.YELLOW
    }
  })

  // Return structured colors
  return {
    top: topColors as FaceColors,
    back: backColors as SideRowColors,
    left: leftColors as SideRowColors,
    right: rightColors as SideRowColors,
    front: frontColors as SideRowColors,
  }
}
