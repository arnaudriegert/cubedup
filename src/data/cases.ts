/**
 * Case metadata - minimal data for OLL/PLL cases
 *
 * Patterns are derived dynamically by applying inverse algorithms to solved cube.
 * This file only contains:
 * - Case identity (id, name, category, number)
 * - Relationships (inverseOf)
 * - UI grouping via ollGroups/pllGroups
 */

import type {
  Algorithm, Case, CaseId, CaseGroup, PLLSwapInfo,
} from '../types/algorithm'
import { algorithms } from './algorithms'

export const cases = new Map<CaseId, Case>([
  // ==========================================================================
  // OLL - SOLVED CROSS (21-27)
  // ==========================================================================
  ['oll-21', {
    id: 'oll-21',
    name: 'H',
    category: 'oll',
    number: 21,
    algorithms: ['oll-21', 'oll-21-2'],
  }],
  ['oll-22', {
    id: 'oll-22',
    name: 'Pi',
    category: 'oll',
    number: 22,
    algorithms: ['oll-22'],
  }],
  ['oll-23', {
    id: 'oll-23',
    name: 'Headlights',
    category: 'oll',
    number: 23,
    algorithms: ['oll-23'],
  }],
  ['oll-24', {
    id: 'oll-24',
    name: 'Chameleon',
    category: 'oll',
    number: 24,
    inverseOf: 'oll-25',
    algorithms: ['oll-24', 'oll-24-2'],
  }],
  ['oll-25', {
    id: 'oll-25',
    name: 'Bowtie',
    category: 'oll',
    number: 25,
    inverseOf: 'oll-24',
    algorithms: ['oll-25', 'oll-25-2'],
  }],
  ['oll-26', {
    id: 'oll-26',
    name: 'Anti-Sune',
    category: 'oll',
    number: 26,
    algorithms: ['oll-26'],
  }],
  ['oll-27', {
    id: 'oll-27',
    name: 'Sune',
    category: 'oll',
    number: 27,
    algorithms: ['oll-27'],
  }],

  // ==========================================================================
  // OLL - L SHAPES (47-50, 53-54)
  // ==========================================================================
  ['oll-47', {
    id: 'oll-47',
    name: 'L Shape',
    category: 'oll',
    number: 47,
    algorithms: ['oll-47'],
  }],
  ['oll-48', {
    id: 'oll-48',
    name: 'L Shape',
    category: 'oll',
    number: 48,
    inverseOf: 'oll-51',
    algorithms: ['oll-48'],
  }],
  ['oll-49', {
    id: 'oll-49',
    name: 'L Shape',
    category: 'oll',
    number: 49,
    algorithms: ['oll-49'],
  }],
  ['oll-50', {
    id: 'oll-50',
    name: 'L Shape',
    category: 'oll',
    number: 50,
    algorithms: ['oll-50'],
  }],
  ['oll-53', {
    id: 'oll-53',
    name: 'L Shape',
    category: 'oll',
    number: 53,
    algorithms: ['oll-53'],
  }],
  ['oll-54', {
    id: 'oll-54',
    name: 'L Shape',
    category: 'oll',
    number: 54,
    algorithms: ['oll-54'],
  }],

  // ==========================================================================
  // OLL - P SHAPES (31, 32, 43, 44)
  // ==========================================================================
  ['oll-31', {
    id: 'oll-31',
    name: 'P Shape',
    category: 'oll',
    number: 31,
    algorithms: ['oll-31'],
  }],
  ['oll-32', {
    id: 'oll-32',
    name: 'P Shape',
    category: 'oll',
    number: 32,
    algorithms: ['oll-32'],
  }],
  ['oll-43', {
    id: 'oll-43',
    name: 'P Shape',
    category: 'oll',
    number: 43,
    algorithms: ['oll-43'],
  }],
  ['oll-44', {
    id: 'oll-44',
    name: 'P Shape',
    category: 'oll',
    number: 44,
    inverseOf: 'oll-45',
    algorithms: ['oll-44'],
  }],

  // ==========================================================================
  // OLL - T SHAPES (33, 45)
  // ==========================================================================
  ['oll-33', {
    id: 'oll-33',
    name: 'T Shape',
    category: 'oll',
    number: 33,
    inverseOf: 'oll-37',
    algorithms: ['oll-33'],
  }],
  ['oll-45', {
    id: 'oll-45',
    name: 'T Shape',
    category: 'oll',
    number: 45,
    inverseOf: 'oll-44',
    algorithms: ['oll-45'],
  }],

  // ==========================================================================
  // OLL - DOTS (1-4, 17-19)
  // ==========================================================================
  ['oll-1', {
    id: 'oll-1',
    name: 'Dot + 2 sides',
    category: 'oll',
    number: 1,
    algorithms: ['oll-1'],
  }],
  ['oll-2', {
    id: 'oll-2',
    name: 'Dot + 1 side',
    category: 'oll',
    number: 2,
    algorithms: ['oll-2'],
  }],
  ['oll-3', {
    id: 'oll-3',
    name: 'Half-diagonal',
    category: 'oll',
    number: 3,
    algorithms: ['oll-3'],
  }],
  ['oll-4', {
    id: 'oll-4',
    name: 'Half-diagonal',
    category: 'oll',
    number: 4,
    algorithms: ['oll-4'],
  }],
  ['oll-17', {
    id: 'oll-17',
    name: 'Diagonal',
    category: 'oll',
    number: 17,
    inverseOf: 'oll-19',
    algorithms: ['oll-17-1', 'oll-17-2'],
  }],
  ['oll-18', {
    id: 'oll-18',
    name: 'V Shape',
    category: 'oll',
    number: 18,
    algorithms: ['oll-18'],
  }],
  ['oll-19', {
    id: 'oll-19',
    name: 'V Shape',
    category: 'oll',
    number: 19,
    inverseOf: 'oll-17',
    algorithms: ['oll-19'],
  }],

  // ==========================================================================
  // OLL - LINE (51, 52, 55, 56)
  // ==========================================================================
  ['oll-51', {
    id: 'oll-51',
    name: 'Line + T-Shape',
    category: 'oll',
    number: 51,
    inverseOf: 'oll-48',
    algorithms: ['oll-51'],
  }],
  ['oll-52', {
    id: 'oll-52',
    name: 'Line + 1 side',
    category: 'oll',
    number: 52,
    algorithms: ['oll-52'],
  }],
  ['oll-55', {
    id: 'oll-55',
    name: 'Line + 2 sides',
    category: 'oll',
    number: 55,
    algorithms: ['oll-55'],
  }],
  ['oll-56', {
    id: 'oll-56',
    name: 'Line',
    category: 'oll',
    number: 56,
    algorithms: ['oll-56'],
  }],

  // ==========================================================================
  // OLL - SQUARE (5, 6)
  // ==========================================================================
  ['oll-5', {
    id: 'oll-5',
    name: 'Square',
    category: 'oll',
    number: 5,
    inverseOf: 'oll-8',
    algorithms: ['oll-5'],
  }],
  ['oll-6', {
    id: 'oll-6',
    name: 'Square',
    category: 'oll',
    number: 6,
    inverseOf: 'oll-7',
    algorithms: ['oll-6'],
  }],

  // ==========================================================================
  // OLL - SMALL LIGHTNING (7, 8, 11, 12)
  // ==========================================================================
  ['oll-7', {
    id: 'oll-7',
    name: 'Lightning',
    category: 'oll',
    number: 7,
    inverseOf: 'oll-6',
    algorithms: ['oll-7'],
  }],
  ['oll-8', {
    id: 'oll-8',
    name: 'Lightning',
    category: 'oll',
    number: 8,
    inverseOf: 'oll-5',
    algorithms: ['oll-8'],
  }],
  ['oll-11', {
    id: 'oll-11',
    name: 'Lightning',
    category: 'oll',
    number: 11,
    algorithms: ['oll-11'],
  }],
  ['oll-12', {
    id: 'oll-12',
    name: 'Lightning',
    category: 'oll',
    number: 12,
    algorithms: ['oll-12'],
  }],

  // ==========================================================================
  // OLL - FISH (9, 10, 35, 37)
  // ==========================================================================
  ['oll-9', {
    id: 'oll-9',
    name: 'Fish',
    category: 'oll',
    number: 9,
    inverseOf: 'oll-13',
    algorithms: ['oll-9'],
  }],
  ['oll-10', {
    id: 'oll-10',
    name: 'Fish',
    category: 'oll',
    number: 10,
    inverseOf: 'oll-14',
    algorithms: ['oll-10'],
  }],
  ['oll-35', {
    id: 'oll-35',
    name: 'Fish',
    category: 'oll',
    number: 35,
    algorithms: ['oll-35'],
  }],
  ['oll-37', {
    id: 'oll-37',
    name: 'Fish',
    category: 'oll',
    number: 37,
    inverseOf: 'oll-33',
    algorithms: ['oll-37-1', 'oll-37-2'],
  }],

  // ==========================================================================
  // OLL - W SHAPES (36, 38)
  // ==========================================================================
  ['oll-36', {
    id: 'oll-36',
    name: 'W Shape',
    category: 'oll',
    number: 36,
    algorithms: ['oll-36'],
  }],
  ['oll-38', {
    id: 'oll-38',
    name: 'W Shape',
    category: 'oll',
    number: 38,
    algorithms: ['oll-38'],
  }],

  // ==========================================================================
  // OLL - BIG LIGHTNING (39, 40)
  // ==========================================================================
  ['oll-39', {
    id: 'oll-39',
    name: 'Big Lightning',
    category: 'oll',
    number: 39,
    algorithms: ['oll-39'],
  }],
  ['oll-40', {
    id: 'oll-40',
    name: 'Big Lightning',
    category: 'oll',
    number: 40,
    algorithms: ['oll-40'],
  }],

  // ==========================================================================
  // OLL - KNIGHT MOVE (13-16)
  // ==========================================================================
  ['oll-13', {
    id: 'oll-13',
    name: 'Knight',
    category: 'oll',
    number: 13,
    inverseOf: 'oll-9',
    algorithms: ['oll-13'],
  }],
  ['oll-14', {
    id: 'oll-14',
    name: 'Knight',
    category: 'oll',
    number: 14,
    inverseOf: 'oll-10',
    algorithms: ['oll-14'],
  }],
  ['oll-15', {
    id: 'oll-15',
    name: 'Knight',
    category: 'oll',
    number: 15,
    algorithms: ['oll-15'],
  }],
  ['oll-16', {
    id: 'oll-16',
    name: 'Knight',
    category: 'oll',
    number: 16,
    algorithms: ['oll-16'],
  }],

  // ==========================================================================
  // OLL - AWKWARD (29, 30, 41, 42)
  // ==========================================================================
  ['oll-29', {
    id: 'oll-29',
    name: 'Awkward',
    category: 'oll',
    number: 29,
    algorithms: ['oll-29'],
  }],
  ['oll-30', {
    id: 'oll-30',
    name: 'Awkward',
    category: 'oll',
    number: 30,
    algorithms: ['oll-30'],
  }],
  ['oll-41', {
    id: 'oll-41',
    name: 'Awkward',
    category: 'oll',
    number: 41,
    algorithms: ['oll-41'],
  }],
  ['oll-42', {
    id: 'oll-42',
    name: 'Awkward',
    category: 'oll',
    number: 42,
    algorithms: ['oll-42'],
  }],

  // ==========================================================================
  // OLL - C SHAPES (34, 46)
  // ==========================================================================
  ['oll-34', {
    id: 'oll-34',
    name: 'C Shape',
    category: 'oll',
    number: 34,
    algorithms: ['oll-34'],
  }],
  ['oll-46', {
    id: 'oll-46',
    name: 'C Shape',
    category: 'oll',
    number: 46,
    algorithms: ['oll-46'],
  }],

  // ==========================================================================
  // OLL - SOLVED CORNERS (20, 28, 57)
  // ==========================================================================
  ['oll-20', {
    id: 'oll-20',
    name: 'Checkers',
    category: 'oll',
    number: 20,
    algorithms: ['oll-20'],
  }],
  ['oll-28', {
    id: 'oll-28',
    name: 'Adjacent Edges',
    category: 'oll',
    number: 28,
    inverseOf: 'oll-57',
    algorithms: ['oll-28'],
  }],
  ['oll-57', {
    id: 'oll-57',
    name: 'Opposite Edges',
    category: 'oll',
    number: 57,
    inverseOf: 'oll-28',
    algorithms: ['oll-57'],
  }],

  // ==========================================================================
  // PLL - EDGES ONLY
  // ==========================================================================
  ['pll-ua', {
    id: 'pll-ua',
    name: 'Ua',
    category: 'pll',
    algorithms: ['pll-ua'],
  }],
  ['pll-ub', {
    id: 'pll-ub',
    name: 'Ub',
    category: 'pll',
    algorithms: ['pll-ub'],
  }],
  ['pll-h', {
    id: 'pll-h',
    name: 'H',
    category: 'pll',
    algorithms: ['pll-h'],
  }],
  ['pll-z', {
    id: 'pll-z',
    name: 'Z',
    category: 'pll',
    algorithms: ['pll-z'],
  }],

  // ==========================================================================
  // PLL - CORNERS ONLY
  // ==========================================================================
  ['pll-aa', {
    id: 'pll-aa',
    name: 'Aa',
    category: 'pll',
    algorithms: ['pll-aa'],
  }],
  ['pll-ab', {
    id: 'pll-ab',
    name: 'Ab',
    category: 'pll',
    algorithms: ['pll-ab'],
  }],
  ['pll-e', {
    id: 'pll-e',
    name: 'E',
    category: 'pll',
    algorithms: ['pll-e'],
  }],

  // ==========================================================================
  // PLL - ADJACENT CORNERS
  // ==========================================================================
  ['pll-t', {
    id: 'pll-t',
    name: 'T',
    category: 'pll',
    algorithms: ['pll-t'],
  }],
  ['pll-f', {
    id: 'pll-f',
    name: 'F',
    category: 'pll',
    algorithms: ['pll-f'],
  }],
  ['pll-ja', {
    id: 'pll-ja',
    name: 'Ja (L)',
    category: 'pll',
    algorithms: ['pll-ja'],
  }],
  ['pll-jb', {
    id: 'pll-jb',
    name: 'Jb',
    category: 'pll',
    algorithms: ['pll-jb'],
  }],
  ['pll-ra', {
    id: 'pll-ra',
    name: 'Ra',
    category: 'pll',
    algorithms: ['pll-ra'],
  }],
  ['pll-rb', {
    id: 'pll-rb',
    name: 'Rb',
    category: 'pll',
    algorithms: ['pll-rb'],
  }],

  // ==========================================================================
  // PLL - DIAGONAL CORNERS
  // ==========================================================================
  ['pll-y', {
    id: 'pll-y',
    name: 'Y',
    category: 'pll',
    algorithms: ['pll-y'],
  }],
  ['pll-v', {
    id: 'pll-v',
    name: 'V',
    category: 'pll',
    algorithms: ['pll-v'],
  }],
  ['pll-na', {
    id: 'pll-na',
    name: 'Na',
    category: 'pll',
    algorithms: ['pll-na'],
  }],
  ['pll-nb', {
    id: 'pll-nb',
    name: 'Nb',
    category: 'pll',
    algorithms: ['pll-nb'],
  }],

  // ==========================================================================
  // PLL - G PERMUTATIONS
  // ==========================================================================
  ['pll-ga', {
    id: 'pll-ga',
    name: 'Ga',
    category: 'pll',
    algorithms: ['pll-ga'],
  }],
  ['pll-gb', {
    id: 'pll-gb',
    name: 'Gb',
    category: 'pll',
    algorithms: ['pll-gb'],
  }],
  ['pll-gc', {
    id: 'pll-gc',
    name: 'Gc',
    category: 'pll',
    algorithms: ['pll-gc'],
  }],
  ['pll-gd', {
    id: 'pll-gd',
    name: 'Gd',
    category: 'pll',
    algorithms: ['pll-gd'],
  }],
])

