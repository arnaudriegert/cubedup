import { Color } from '../types/cube'
import { Algorithm } from './ollCases'

export type PLLSideColors = [Color, Color, Color]

export interface PLLCase {
  name: string
  sideColors: {
    back: PLLSideColors
    left: PLLSideColors
    right: PLLSideColors
    front: PLLSideColors
  }
  algorithms: Algorithm[]
}

// Can be either a related pair of cases or a single case
export type PLLEntry = [PLLCase, PLLCase] | [PLLCase]

export interface PLLCategory {
  name: string
  description: string
  cases: PLLEntry[]
}

// Standard color scheme for PLL visualization:
// When looking at the cube with yellow on top:
// - Front: RED face
// - Right: BLUE face
// - Back: ORANGE face
// - Left: GREEN face
//
// Each side shows 3 stickers: [left-corner, edge, right-corner]
// "Headlights" = matching corner colors on a face

const R = Color.RED
const O = Color.ORANGE
const B = Color.BLUE
const G = Color.GREEN

export const pllCategories: PLLCategory[] = [
  {
    name: 'Edges Only',
    description: 'Only edges need to be permuted - all corners are solved. Look for 4 headlights.',
    cases: [
      // Ua and Ub - 3-cycle of edges, front bar stays solved
      // Ua: left headlights match right's center → L-based algo
      // Ub: right headlights match left's center → R-based algo
      [
        {
          name: 'Ua',
          sideColors: {
            back: [O, B, O],   // Headlights, has Right's edge (blue)
            left: [G, O, G],   // Headlights, has Back's edge (orange)
            right: [B, G, B],  // Headlights, has Left's edge (green)
            front: [R, R, R],  // Solved bar
          },
          algorithms: [{
            full: "L² (U L) (U L') (U' L') (U' L') (U L')",
          }, {
            full: "M² U' M' U² M U' M²",
          }],
        },
        {
          name: 'Ub',
          sideColors: {
            back: [O, G, O],   // Headlights, has Left's edge (green)
            left: [G, B, G],   // Headlights, has Right's edge (blue)
            right: [B, O, B],  // Headlights, has Back's edge (orange)
            front: [R, R, R],  // Solved bar
          },
          algorithms: [{
            full: "R² (U' R') (U' R) (U R) (U R) (U' R)",
          }, {
            full: "M² U M' U² M U M²",
          }],
        },
      ],
      // H - swap opposite edge pairs (F↔B and L↔R)
      [
        {
          name: 'H',
          sideColors: {
            back: [O, R, O],   // Headlights, has Front's edge
            left: [G, B, G],   // Headlights, has Right's edge
            right: [B, G, B],  // Headlights, has Left's edge
            front: [R, O, R],  // Headlights, has Back's edge
          },
          algorithms: [{
            full: "M² U' M² U² M² U' M²",
          }],
        },
      ],
      // Z - swap adjacent edge pairs (F↔R and B↔L)
      [
        {
          name: 'Z',
          sideColors: {
            back: [O, G, O],   // Headlights, has Left's edge
            left: [G, O, G],   // Headlights, has Back's edge
            right: [B, R, B],  // Headlights, has Front's edge
            front: [R, B, R],  // Headlights, has Right's edge
          },
          algorithms: [{
            full: "M' U' M² U' M² U' M' U² M²",
          }],
        },
      ],
    ],
  },
  {
    name: 'Corners Only',
    description: 'Only corners need to be permuted - all edges are solved.',
    cases: [
      // Aa and Ab - 3-cycle of corners
      // Looking at the cube from top: corners are at BL, BR, FR, FL
      // Aa: cycles BL→BR→FR (counterclockwise), FL stays
      // Ab: cycles BL→FL→FR (clockwise), BR stays
      [
        {
          name: 'Aa',
          sideColors: {
            // BL corner goes to BR position, BR goes to FR, FR goes to BL
            back: [G, O, B],   // Left corner from Left face, right corner from Right face
            left: [R, G, G],   // Left corner from Front face, right corner correct
            right: [O, B, O],  // Left corner from Back face, right corner from Back face
            front: [R, R, G],  // Left corner correct, right corner from Left face
          },
          algorithms: [{
            full: "x R' U R' D² R U' R' D² R² x'",
          }, {
            full: "R' F R' B² R F' R' B² R²",
          }],
        },
        {
          name: 'Ab',
          sideColors: {
            // BL corner goes to FL, FL goes to FR, FR goes to BL
            back: [B, O, O],   // Left corner from Right face, right corner correct
            left: [G, G, R],   // Left corner correct, right corner from Front face
            right: [G, B, B],  // Left corner from Left face, right corner correct
            front: [O, R, R],  // Left corner from Back face, right corner correct
          },
          algorithms: [{
            full: "x R² D² R U R' D² R U' R x'",
          }, {
            full: "R² B² R F R' B² R F' R",
          }],
        },
      ],
      // E perm - swap both diagonal corner pairs
      // Swaps BL↔FR and BR↔FL
      [
        {
          name: 'E',
          sideColors: {
            // Each side has opposite corners swapped
            back: [B, O, G],   // Left from Right, right from Left
            left: [O, G, R],   // Left from Back, right from Front
            right: [R, B, O],  // Left from Front, right from Back
            front: [G, R, B],  // Left from Left, right from Right
          },
          algorithms: [{
            full: "x' R U' R' D R U R' D' R U R' D R U' R' D' x",
          }],
        },
      ],
    ],
  },
  {
    name: 'Swap Adjacent Corners',
    description: 'Cases that swap two adjacent corners plus edges. Look for headlights to identify.',
    cases: [
      // T perm: swaps UBL↔UBR corners, swaps UF↔UB edges
      // Recognition: 2 opposite headlights (Front and Right), checker on Back/Left
      [
        {
          name: 'T',
          sideColors: {
            back: [G, R, B],   // Corners swapped, edge from front
            left: [O, G, O],   // Headlights, edge from back
            right: [B, B, B],  // Solved
            front: [R, O, R],  // Headlights, edge from back
          },
          algorithms: [{
            full: "R U R' U' R' F R² U' R' U' R U R' F'",
            shorthand: "{sexy} R' F R² U' R' U' R U R' F'",
          }],
        },
      ],
      // F perm: swaps UFR↔UBR corners, swaps UF↔UL edges
      // Recognition: similar to T but different edge/corner configuration
      [
        {
          name: 'F',
          sideColors: {
            back: [O, O, R],   // Right corner from front
            left: [G, R, G],   // Headlights, edge from front
            right: [O, B, B],  // Left corner from back
            front: [R, G, R],  // Headlights, edge from left
          },
          algorithms: [{
            full: "R' U' F' R U R' U' R' F R² U' R' U' R U R' U R",
          }, {
            full: "R' U R U' R² F' U' F U R F R' F' R² U'",
          }],
        },
      ],
      // Ja and Jb: swap adjacent corners + 3-cycle edges
      // Recognition: one solved bar (3 same colors), rest mixed
      [
        {
          name: 'Ja',
          sideColors: {
            back: [O, O, O],   // Solved bar
            left: [B, G, G],   // Right sticker correct
            right: [B, B, R],  // Left sticker correct, edge from front
            front: [G, R, R],  // Right sticker correct, edge from left
          },
          algorithms: [{
            full: "x R² F R F' R U² r' U r U² x'",
          }, {
            full: "R' U L' U² R U' R' U² R L U'",
          }],
        },
        {
          name: 'Jb',
          sideColors: {
            back: [O, O, O],   // Solved bar
            left: [G, G, B],   // Left sticker correct
            right: [R, B, B],  // Right sticker correct, edge from front
            front: [R, R, G],  // Left sticker correct, edge from right
          },
          algorithms: [{
            full: "R U R' F' R U R' U' R' F R² U' R' U'",
            shorthand: "R U R' F' {sexy} R' F R² U' R' U'",
          }],
        },
      ],
      // Ra and Rb: swap adjacent corners + swap 2 edges (opposite)
      // Recognition: 2 opposite headlights with wrong edges between
      [
        {
          name: 'Ra',
          sideColors: {
            back: [O, R, O],   // Headlights, edge from front
            left: [G, G, B],   // Left correct, right from right
            right: [G, B, B],  // Left from left, right correct
            front: [R, O, R],  // Headlights, edge from back
          },
          algorithms: [{
            full: "R U' R' U' R U R D R' U' R D' R' U² R' U'",
          }, {
            full: "R U R' F' R U² R' U² R' F R U R U² R' U'",
          }],
        },
        {
          name: 'Rb',
          sideColors: {
            back: [O, R, O],   // Headlights, edge from front
            left: [B, G, G],   // Left from right, right correct
            right: [B, B, G],  // Left correct, right from left
            front: [R, O, R],  // Headlights, edge from back
          },
          algorithms: [{
            full: "R' U² R U² R' F R U R' U' R' F' R² U'",
          }, {
            full: "R' U² R' D' R U' R' D R U R U' R' U' R U'",
          }],
        },
      ],
    ],
  },
  {
    name: 'Swap Diagonal Corners',
    description: 'Cases that swap two diagonal corners. Usually no headlights visible.',
    cases: [
      // Y perm: swaps UFL↔UBR corners, swaps UF↔UL edges
      // Recognition: no headlights, 3 colors visible on each side
      [
        {
          name: 'Y',
          sideColors: {
            back: [G, O, R],   // Left from left, right from front
            left: [B, G, O],   // Left from right, right from back
            right: [O, B, G],  // Left from back, right from left
            front: [R, R, B],  // Left correct, edge correct, right from right
          },
          algorithms: [{
            full: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
            shorthand: "F R U' R' U' R U R' F' {sexy} {sledge}",
          }],
        },
      ],
      // V perm: swaps UFL↔UBR corners, swaps UB↔UR edges
      // Recognition: no headlights, different pattern from Y
      [
        {
          name: 'V',
          sideColors: {
            back: [G, B, R],   // Left from left, edge from right, right from front
            left: [B, G, O],   // Left from right, right from back
            right: [O, O, G],  // Left from back, edge from back, right from left
            front: [R, R, B],  // Left correct, right from right
          },
          algorithms: [{
            full: "R' U R' U' y R' F' R² U' R' U R' F R F",
          }, {
            full: "R' U R' d' R' F' R² U' R' U R' F R F",
          }],
        },
      ],
      // Na and Nb: swap diagonal corners + swap diagonal edges (the "N" shape)
      // Recognition: one solved bar, adjacent sides have 5-checker pattern
      [
        {
          name: 'Na',
          sideColors: {
            back: [R, O, G],   // Left from front, right from left
            left: [O, B, O],   // Headlights, edge from right
            right: [B, G, B],  // Headlights, edge from left
            front: [G, R, R],  // Left from back, right correct
          },
          algorithms: [{
            full: "R U R' U R U R' F' R U R' U' R' F R² U' R' U² R U' R'",
          }, {
            full: "L U' R U² L' U R' L U' R U² L' U R'",
          }],
        },
        {
          name: 'Nb',
          sideColors: {
            back: [G, O, R],   // Left from left, right from front
            left: [O, G, O],   // Headlights, edge from right (swapped)
            right: [B, B, B],  // Solved bar
            front: [R, R, G],  // Left correct, right from back
          },
          algorithms: [{
            full: "R' U L' U² R U' L R' U L' U² R U' L",
          }, {
            full: "R' U R U' R' F' U' F R U R' F R' F' R U' R",
          }],
        },
      ],
    ],
  },
  {
    name: 'G Permutations',
    description: 'Complex cases: 3-cycle of corners + 3-cycle of edges. Look for one headlight.',
    cases: [
      // Ga and Gb: corner cycle + edge cycle in same direction
      // Recognition: exactly one headlight, adjacent 2x1 block
      [
        {
          name: 'Ga',
          sideColors: {
            back: [G, O, R],   // Mixed colors
            left: [O, G, O],   // Headlights
            right: [R, B, G],  // Mixed colors
            front: [B, R, B],  // Headlights
          },
          algorithms: [{
            full: "R² U R' U R' U' R U' R² U' D R' U R D'",
          }, {
            full: "R² u R' U R' U' R u' R² y' R' U R",
          }],
        },
        {
          name: 'Gb',
          sideColors: {
            back: [R, O, G],   // Mixed colors
            left: [O, G, O],   // Headlights
            right: [G, B, R],  // Mixed colors
            front: [B, R, B],  // Headlights
          },
          algorithms: [{
            full: "R' U' R U D' R² U R' U R U' R U' R² D",
          }, {
            full: "F' U' F R² u R' U R U' R u' R²",
          }],
        },
      ],
      // Gc and Gd: corner cycle + edge cycle in opposite directions
      // Recognition: exactly one headlight, different block pattern
      [
        {
          name: 'Gc',
          sideColors: {
            back: [O, O, O],   // Solved bar (headlights + edge)
            left: [R, G, B],   // All different
            right: [G, B, R],  // All different
            front: [B, R, G],  // All different
          },
          algorithms: [{
            full: "R² U' R U' R U R' U R² U D' R U' R' D",
          }, {
            full: "R² F² R U² R U² R' F R U R' U' R' F R²",
          }],
        },
        {
          name: 'Gd',
          sideColors: {
            back: [O, O, O],   // Solved bar
            left: [B, G, R],   // All different
            right: [R, B, G],  // All different
            front: [G, R, B],  // All different
          },
          algorithms: [{
            full: "R U R' U' D R² U' R U' R' U R' U R² D'",
          }, {
            full: "R² F' R U R U' R' F' R U² R' U² R' F² R²",
          }],
        },
      ],
    ],
  },
]
