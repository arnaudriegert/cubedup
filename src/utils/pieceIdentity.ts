import { Color } from '../types/cube'
import type { CubeState } from '../types/cubeState'

// CFOP step for masking
export type CFOPStep = 'cross' | 'f2l' | 'oll' | 'pll' | null

// A sticker position on the cube
interface StickerPosition {
  face: keyof CubeState
  index: number
}

// All 26 pieces defined by their sticker positions
// Each piece has 1 (center), 2 (edge), or 3 (corner) stickers
const PIECE_DEFINITIONS: StickerPosition[][] = [
  // Centers (6)
  [{ face: 'top', index: 4 }],
  [{ face: 'bottom', index: 4 }],
  [{ face: 'front', index: 4 }],
  [{ face: 'back', index: 4 }],
  [{ face: 'left', index: 4 }],
  [{ face: 'right', index: 4 }],

  // Edges (12)
  [{ face: 'top', index: 1 }, { face: 'back', index: 1 }],
  [{ face: 'top', index: 3 }, { face: 'left', index: 1 }],
  [{ face: 'top', index: 5 }, { face: 'right', index: 1 }],
  [{ face: 'top', index: 7 }, { face: 'front', index: 1 }],
  [{ face: 'bottom', index: 1 }, { face: 'front', index: 7 }],
  [{ face: 'bottom', index: 3 }, { face: 'left', index: 7 }],
  [{ face: 'bottom', index: 5 }, { face: 'right', index: 7 }],
  [{ face: 'bottom', index: 7 }, { face: 'back', index: 7 }],
  [{ face: 'front', index: 3 }, { face: 'left', index: 5 }],
  [{ face: 'front', index: 5 }, { face: 'right', index: 3 }],
  [{ face: 'back', index: 3 }, { face: 'right', index: 5 }],
  [{ face: 'back', index: 5 }, { face: 'left', index: 3 }],

  // Corners (8)
  [{ face: 'top', index: 0 }, { face: 'back', index: 2 }, { face: 'left', index: 0 }],
  [{ face: 'top', index: 2 }, { face: 'back', index: 0 }, { face: 'right', index: 2 }],
  [{ face: 'top', index: 6 }, { face: 'front', index: 0 }, { face: 'left', index: 2 }],
  [{ face: 'top', index: 8 }, { face: 'front', index: 2 }, { face: 'right', index: 0 }],
  [{ face: 'bottom', index: 0 }, { face: 'front', index: 6 }, { face: 'left', index: 8 }],
  [{ face: 'bottom', index: 2 }, { face: 'front', index: 8 }, { face: 'right', index: 6 }],
  [{ face: 'bottom', index: 6 }, { face: 'back', index: 8 }, { face: 'left', index: 6 }],
  [{ face: 'bottom', index: 8 }, { face: 'back', index: 6 }, { face: 'right', index: 8 }],
]

// Build a lookup map: "face:index" -> piece definition
const POSITION_TO_PIECE = new Map<string, StickerPosition[]>()
for (const piece of PIECE_DEFINITIONS) {
  for (const pos of piece) {
    POSITION_TO_PIECE.set(`${pos.face}:${pos.index}`, piece)
  }
}

// Get colors of a piece from the current cube state
function getPieceColors(state: CubeState, piece: StickerPosition[]): Color[] {
  return piece.map(pos => state[pos.face][pos.index])
}

// Create a stable key for piece identity (sorted colors)
function pieceIdentityKey(colors: Color[]): string {
  return colors.slice().sort().join('-')
}

// Get piece identity for any position on the cube
function getPieceIdentity(state: CubeState, face: keyof CubeState, index: number): Color[] {
  const piece = POSITION_TO_PIECE.get(`${face}:${index}`)
  if (!piece) return []
  return getPieceColors(state, piece)
}

// Define which pieces are relevant for each CFOP step
// Using piece identity keys (sorted color combinations)