// ==========================================================================
// Case Groups - for UI organization
// ==========================================================================

export const ollGroups: CaseGroup[] = [
  {
    name: 'Solved Cross',
    description: 'All 4 edges are oriented correctly',
    cases: [
      ['oll-21'],
      ['oll-22'],
      ['oll-23'],
      ['oll-24'],
      ['oll-25'],
      ['oll-27', 'oll-26'], // Sune & Anti-Sune (left-handed first)
    ],
  },
  {
    name: 'L Shapes',
    description: 'Cases forming an "L" pattern',
    cases: [
      ['oll-47', 'oll-48'], // Mirror pair
      ['oll-49', 'oll-50'], // Mirror pair
      ['oll-54', 'oll-53'], // Mirror pair (left-handed first)
    ],
  },
  {
    name: 'P Shapes',
    description: 'Cases forming a "P" pattern',
    cases: [
      ['oll-31', 'oll-32'], // Mirror pair
      ['oll-43', 'oll-44'], // Mirror pair
    ],
  },
  {
    name: 'T Shapes',
    description: 'T patterns with 2 adjacent edges oriented',
    cases: [
      ['oll-33'],
      ['oll-45'],
    ],
  },
  {
    name: 'Dots',
    description: 'No edges oriented correctly',
    cases: [
      ['oll-1'],
      ['oll-2'],
      ['oll-3', 'oll-4'], // Mirror pair
      ['oll-18'],
      ['oll-19'],
      ['oll-17'],
    ],
  },
  {
    name: 'Line',
    description: 'Horizontal line of 2 oriented edges',
    cases: [
      ['oll-51'],
      ['oll-52'],
      ['oll-55'],
      ['oll-56'],
    ],
  },
  {
    name: 'Square',
    description: 'Square shape with adjacent edges oriented',
    cases: [
      ['oll-5', 'oll-6'], // Mirror pair
    ],
  },
  {
    name: 'Small Lightning',
    description: 'Lightning bolt shapes',
    cases: [
      ['oll-8', 'oll-7'], // Mirror pair (left-handed first)
      ['oll-12', 'oll-11'], // Mirror pair (left-handed first)
    ],
  },
  {
    name: 'Fish',
    description: 'Fish shapes',
    cases: [
      ['oll-10', 'oll-9'], // Mirror pair (left-handed first)
      ['oll-35'],
      ['oll-37'],
    ],
  },
  {
    name: 'W Shapes',
    description: 'W patterns',
    cases: [
      ['oll-36', 'oll-38'], // Mirror pair
    ],
  },
  {
    name: 'Big Lightning',
    description: 'Large lightning bolt patterns',
    cases: [
      ['oll-39', 'oll-40'], // Mirror pair
    ],
  },
  {
    name: 'Knight Move',
    description: 'Knight move patterns',
    cases: [
      ['oll-14', 'oll-13'], // Mirror pair (left-handed first)
      ['oll-15', 'oll-16'], // Mirror pair
    ],
  },
  {
    name: 'Awkward',
    description: 'Awkward patterns',
    cases: [
      ['oll-30', 'oll-29'], // Mirror pair (left-handed first)
      ['oll-42', 'oll-41'], // Mirror pair (left-handed first)
    ],
  },
  {
    name: 'C Shapes',
    description: 'C patterns',
    cases: [
      ['oll-34'],
      ['oll-46'],
    ],
  },
  {
    name: 'Solved Corners',
    description: 'All corners oriented, edges need orientation',
    cases: [
      ['oll-28'], // Adjacent Edges
      ['oll-57'], // Opposite Edges
      ['oll-20'], // Checkers
    ],
  },
]

