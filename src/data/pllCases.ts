import { Color } from '../types/cube'
import { Algorithm } from '../types/algorithm'

export type PLLSideColors = [Color, Color, Color]

// Positions on the last layer grid
// Corners: FL (front-left), FR (front-right), BL (back-left), BR (back-right)
// Edges: F (front), R (right), B (back), L (left)
export type CornerPosition = 'FL' | 'FR' | 'BL' | 'BR'
export type EdgePosition = 'F' | 'R' | 'B' | 'L'

// A cycle describes pieces that rotate through positions
// 2 positions = swap, 3 positions = 3-cycle
export interface Cycle {
  positions: (CornerPosition | EdgePosition)[]
  direction?: 'cw' | 'ccw'  // Visual hint for 3-cycles
}

export interface SwapInfo {
  corners?: Cycle[]
  edges?: Cycle[]
  description: string
}

export interface PLLCase {
  name: string
  sideColors: {
    back: PLLSideColors
    left: PLLSideColors
    right: PLLSideColors
    front: PLLSideColors
  }
  algorithms: Algorithm[]
  swaps: SwapInfo
}

// Can be either a related pair of cases or a single case
export type PLLEntry = [PLLCase, PLLCase] | [PLLCase]

export interface PLLCategory {
  name: string
  description: string
  cases: PLLEntry[]
}

const R = Color.RED
const O = Color.ORANGE
const B = Color.BLUE
const G = Color.GREEN

