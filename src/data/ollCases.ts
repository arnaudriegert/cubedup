import { Orientation, OLLOrientations } from '../types/cube'

export interface AlgorithmStep {
  moves: string           // The raw moves for this segment
  trigger?: string        // Optional trigger notation e.g., '{sexy}'
}

export interface Algorithm {
  decomposition: AlgorithmStep[]  // Source of truth - full is built from this
  simplifiedResult?: string       // Optional simplified result with cancellations marked (contains ~)
}

export interface OLLCase {
  number: number
  name: string
  orientations: OLLOrientations
  algorithms: Algorithm[]
}

// Can be either a related pair of cases or a single case
export type OLLEntry = [OLLCase, OLLCase] | [OLLCase]

export interface OLLCategory {
  name: string
  description: string
  cases: OLLEntry[]
}

// OLL Cases organized by shape categories
export const ollCategories: OLLCategory[] = [
  {
    name: 'Solved Cross',
    description: 'All 4 edges are oriented correctly, only corners need orientation',
    cases: [
      [
        {
          number: 21,
          name: 'H',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            simplifiedResult: "(R U² R' U' R ~U' R') (R U²~ **U** R' U' R U' R')",
            decomposition: [
              { moves: "R U² R' U' R U' R'", trigger: '{chair}' },
              { moves: "R U² R' U' R U' R'", trigger: '{chair}' },
            ],
          }, {
            decomposition: [
              { moves: 'F' },
              { moves: "(R U R' U') (R U R' U') (R U R' U')", trigger: '{sexy}³' },
              { moves: "F'" },
            ],
          }],
        },
      ],
      [
        {
          number: 22,
          name: 'Pi',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [
            {
              decomposition: [
                { moves: "R U² R' U' R U' R'", trigger: '{chair}' },
                { moves: "U'" },
                { moves: "R U² R' U' R U' R'", trigger: '{chair}' },
              ],
            },
            {
              decomposition: [
                { moves: 'R U² R²' },
                { moves: "U' R² U'" },
                { moves: 'R² U² R' },
              ],
            },
          ],
        },
      ],
      [
        {
          number: 23,
          name: 'Headlights',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [
            {
              decomposition: [
                { moves: "R U² R' U' R U' R'", trigger: '{chair}' },
                { moves: "L' U² L U L' U L", trigger: '{left-chair}' },
              ],
            },
            {
              decomposition: [
                { moves: '[u]' },
                { moves: 'R² D' },
                { moves: "R' U² R" },
                { moves: "D'" },
                { moves: "R' U² R'" },
              ],
            },
          ],
        },
      ],
      [
        {
          number: 24,
          name: 'Chameleon',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.TOP, Orientation.TOP,
          ],
          algorithms: [
            {
              decomposition: [
                { moves: "[u²] [f']" },
                { moves: "R U² R' U' R U' R'", trigger: '{chair}' },
                { moves: "L' U² L U L' U L", trigger: '{left-chair}' },
                { moves: '[f]' },
              ],
            },
            {
              decomposition: [
                { moves: "r U R' U'", trigger: '{fat-sexy}' },
                { moves: "r' F R F'", trigger: '{fat-sledge}' },
              ],
            },
          ],
        },
      ],
      [
        {
          number: 25,
          name: 'Bowtie',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.TOP, Orientation.TOP,
          ],
          algorithms: [
            {
              decomposition: [
                { moves: 'F' },
                { moves: "R U² R' U' R U' R'", trigger: '{chair}' },
                { moves: "L' U² L U L' U L", trigger: '{left-chair}' },
                { moves: "F'" },
              ],
            },
            {
              decomposition: [
                { moves: "F R' F' r", trigger: "{fat-sledge}'" },
                { moves: "U R U' r'", trigger: "{fat-sexy}'" },
              ],
            },
          ],
        },
      ],
      [
        {
          number: 27,
          name: 'Sune',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "L' U² L U L' U L", trigger: '{left-chair}' },
            ],
          }],
        },
        {
          number: 26,
          name: 'Anti-Sune',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U² R' U' R U' R'", trigger: '{chair}' },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'L Shapes',
    description: 'Cases forming an "L" pattern on the top face',
    cases: [
      [
        {
          number: 47,
          name: 'L Shape 1',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "F'" },
              { moves: "(L' U' L U) (L' U' L U)", trigger: '{left-sexy}²' },
              { moves: 'F' },
            ],
          }],
        },
        {
          number: 48,
          name: 'L Shape 2',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'F' },
              { moves: "(R U R' U') (R U R' U')", trigger: '{sexy}²' },
              { moves: "F'" },
            ],
          }],
        },
      ],
      [
        {
          number: 49,
          name: 'L Shape 3',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "l U' l'" },
              { moves: "l' U l" },
              { moves: "l U l'" },
              { moves: "l' U' l" },
            ],
          }],
        },
        {
          number: 50,
          name: 'L Shape 4',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.BACK,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "r' U r" },
              { moves: "r U' r'" },
              { moves: "r' U' r" },
              { moves: "r U r'" },
            ],
          }],
        },
      ],
      [
        {
          number: 54,
          name: 'L Shape 6',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'l' },
              { moves: "U L' U L" },
              { moves: "U' L' U L", trigger: "{left-sexy}'" },
              { moves: "U² l'" },
            ],
          }],
        },
        {
          number: 53,
          name: 'L Shape 5',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [
            {
              decomposition: [
                { moves: "r'" },
                { moves: "U' R U' R'" },
                { moves: "U R U' R'", trigger: "{sexy}'" },
                { moves: 'U² r' },
              ],
            },
          ],
        },
      ],
    ],
  },
  {
    name: 'P Shapes',
    description: 'Cases forming a "P" pattern on the top face',
    cases: [
      [
        {
          number: 31,
          name: 'P Shape',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            simplifiedResult: "S' (L' U' L U) (L F' L' ~F) S~ **f**",
            decomposition: [
              { moves: "S'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: "L F' L' F", trigger: '{left-sledge}' },
              { moves: 'S' },
            ],
          }],
        },
        {
          number: 32,
          name: 'P Shape',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.TOP, Orientation.TOP,
          ],
          algorithms: [{
            simplifiedResult: "S (R U R' U') (R' F R ~F') S'~ **f'**",
            decomposition: [
              { moves: 'S' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: "S'" },
            ],
          }],
        },
      ],
      [
        {
          number: 43,
          name: 'P Shape',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "F'" },
              { moves: "U' L' U L", trigger: "{left-sexy}'" },
              { moves: 'F' },
            ],
          }],
        },
        {
          number: 44,
          name: 'P Shape',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'F' },
              { moves: "U R U' R'", trigger: "{sexy}'" },
              { moves: "F'" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'T Shapes',
    description: 'T patterns with 2 adjacent edges oriented',
    cases: [
      [
        {
          number: 33,
          name: 'T Shape 1',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F R F'", trigger: '{sledge}' },
            ],
          }],
        },
      ],
      [
        {
          number: 45,
          name: 'T Shape 2',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'F' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "F'" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Dots',
    description: 'No edges oriented correctly',
    cases: [
      [
        {
          number: 1,
          name: 'Dot + 2 sides',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'R U² R²' },
              { moves: "F R F'" },
              { moves: 'U²' },
              { moves: "R' F R F'", trigger: '{sledge}' },
            ],
          }],
        },
      ],
      [
        {
          number: 2,
          name: 'Dot + 1 side',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.BACK,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'F' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "F'" },
              { moves: 'f' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "f'" },
            ],
          }],
        },
      ],
      [
        {
          number: 3,
          name: 'Half-diagonal 1',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "f'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: 'f' },
              { moves: "U'" },
              { moves: 'F' },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: 'F' },
            ],
          }],
        },
        {
          number: 4,
          name: 'Half-diagonal 2',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'f' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "f'" },
              { moves: 'U' },
              { moves: 'F' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "F'" },
            ],
          }],
        },
      ],
      [
        {
          number: 18,
          name: 'V Shape 1',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "r U R' U R U² r'", trigger: '{fat-sune}' },
              { moves: "r' U' R U' R' U² r", trigger: '{left-fat-sune}' },
            ],
          }],
        },
      ],
      [
        {
          number: 19,
          name: 'V Shape 2',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'M U' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "M'" },
              { moves: "R' F R F'", trigger: '{sledge}' },
            ],
          }],
        },
      ],
      [
        {
          number: 17,
          name: 'Diagonal',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U R' U", trigger: '{half-sune}' },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: 'U²' },
              { moves: "R' F R F'", trigger: '{sledge}' },
            ],
          }],
        },
      ],
      [
        {
          number: 20,
          name: 'Checkers',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "r U R' U'", trigger: '{fat-sexy}' },
              { moves: 'M²' },
              { moves: "U R U' R'", trigger: "{sexy}'" },
              { moves: "U' M'" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Line',
    description: 'Horizontal line of 2 oriented edges',
    cases: [
      [
        {
          number: 51,
          name: 'Line + T-Shape side',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'f' },
              { moves: "(R U R' U') (R U R' U')", trigger: '{sexy}²' },
              { moves: "f'" },
            ],
          }, {
            decomposition: [
              { moves: '[u2]' },
              { moves: 'F' },
              { moves: "(U R U' R') (U R U' R')", trigger: "{sexy}'²" },
              { moves: "F'" },
            ],
          }],
        },
      ],
      [
        {
          number: 52,
          name: 'Line + 1 side',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U R' U", trigger: '{half-sune}' },
              { moves: "R d'" },
              { moves: "R U' R' F'" },
            ],
          }],
        },
      ],
      [
        {
          number: 55,
          name: 'Line + 2 sides',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R' F" },
              { moves: "U R U' R²" },
              { moves: "F' R²" },
              { moves: "U' R' U R U R'" },
            ],
          }],
        },
      ],
      [
        {
          number: 56,
          name: 'Line 4',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "r' U' r" },
              { moves: "U' R'" },
              { moves: "U R U' R'", trigger: "{sexy}'" },
              { moves: "U R r' U r" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Square',
    description: 'Square shape with adjacent edges oriented',
    cases: [
      [
        {
          number: 5,
          name: 'Square 1',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "l' U²" },
              { moves: "L U L' U", trigger: "{left-half-sune}'" },
              { moves: 'l' },
            ],
          }],
        },
        {
          number: 6,
          name: 'Square 2',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'r U²' },
              { moves: "R' U' R U'", trigger: "{half-sune}'" },
              { moves: "r'" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Small Lightning',
    description: 'Lightning bolt shapes with 2 adjacent edges oriented',
    cases: [
      [
        {
          number: 8,
          name: 'Lightning 2',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.BACK,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "l'" },
              { moves: "U' L U' L'", trigger: '{left-half-sune}' },
              { moves: 'U² l' },
            ],
          }],
        },
        {
          number: 7,
          name: 'Lightning 1',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'r' },
              { moves: "U R' U R", trigger: '{half-sune}' },
              { moves: "U² r'" },
            ],
          }],
        },
      ],
      [
        {
          number: 12,
          name: 'Lightning 4',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.TOP, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'M' },
              { moves: "L' U' L U' L' U² L", trigger: '{left-sune}' },
              { moves: "U' M'" },
            ],
          }],
        },
        {
          number: 11,
          name: 'Lightning 3',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'M' },
              { moves: "R U R' U R U² R'", trigger: '{sune}' },
              { moves: "U M'" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Fish',
    description: 'Fish shapes with 2 adjacent edges oriented',
    cases: [
      [
        {
          number: 10,
          name: 'Fish 2',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: "L F' L' F", trigger: '{left-sledge}' },
              { moves: "F'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: 'F' },
            ],
            simplifiedResult: "(L' U' L U) (L F' L' ~F) F' (L'~ **L²** U' L U) F",
          }],
        },
        {
          number: 9,
          name: 'Fish 1',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: 'F' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "F'" },
            ],
            simplifiedResult: "(R U R' U') (R' F ~R F') F (R~ **R²** U R' U') F'",
          }],
        },
      ],
      [
        {
          number: 35,
          name: 'Fish 3',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.TOP, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'R U² R²' },
              { moves: "F R F'" },
              { moves: "R U² R'" },
            ],
          }],
        },
      ],
      [
        {
          number: 37,
          name: 'Fish 4',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "F R' F' R", trigger: "{sledge}'" },
              { moves: "U R U' R'", trigger: "{sexy}'" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'W Shapes',
    description: 'W patterns with 2 adjacent edges oriented',
    cases: [
      [
        {
          number: 36,
          name: 'W Shape 1',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.BACK,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "L' U' L U'" },
              { moves: "L' U L U" },
              { moves: "L F' L' F", trigger: '{left-sledge}' },
            ],
          }],
        },
        {
          number: 38,
          name: 'W Shape 2',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U R' U" },
              { moves: "R U' R' U'" },
              { moves: "R' F R F'", trigger: '{sledge}' },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Big Lightning',
    description: 'Large lightning bolt patterns',
    cases: [
      [
        {
          number: 39,
          name: 'Big Lightning 1',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "L F'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: "F U' L'" },
            ],
          }],
        },
        {
          number: 40,
          name: 'Big Lightning 2',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R' F" },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "F' U R" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Knight Move',
    description: 'Knight move patterns with 2 opposite edges oriented',
    cases: [
      [
        {
          number: 14,
          name: 'Knight 2',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "l' U l" },
              { moves: 'U' },
              { moves: "l' U' l" },
              { moves: "F U' F'" },
            ],
          }],
        },
        {
          number: 13,
          name: 'Knight 1',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "r U' r'" },
              { moves: "U'" },
              { moves: "r U r'" },
              { moves: "F' U F" },
            ],
          }],
        },
      ],
      [
        {
          number: 15,
          name: 'Knight 3',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "l' U' l" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: "l' U l" },
            ],
          }],
        },
        {
          number: 16,
          name: 'Knight 4',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "r U r'" },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "r U' r'" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Awkward',
    description: 'Awkward patterns with 2 opposite edges oriented',
    cases: [
      [
        {
          number: 30,
          name: 'Awkward 2',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "M U'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: "L F' L' F", trigger: '{left-sledge}' },
              { moves: "M'" },
            ],
          }],
        },
        {
          number: 29,
          name: 'Awkward 1',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: 'M U' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: "M'" },
            ],
          }],
        },
      ],
      [
        {
          number: 42,
          name: 'Awkward 4',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.BACK,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "L' U' L U' L' U² L", trigger: '{left-sune}' },
              { moves: "F'" },
              { moves: "L' U' L U", trigger: '{left-sexy}' },
              { moves: 'F' },
            ],
          }],
        },
        {
          number: 41,
          name: 'Awkward 3',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U R' U R U² R'", trigger: '{sune}' },
              { moves: 'F' },
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "F'" },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'C Shapes',
    description: 'C patterns with 2 adjacent edges oriented',
    cases: [
      [
        {
          number: 34,
          name: 'C Shape 1',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "B'" },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: 'B' },
            ],
          }],
        },
      ],
      [
        {
          number: 46,
          name: 'C Shape 2',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R' U'" },
              { moves: "R' F R F'", trigger: '{sledge}' },
              { moves: 'U R' },
            ],
          }],
        },
      ],
    ],
  },
  {
    name: 'Solved Corners',
    description: 'I patterns with opposite edges oriented',
    cases: [
      [
        {
          number: 28,
          name: 'Adjacent Edges',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "r U R' U'", trigger: '{fat-sexy}' },
              { moves: 'M' },
              { moves: "U R U' R'", trigger: "{sexy}'" },
            ],
          }, {
            decomposition: [
              { moves: "M U M'" },
              { moves: 'U²' },
              { moves: "M U M'" },
            ],
          }],
        },
      ],
      [
        {
          number: 57,
          name: 'Opposite Edges',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{
            decomposition: [
              { moves: "R U R' U'", trigger: '{sexy}' },
              { moves: "M'" },
              { moves: "U R U' r'", trigger: "{fat-sexy}'" },
            ],
          }],
        },
      ],
    ],
  },
]