// ==========================================================================
// 2-Look OLL Groups
// ==========================================================================

// Edge pattern metadata (name/description overrides for 2-look display)
export const edgePatternMeta: Record<string, { name: string; description: string }> = {
  'oll-2': { name: 'Dot', description: 'No edges oriented.' },
  'oll-44': { name: 'L-shape', description: '2 adjacent edges. Hold at front-right.' },
  'oll-45': { name: 'Line', description: '2 opposite edges. Hold horizontally.' },
}

export const twoLookOllGroups: CaseGroup[] = [
  {
    name: 'First Look: Edges',
    description: 'Create a yellow cross. Ignore corners completely.',
    cases: [
      ['oll-45'],
      ['oll-44'],
      ['oll-2'],
    ],
  },
  {
    name: 'Second Look: Corners',
    description: 'With cross complete, orient all corners.',
    cases: [
      ['oll-21'],
      ['oll-22'],
      ['oll-23'],
      ['oll-24'],
      ['oll-25'],
      ['oll-27', 'oll-26'],
    ],
  },
]

export const pllGroups: CaseGroup[] = [
  {
    name: 'Edges Only',
    description: 'Only edges need to be permuted - all corners are solved. Look for 4 headlights.',
    cases: [
      ['pll-ub', 'pll-ua'], // U perms (mirror pair)
      ['pll-h'],
      ['pll-z'],
    ],
  },
  {
    name: 'Corners Only',
    description: 'Only corners need to be permuted - all edges are solved.',
    cases: [
      ['pll-aa', 'pll-ab'], // A perms (mirror pair)
      ['pll-e'],
    ],
  },
  {
    name: 'Swap Adjacent Corners',
    description: 'Cases that swap two adjacent corners plus edges. Look for headlights to identify.',
    cases: [
      ['pll-t'],
      ['pll-f'],
      ['pll-ja', 'pll-jb'], // J perms (mirror pair)
      ['pll-ra', 'pll-rb'], // R perms (mirror pair)
    ],
  },
  {
    name: 'Swap Diagonal Corners',
    description: 'Cases that swap two diagonal corners. Usually no headlights visible.',
    cases: [
      ['pll-y'],
      ['pll-v'],
      ['pll-na', 'pll-nb'], // N perms (mirror pair)
    ],
  },
  {
    name: 'G Permutations',
    description: 'Complex cases: 3-cycle of corners + 3-cycle of edges. Look for one headlight.',
    cases: [
      ['pll-ga', 'pll-gc'], // Related pair
      ['pll-gb', 'pll-gd'], // Related pair
    ],
  },
]