// Cross: white center + 4 side centers + 4 white edges
const CROSS_PIECES = new Set([
  pieceIdentityKey([Color.WHITE]),
  pieceIdentityKey([Color.BLUE]),
  pieceIdentityKey([Color.GREEN]),
  pieceIdentityKey([Color.RED]),
  pieceIdentityKey([Color.ORANGE]),
  pieceIdentityKey([Color.WHITE, Color.BLUE]),
  pieceIdentityKey([Color.WHITE, Color.GREEN]),
  pieceIdentityKey([Color.WHITE, Color.RED]),
  pieceIdentityKey([Color.WHITE, Color.ORANGE]),
])

// F2L: Cross + 4 white corners + 4 middle edges
const F2L_PIECES = new Set([
  ...CROSS_PIECES,
  // 4 white corners
  pieceIdentityKey([Color.WHITE, Color.BLUE, Color.RED]),
  pieceIdentityKey([Color.WHITE, Color.BLUE, Color.ORANGE]),
  pieceIdentityKey([Color.WHITE, Color.GREEN, Color.RED]),
  pieceIdentityKey([Color.WHITE, Color.GREEN, Color.ORANGE]),
  // 4 middle edges (no white, no yellow)
  pieceIdentityKey([Color.BLUE, Color.RED]),
  pieceIdentityKey([Color.BLUE, Color.ORANGE]),
  pieceIdentityKey([Color.GREEN, Color.RED]),
  pieceIdentityKey([Color.GREEN, Color.ORANGE]),
])

// OLL/PLL: yellow center + 4 yellow edges + 4 yellow corners
const LAST_LAYER_PIECES = new Set([
  pieceIdentityKey([Color.YELLOW]),
  pieceIdentityKey([Color.YELLOW, Color.BLUE]),
  pieceIdentityKey([Color.YELLOW, Color.GREEN]),
  pieceIdentityKey([Color.YELLOW, Color.RED]),
  pieceIdentityKey([Color.YELLOW, Color.ORANGE]),
  pieceIdentityKey([Color.YELLOW, Color.BLUE, Color.RED]),
  pieceIdentityKey([Color.YELLOW, Color.BLUE, Color.ORANGE]),
  pieceIdentityKey([Color.YELLOW, Color.GREEN, Color.RED]),
  pieceIdentityKey([Color.YELLOW, Color.GREEN, Color.ORANGE]),
])

const STEP_PIECE_SETS: Record<Exclude<CFOPStep, null>, Set<string>> = {
  cross: CROSS_PIECES,
  f2l: F2L_PIECES,
  oll: LAST_LAYER_PIECES,
  pll: LAST_LAYER_PIECES,
}

// Check if a sticker should be visible for the given CFOP step
function shouldShowSticker(
  state: CubeState,
  face: keyof CubeState,
  index: number,
  step: CFOPStep,
): boolean {
  if (step === null) return true

  // OLL: show only yellow stickers
  if (step === 'oll') {
    return state[face][index] === Color.YELLOW
  }

  // PLL: show all stickers of yellow pieces (yellow + their neighbors)
  if (step === 'pll') {
    const pieceColors = getPieceIdentity(state, face, index)
    return pieceColors.includes(Color.YELLOW)
  }

  // Cross/F2L: show all stickers of relevant pieces
  const pieceColors = getPieceIdentity(state, face, index)
  const key = pieceIdentityKey(pieceColors)
  return STEP_PIECE_SETS[step].has(key)
}

// Apply mask to a CubeState - returns new state with GRAY for hidden stickers
export function applyMask(state: CubeState, step: CFOPStep): CubeState {
  if (step === null) return state

  const faces: (keyof CubeState)[] = ['top', 'bottom', 'front', 'back', 'left', 'right']
  const masked = {} as CubeState

  for (const face of faces) {
    const faceColors = [...state[face]] as typeof state[typeof face]
    for (let i = 0; i < 9; i++) {
      if (!shouldShowSticker(state, face, i, step)) {
        faceColors[i] = Color.GRAY
      }
    }
    masked[face] = faceColors
  }

  return masked
}
