import {
  Move, FaceMove, WideMove, SliceMove, CubeRotation, MoveModifier,
} from '../types/cubeState'

const FACE_MOVES = new Set<string>(['R', 'L', 'U', 'D', 'F', 'B'])
const WIDE_MOVES = new Set<string>(['r', 'l', 'u', 'd', 'f', 'b'])
const SLICE_MOVES = new Set<string>(['M', 'S', 'E'])
const CUBE_ROTATIONS = new Set<string>(['x', 'y', 'z'])
// Regex matches face moves (uppercase), wide moves (lowercase r,l,u,d,f,b),
// slice moves (M, S, E), and cube rotations (x, y, z)
// Supports both regular '2' and superscript '²' (U+00B2) for double moves
const MOVE_REGEX = /([RLUDFBrludfbMSExyz])(['2²])?/g

/**
 * Parse a notation string into an array of moves
 * Examples:
 *   "R U R' U'" -> [{base:'R',modifier:''}, {base:'U',modifier:''}, {base:'R',modifier:"'"}, {base:'U',modifier:"'"}]
 *   "R2 U2" -> [{base:'R',modifier:'2'}, {base:'U',modifier:'2'}]
 *   "x y z'" -> [{base:'x',modifier:''}, {base:'y',modifier:''}, {base:'z',modifier:"'"}]
 */
export function parseMoves(notation: string): Move[] {
  const moves: Move[] = []
  let match: RegExpExecArray | null

  // Reset regex state
  MOVE_REGEX.lastIndex = 0

  while ((match = MOVE_REGEX.exec(notation)) !== null) {
    const base = match[1]
    // Normalize superscript ² to regular 2
    const rawModifier = match[2] || ''
    const modifier = (rawModifier === '²' ? '2' : rawModifier) as MoveModifier

    if (FACE_MOVES.has(base)) {
      moves.push({
        base: base as FaceMove,
        modifier,
      })
    } else if (WIDE_MOVES.has(base)) {
      moves.push({
        base: base as WideMove,
        modifier,
      })
    } else if (SLICE_MOVES.has(base)) {
      moves.push({
        base: base as SliceMove,
        modifier,
      })
    } else if (CUBE_ROTATIONS.has(base)) {
      moves.push({
        base: base as CubeRotation,
        modifier,
      })
    }
  }

  return moves
}

/**
 * Convert a Move back to notation string
 */
export function moveToNotation(move: Move): string {
  return `${move.base}${move.modifier}`
}

/**
 * Convert an array of moves to notation string
 */
export function movesToNotation(moves: Move[]): string {
  return moves.map(moveToNotation).join(' ')
}

/**
 * Invert a single move (R -> R', R' -> R, R2 -> R2)
 */
export function invertMove(move: Move): Move {
  let newModifier: MoveModifier
  switch (move.modifier) {
    case '':
      newModifier = "'"
      break
    case "'":
      newModifier = ''
      break
    case '2':
      newModifier = '2' // Double moves are self-inverse
      break
    default:
      newModifier = move.modifier
  }
  return { base: move.base, modifier: newModifier }
}

/**
 * Invert an array of moves (reverse order and invert each move)
 */
export function invertMoves(moves: Move[]): Move[] {
  return moves.map(invertMove).reverse()
}

/**
 * Clean an algorithm string by removing parentheses, brackets, and extra formatting
 * Returns just the raw moves
 */
export function cleanAlgorithmString(notation: string): string {
  // Remove parentheses, brackets, triggers like {sexy}, and special chars like ~ * **
  return notation
    .replace(/[()[\]{}~*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Invert an algorithm notation string
 * Returns the inverse algorithm as a string
 */
export function invertAlgorithmString(notation: string): string {
  const cleaned = cleanAlgorithmString(notation)
  const moves = parseMoves(cleaned)
  const inverted = invertMoves(moves)
  return movesToNotation(inverted)
}
