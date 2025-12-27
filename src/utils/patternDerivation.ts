/**
 * Pattern derivation utilities
 *
 * Derives OLL/PLL patterns by applying the inverse algorithm to a solved cube.
 * This eliminates the need to store explicit pattern data for each case.
 */

import type { CubeState, Move } from '../types/cubeState'
import type {
  OLLOrientations, FaceColors, SideRowColors, LastLayerColors,
} from '../types/cube'
import {
  Color, Orientation, TOP_TO_SIDES,
} from '../types/cube'
import type { CaseId } from '../types/algorithm'
import { createSolvedCube, applyMoves } from './cubeState'
import { invertMoves, parseMoves } from './moveParser'
import { expandAlgorithmObject } from './algorithmExpander'
import { getAlgorithmsForCase } from '../data/cases'

/**
 * Get the y-rotation moves needed to put the selected color in front.
 *
 * Standard orientation: Blue=front, Red=right, Green=back, Orange=left
 * Returns the moves to rotate cube so selectedColor is in front.
 *
 * y rotation (clockwise from above): front→left, right→front, back→right, left→back
 * y' rotation (counter-clockwise): front→right, left→front, back→left, right→back
 */
export function getRotationForColor(selectedColor: Color): Move[] {
  switch (selectedColor) {
    case Color.BLUE:
      return [] // Already front
    case Color.RED:
      return parseMoves('y') // y brings right to front
    case Color.GREEN:
      return parseMoves('y2') // Back to front
    case Color.ORANGE:
      return parseMoves("y'") // y' brings left to front
    default:
      return []
  }
}

/**
 * Derive OLL orientations from a cube state.
 * Looks at the top face and determines orientation of each position.
 */
export function deriveOLLOrientations(cube: CubeState): OLLOrientations {
  const Y = Color.YELLOW
  const top = cube.top

  const orientations: Orientation[] = []

  for (let i = 0; i < 9; i++) {
    if (top[i] === Y) {
      // Yellow is on top - correctly oriented
      orientations.push(Orientation.TOP)
    } else {
      // Find which side face has the yellow sticker
      const orientation = findYellowOrientation(cube, i)
      orientations.push(orientation)
    }
  }

  return orientations as OLLOrientations
}

/**
 * Find which side face has the yellow sticker for a given top position.
 */
function findYellowOrientation(cube: CubeState, topIndex: number): Orientation {
  const Y = Color.YELLOW
  const sideMapping = TOP_TO_SIDES[topIndex]

  if (!sideMapping) {
    // Center position (4) - should always be TOP
    return Orientation.TOP
  }

  // Check each adjacent side for the yellow sticker
  if (sideMapping.back !== undefined && cube.back[sideMapping.back] === Y) {
    return Orientation.BACK
  }
  if (sideMapping.left !== undefined && cube.left[sideMapping.left] === Y) {
    return Orientation.LEFT
  }
  if (sideMapping.right !== undefined && cube.right[sideMapping.right] === Y) {
    return Orientation.RIGHT
  }
  if (sideMapping.front !== undefined && cube.front[sideMapping.front] === Y) {
    return Orientation.FRONT
  }

  // Fallback - shouldn't happen in valid cube states
  return Orientation.TOP
}

/**
 * Side colors - top row of each side face (for top-down last layer view).
 */
export interface SideColors {
  back: SideRowColors
  left: SideRowColors
  right: SideRowColors
  front: SideRowColors
}

/**
 * Derive side colors from a cube state.
 * Extracts the top row of each side face, adjusted for top-down visual perspective.
 * Back and right are reversed to match how they appear when viewed from above.
 */
export function deriveSideColors(cube: CubeState): SideColors {
  return {
    back: [cube.back[2], cube.back[1], cube.back[0]] as SideRowColors,
    left: [cube.left[0], cube.left[1], cube.left[2]] as SideRowColors,
    right: [cube.right[2], cube.right[1], cube.right[0]] as SideRowColors,
    front: [cube.front[0], cube.front[1], cube.front[2]] as SideRowColors,
  }
}

/**
 * Derive full last layer colors from a cube state.
 * Used for visual rendering of OLL/PLL cases.
 */
export function deriveLastLayerColors(cube: CubeState): LastLayerColors {
  return {
    top: cube.top as FaceColors,
    ...deriveSideColors(cube),
  }
}

/**
 * Derived pattern for a case.
 */
export interface DerivedPattern {
  cubeState: CubeState
  ollOrientations?: OLLOrientations
  sideColors?: SideColors
  lastLayerColors: LastLayerColors
}

/**
 * Derive the pattern for a case by applying the inverse algorithm.
 *
 * The pattern shows what the cube looks like BEFORE the algorithm is applied.
 * We get this by applying the inverse of the algorithm to a solved cube.
 *
 * @param caseId - The case ID (e.g., "pll-ua")
 * @param preRotation - Optional rotation moves to apply BEFORE the inverse algorithm.
 *                      This simulates viewing the pattern from a different angle.
 */
export function deriveCasePattern(
  caseId: CaseId,
  preRotation: Move[] = [],
): DerivedPattern | null {
  const algorithms = getAlgorithmsForCase(caseId)
  if (algorithms.length === 0) {
    return null
  }

  // Use the first (primary) algorithm
  const primaryAlgo = algorithms[0]
  const expanded = expandAlgorithmObject(primaryAlgo)

  // Apply inverse moves to solved cube to get the "problem" state
  // If preRotation is provided, apply it first (rotation + inverse_algo)
  const inverseMoves = invertMoves(expanded.moves)
  const allMoves = [...preRotation, ...inverseMoves]
  const solvedCube = createSolvedCube()
  const problemState = applyMoves(solvedCube, allMoves)

  const pattern: DerivedPattern = {
    cubeState: problemState,
    lastLayerColors: deriveLastLayerColors(problemState),
  }

  // Add type-specific pattern data
  if (caseId.startsWith('oll-')) {
    pattern.ollOrientations = deriveOLLOrientations(problemState)
  } else if (caseId.startsWith('pll-')) {
    pattern.sideColors = deriveSideColors(problemState)
  }

  return pattern
}