// ==========================================================================
// PLL Swaps - arrow overlay data for visualizing piece movements
// ==========================================================================

export const pllSwaps = new Map<CaseId, PLLSwapInfo>([
  // Edges Only
  ['pll-ua', {
    edges: [{ positions: ['L', 'R', 'B'], direction: 'cw' }],
    description: '3-cycle edges: L→R→B',
  }],
  ['pll-ub', {
    edges: [{ positions: ['B', 'R', 'L'], direction: 'ccw' }],
    description: '3-cycle edges: B→R→L',
  }],
  ['pll-h', {
    edges: [
      { positions: ['F', 'B'] },
      { positions: ['L', 'R'] },
    ],
    description: 'Swap opposite edges: F↔B and L↔R',
  }],
  ['pll-z', {
    edges: [
      { positions: ['F', 'R'] },
      { positions: ['B', 'L'] },
    ],
    description: 'Swap adjacent edges: F↔R and B↔L',
  }],

  // Corners Only
  ['pll-aa', {
    corners: [{ positions: ['BR', 'FL', 'BL'], direction: 'cw' }],
    description: '3-cycle corners: BR→FL→BL',
  }],
  ['pll-ab', {
    corners: [{ positions: ['BL', 'FR', 'BR'], direction: 'ccw' }],
    description: '3-cycle corners: BL→FR→BR',
  }],
  ['pll-e', {
    corners: [
      { positions: ['BL', 'FL'] },
      { positions: ['BR', 'FR'] },
    ],
    description: 'Swap left corners and right corners',
  }],

  // Swap Adjacent Corners
  ['pll-t', {
    corners: [{ positions: ['BR', 'FR'] }],
    edges: [{ positions: ['L', 'R'] }],
    description: 'Swap right corners, swap edges L↔R',
  }],
  ['pll-f', {
    corners: [{ positions: ['FR', 'BR'] }],
    edges: [{ positions: ['F', 'B'] }],
    description: 'Swap right corners, swap edges F↔B',
  }],
  ['pll-ja', {
    corners: [{ positions: ['FL', 'BL'] }],
    edges: [{ positions: ['F', 'L'] }],
    description: 'Swap left corners, swap edges F↔L',
  }],
  ['pll-jb', {
    corners: [{ positions: ['BR', 'FR'] }],
    edges: [{ positions: ['F', 'R'] }],
    description: 'Swap right corners, swap edges F↔R',
  }],
  ['pll-ra', {
    corners: [{ positions: ['BL', 'BR'] }],
    edges: [{ positions: ['L', 'F'] }],
    description: 'Swap back corners, swap edges L↔F',
  }],
  ['pll-rb', {
    corners: [{ positions: ['BL', 'BR'] }],
    edges: [{ positions: ['R', 'F'] }],
    description: 'Swap back corners, swap edges R↔F',
  }],

  // Swap Diagonal Corners
  ['pll-y', {
    corners: [{ positions: ['BL', 'FR'] }],
    edges: [{ positions: ['L', 'B'] }],
    description: 'Swap diagonal corners BL↔FR, swap edges L↔B',
  }],
  ['pll-v', {
    corners: [{ positions: ['BL', 'FR'] }],
    edges: [{ positions: ['R', 'B'] }],
    description: 'Swap diagonal corners BL↔FR, swap edges R↔B',
  }],
  ['pll-na', {
    corners: [{ positions: ['FL', 'BR'] }],
    edges: [{ positions: ['L', 'R'] }],
    description: 'Swap diagonal corners FL↔BR, swap edges L↔R',
  }],
  ['pll-nb', {
    corners: [{ positions: ['BL', 'FR'] }],
    edges: [{ positions: ['L', 'R'] }],
    description: 'Swap diagonal corners BL↔FR, swap edges L↔R',
  }],

  // G Permutations
  ['pll-ga', {
    corners: [{ positions: ['FL', 'BL', 'BR'], direction: 'cw' }],
    edges: [{ positions: ['L', 'R', 'B'], direction: 'cw' }],
    description: '3-cycle corners FL→BL→BR, 3-cycle edges L→R→B',
  }],
  ['pll-gb', {
    corners: [{ positions: ['FL', 'BR', 'BL'], direction: 'ccw' }],
    edges: [{ positions: ['L', 'B', 'R'], direction: 'ccw' }],
    description: '3-cycle corners FL→BR→BL, 3-cycle edges L→B→R',
  }],
  ['pll-gc', {
    corners: [{ positions: ['FR', 'BR', 'BL'], direction: 'cw' }],
    edges: [{ positions: ['L', 'B', 'R'], direction: 'cw' }],
    description: '3-cycle corners FR→BR→BL, 3-cycle edges L→B→R',
  }],
  ['pll-gd', {
    corners: [{ positions: ['FR', 'BL', 'BR'], direction: 'ccw' }],
    edges: [{ positions: ['L', 'R', 'B'], direction: 'ccw' }],
    description: '3-cycle corners FR→BL→BR, 3-cycle edges L→R→B',
  }],
])

/**
 * Get PLL swap info for arrow overlay.
 */
export function getPLLSwaps(caseId: CaseId): PLLSwapInfo | undefined {
  return pllSwaps.get(caseId.toLowerCase())
}

// ==========================================================================
// Helper functions
// ==========================================================================

/**
 * Get a case by ID.
 */
export function getCase(id: CaseId): Case | undefined {
  return cases.get(id.toLowerCase())
}

/**
 * Get all algorithms that solve a specific case.
 */
export function getAlgorithmsForCase(caseId: string): Algorithm[] {
  const caseData = cases.get(caseId.toLowerCase())
  if (!caseData?.algorithms) return []
  return caseData.algorithms
    .map((id) => algorithms.get(id))
    .filter((a): a is Algorithm => a !== undefined)
}

/**
 * Get all PLL cases.
 */
export function getPLLCases(): Case[] {
  return Array.from(cases.values()).filter((c) => c.category === 'pll')
}