export const pllCategories: PLLCategory[] = [
  {
    name: 'Edges Only',
    description: 'Only edges need to be permuted - all corners are solved. Look for 4 headlights.',
    cases: [
      [
        {
          name: 'Ub',
          sideColors: {
            back: [G, R, G],
            left: [O, G, O],
            right: [R, O, R],
            front: [B, B, B],
          },
          algorithms: [{
            decomposition: [
              { moves: 'L²' },
              { moves: "U L U L' U' L' U' L' U L'" },
            ],
          }, {
            decomposition: [
              { moves: 'M²' },
              { moves: "U' M'" },
              { moves: 'U² M' },
              { moves: "U' M²" },
            ],
          }],
          swaps: {
            edges: [{
              positions: ['B', 'R', 'L'],
              direction: 'ccw',
            }],
            description: '3-cycle edges: B→R→L',
          },
        },
        {
          name: 'Ua',
          sideColors: {
            back: [G, O, G],
            left: [O, R, O],
            right: [R, G, R],
            front: [B, B, B],
          },
          algorithms: [{
            decomposition: [
              { moves: 'R²' },
              { moves: "U' R' U' R U R U R U' R" },
            ],
          }, {
            decomposition: [
              { moves: 'M²' },
              { moves: "U M'" },
              { moves: 'U² M' },
              { moves: 'U M²' },
            ],
          }],
          swaps: {
            edges: [{
              positions: ['L', 'R', 'B'],
              direction: 'cw',
            }],
            description: '3-cycle edges: L→R→B',
          },
        },
      ],
      [
        {
          name: 'H',
          sideColors: {
            back: [G, B, G],
            left: [O, R, O],
            right: [R, O, R],
            front: [B, G, B],
          },
          algorithms: [{
            decomposition: [
              { moves: 'M²' },
              { moves: "U' M²" },
              { moves: 'U² M²' },
              { moves: "U' M²" },
            ],
          }],
          swaps: {
            edges: [
              { positions: ['F', 'B'] },
              { positions: ['L', 'R'] },
            ],
            description: 'Swap opposite edges: F↔B and L↔R',
          },
        },
      ],
      [
        {
          name: 'Z',
          sideColors: {
            back: [G, O, G],
            left: [O, G, O],
            right: [R, B, R],
            front: [B, R, B],
          },
          algorithms: [{
            decomposition: [
              { moves: "M' U'" },
              { moves: "M² U' M²" },
              { moves: "U' M'" },
              { moves: 'U² M²' },
            ],
          }],
          swaps: {
            edges: [
              { positions: ['F', 'R'] },
              { positions: ['B', 'L'] },
            ],
            description: 'Swap adjacent edges: F↔R and B↔L',
          },
        },
      ],
    ],
  },
  {
    name: 'Corners Only',
    description: 'Only corners need to be permuted - all edges are solved.',
    cases: [
      [
        {
          name: 'Aa',
          sideColors: {
            back: [R, G, B],
            left: [G, O, G],
            right: [O, R, R],
            front: [O, B, B],
          },
          algorithms: [{
            decomposition: [
              { moves: 'L² B²' },
              { moves: "L' F' L" },
              { moves: "B² L' F L'" },
            ],
          }],
          swaps: {
            corners: [{
              positions: ['BR', 'FL', 'BL'],
              direction: 'cw',
            }],
            description: '3-cycle corners: BR→FL→BL',
          },
        },
        {
          name: 'Ab',
          sideColors: {
            back: [B, G, O],
            left: [R, O, O],
            right: [G, R, G],
            front: [B, B, R],
          },
          algorithms: [{
            decomposition: [
              { moves: 'R² B²' },
              { moves: "R F R'" },
              { moves: "B² R F' R" },
            ],
          }],
          swaps: {
            corners: [{
              positions: ['BL', 'FR', 'BR'],
              direction: 'ccw',
            }],
            description: '3-cycle corners: BL→FR→BR',
          },
        },
      ],
      [
        {
          name: 'E',
          sideColors: {
            back: [O, G, R],
            left: [B, O, G],
            right: [B, R, G],
            front: [O, B, R],
          },
          algorithms: [{
            decomposition: [
              { moves: "r' U r F' r' U' r F" },
              { moves: "r' U' r F' r' U r F" },
            ],
          }],
          swaps: {
            corners: [
              { positions: ['BL', 'FL'] },
              { positions: ['BR', 'FR'] },
            ],
            description: 'Swap left corners and right corners',
          },
        },
      ],
    ],
  },
  {
    name: 'Swap Adjacent Corners',
    description: 'Cases that swap two adjacent corners plus edges. Look for headlights to identify.',
    cases: [
      [
        {
          name: 'T',
          sideColors: {
            back: [G, G, R],
            left: [O, R, O],
            right: [B, O, G],
            front: [B, B, R],
          },
          algorithms: [{
            decomposition: [
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: 'F' },
              { moves: "R U' R' U' R U R'" },
              { moves: "F'" },
            ],
            simplifiedResult: "(R U R' U') (R' F ~R F') F (R~ **R²** U' R' U' R U R') F'",
          }],
          swaps: {
            corners: [{ positions: ['BR', 'FR'] }],
            edges: [{ positions: ['L', 'R'] }],
            description: 'Swap right corners, swap edges L↔R',
          },
        },
      ],
      [
        {
          name: 'F',
          sideColors: {
            back: [O, R, G],
            left: [B, B, B],
            right: [R, G, O],
            front: [R, O, G],
          },
          algorithms: [{
            decomposition: [
              { moves: "R'" },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: "R'" },
              { moves: "U' F' U F" },
              { moves: 'R' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: 'R' },
            ],
          }],
          swaps: {
            corners: [{ positions: ['FR', 'BR'] }],
            edges: [{ positions: ['F', 'B'] }],
            description: 'Swap right corners, swap edges F↔B',
          },
        },
      ],
      [
        {
          name: 'Ja/L',
          sideColors: {
            back: [G, R, R],
            left: [O, O, R],
            right: [B, B, B],
            front: [G, G, O],
          },
          algorithms: [{
            decomposition: [
              { moves: "L' U' L F" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: "L F' L'" },
              { moves: "L' U L" },
            ],
          }],
          swaps: {
            corners: [{ positions: ['FL', 'BL'] }],
            edges: [{ positions: ['F', 'L'] }],
            description: 'Swap left corners, swap edges F↔L',
          },
        },
        {
          name: 'Jb',
          sideColors: {
            back: [O, O, G],
            left: [B, B, B],
            right: [R, R, O],
            front: [R, G, G],
          },
          algorithms: [{
            decomposition: [
              { moves: "R U R' F'" },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F R" },
              { moves: "R U' R'" },
            ],
          }],
          swaps: {
            corners: [{ positions: ['BR', 'FR'] }],
            edges: [{ positions: ['F', 'R'] }],
            description: 'Swap right corners, swap edges F↔R',
          },
        },
      ],
      [
        {
          name: 'Ra',
          sideColors: {
            back: [R, G, O],
            left: [G, B, O],
            right: [G, R, R],
            front: [B, O, B],
          },
          algorithms: [{
            decomposition: [
              { moves: "L U² L' U²" },
              { moves: "L F'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: 'L F L²' },
            ],
          }],
          swaps: {
            corners: [{ positions: ['BL', 'BR'] }],
            edges: [{ positions: ['L', 'F'] }],
            description: 'Swap back corners, swap edges L↔F',
          },
        },
        {
          name: 'Rb',
          sideColors: {
            back: [R, G, O],
            left: [G, O, O],
            right: [G, B, R],
            front: [B, R, B],
          },
          algorithms: [{
            decomposition: [
              { moves: "R' U² R U²" },
              { moves: "R' F" },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F' R²" },
            ],
          }],
          swaps: {
            corners: [{ positions: ['BL', 'BR'] }],
            edges: [{ positions: ['R', 'F'] }],
            description: 'Swap back corners, swap edges R↔F',
          },
        },
      ],
    ],
  },
  {
    name: 'Swap Diagonal Corners',
    description: 'Cases that swap two diagonal corners. Usually no headlights visible.',
    cases: [
      [
        {
          name: 'Y',
          sideColors: {
            back: [B, O, G],
            left: [R, G, O],
            right: [R, R, O],
            front: [B, B, G],
          },
          algorithms: [{
            decomposition: [
              { moves: 'F' },
              { moves: "R U' R' U' R U R' " },
              { moves: "F'" },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F R F'", trigger: '{sledge}' },
            ],
          }],
          swaps: {
            corners: [{ positions: ['BL', 'FR'] }],
            edges: [{ positions: ['L', 'B'] }],
            description: 'Swap diagonal corners BL↔FR, swap edges L↔B',
          },
        },
      ],
      [
        {
          name: 'V',
          sideColors: {
            back: [B, R, G],
            left: [R, O, O],
            right: [R, G, O],
            front: [B, B, G],
          },
          algorithms: [{
            decomposition: [
              { moves: "R' U R'" },
              { moves: "U' y R' F'" },
              { moves: "R² U' R' U R'" },
              { moves: 'F R F' },
            ],
          }, {
            decomposition: [
              { moves: "R' U R'" },
              { moves: "d' R' F'" },
              { moves: "R² U' R' U R'" },
              { moves: 'F R F' },
            ],
          }],
          swaps: {
            corners: [{ positions: ['BL', 'FR'] }],
            edges: [{ positions: ['R', 'B'] }],
            description: 'Swap diagonal corners BL↔FR, swap edges R↔B',
          },
        },
      ],
      [
        {
          name: 'Na',
          sideColors: {
            back: [G, G, B],
            left: [O, R, R],
            right: [O, O, R],
            front: [G, B, B],
          },
          algorithms: [{
            decomposition: [
              { moves: "L U'" },
              { moves: "L F' L' F", trigger: '{left-sledge}' },
              { moves: "L' U L" },
              { moves: "F U' F'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: "L'" },
            ],
          }],
          swaps: {
            corners: [{ positions: ['FL', 'BR'] }],
            edges: [{ positions: ['L', 'R'] }],
            description: 'Swap diagonal corners FL↔BR, swap edges L↔R',
          },
        },
        {
          name: 'Nb',
          sideColors: {
            back: [B, G, G],
            left: [R, R, O],
            right: [R, O, O],
            front: [B, B, G],
          },
          algorithms: [{
            decomposition: [
              { moves: "R' U" },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: "R U' R'" },
              { moves: "F' U F" },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: 'R' },
            ],
          }],
          swaps: {
            corners: [{ positions: ['BL', 'FR'] }],
            edges: [{ positions: ['L', 'R'] }],
            description: 'Swap diagonal corners BL↔FR, swap edges L↔R',
          },
        },
      ],
    ],
  },
  {
    name: 'G Permutations',
    description: 'Complex cases: 3-cycle of corners + 3-cycle of edges. Look for one headlight.',
    cases: [
      [
        {
          name: 'Ga',
          sideColors: {
            back: [R, O, B],
            left: [G, R, G],
            right: [O, G, R],
            front: [O, B, B],
          },
          algorithms: [{
            decomposition: [
              { moves: 'L² F²' },
              { moves: "L' U² L' U² L F'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: "L F' L²" },
            ],
          }],
          swaps: {
            corners: [{
              positions: ['FL', 'BL', 'BR'],
              direction: 'cw',
            }],
            edges: [{
              positions: ['L', 'R', 'B'],
              direction: 'cw',
            }],
            description: '3-cycle corners FL→BL→BR, 3-cycle edges L→R→B',
          },
        },
        {
          name: 'Gc',
          sideColors: {
            back: [B, R, O],
            left: [R, G, O],
            right: [G, O, G],
            front: [B, B, R],
          },
          algorithms: [{
            decomposition: [
              { moves: 'R² F²' },
              { moves: "R U² R U² R' F" },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F R²" },
            ],
          }],
          swaps: {
            corners: [{
              positions: ['FR', 'BR', 'BL'],
              direction: 'cw',
            }],
            edges: [{
              positions: ['L', 'B', 'R'],
              direction: 'cw',
            }],
            description: '3-cycle corners FR→BR→BL, 3-cycle edges L→B→R',
          },
        },
      ],
      [
        {
          name: 'Gb',
          sideColors: {
            back: [O, R, O],
            left: [B, G, R],
            right: [G, O, R],
            front: [G, B, B],
          },
          algorithms: [{
            decomposition: [
              { moves: "L² F L'" },
              { moves: "U' L' U L", trigger: "{left-sexy}'" },
              { moves: "F L' U² L U² L" },
              { moves: 'F² L²' },
            ],
          }],
          swaps: {
            corners: [{
              positions: ['FL', 'BR', 'BL'],
              direction: 'ccw',
            }],
            edges: [{
              positions: ['L', 'B', 'R'],
              direction: 'ccw',
            }],
            description: '3-cycle corners FL→BR→BL, 3-cycle edges L→B→R',
          },
        },
        {
          name: 'Gd',
          sideColors: {
            back: [R, O, R],
            left: [G, R, O],
            right: [B, G, O],
            front: [B, B, G],
          },
          algorithms: [{
            decomposition: [
              { moves: "R² F' R" },
              { moves: "U R U' R'", trigger: "{sexy}'" },
              { moves: "F' R U² R' U² R'" },
              { moves: 'F² R²' },
            ],
          }],
          swaps: {
            corners: [{
              positions: ['FR', 'BL', 'BR'],
              direction: 'ccw',
            }],
            edges: [{
              positions: ['L', 'R', 'B'],
              direction: 'ccw',
            }],
            description: '3-cycle corners FR→BL→BR, 3-cycle edges L→R→B',
          },
        },
      ],
    ],
  },
]
