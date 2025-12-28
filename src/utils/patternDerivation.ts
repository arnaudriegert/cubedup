/**
 * Pattern derivation utilities
 *
 * Derives OLL/PLL patterns by applying the inverse algorithm to a solved cube.
 * This eliminates the need to store explicit pattern data for each case.
 */

import type { CubeState, Move } from '../types/cubeState'
import type {
  FaceColors, SideRowColors, LastLayerColors,
} from '../types/cube'
import type { CaseId } from '../types/algorithm'
import { createSolvedCube, applyMoves } from './cubeState'
import { invertMoves } from './moveParser'
import { expandAlgorithmObject } from './algorithmExpander'
import { getAlgorithmsForCase } from '../data/cases'

/**
 * Derive full last layer colors from a cube state.
 * Extracts top face and top row (indices 0,1,2) of each side face.
 * Visual orientation is handled by CSS in SideRow component.
 */
export function deriveLastLayerColors(cube: CubeState): LastLayerColors {
  return {
    top: cube.top as FaceColors,
    back: cube.back.slice(0, 3) as SideRowColors,
    left: cube.left.slice(0, 3) as SideRowColors,
    right: cube.right.slice(0, 3) as SideRowColors,
    front: cube.front.slice(0, 3) as SideRowColors,
  }
}

/**
 * Derived pattern for a case.
 */
export interface DerivedPattern {
  cubeState: CubeState
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

  return {
    cubeState: problemState,
    lastLayerColors: deriveLastLayerColors(problemState),
  }
}

