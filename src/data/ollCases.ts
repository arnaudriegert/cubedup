import { Orientation, OLLOrientations } from '../types/cube'

export interface Algorithm {
  full: string
  shorthand?: string
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
            full: "(R U² R' U' R ~U' R') (R U²~ **U** R' U' R U' R')",
            shorthand: '{chair²}',
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
              full: "(R U² R' U' R U' R') U' (R U² R' U' R U' R')",
              shorthand: "{chair} U' {chair}",
            },
            { full: "R U² R² U' R² U' R² U² R" },
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
              full: "(R U² R' U' R U' R') (L' U² L U L' U L)",
              shorthand: '{chair} {left-chair}',
            },
            { full: "[u] R² D (R' U² R) D' (R' U² R')" },
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
              full: "[u²] [f'] (R U² R' U' R U' R') (L' U² L U L' U L) [f]",
              shorthand: "[u²] [f'] {chair} {left-chair} [f]",
            },
            {
              full: "(r U R' U') (r' F R F')",
              shorthand: '{fat-sexy} {fat-sledge}',
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
              full: "F (R U² R' U' R U' R') (L' U² L U L' U L) F'",
              shorthand: "F {chair} {left-chair} F'",
            },
            {
              full: "(F R' F' r) (U R U' r')",
              shorthand: "{fat-sledge}' {fat-sexy}'",
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
            full: "L' U² L U L' U L",
            shorthand: '{left-chair}',
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
            full: "R U² R' U' R U' R'",
            shorthand: '{chair}',
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
            full: "F' (L' U' L U) (L' U' L U) F",
            shorthand: "F' {left-sexy}² F",
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
            full: "F (R U R' U') (R U R' U') F'",
            shorthand: "F {sexy}² F'",
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
          algorithms: [{ full: "l U' (l² U l² U l²) U' l" }],
        },
        {
          number: 50,
          name: 'L Shape 4',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.BACK,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{ full: "r' U (r² U' r² U' r²) U r'" }],
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
            full: "l (U L' U L) (U' L' U L) U² l'",
            shorthand: "l (U L' U L) {left-sexy} U² l'",
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
              full: "r' (U' R U' R') (U R U' R') U² r",
              shorthand: "r' (U' R U' R') {sexy}' U² r",
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
            full: "S' (L' U' L U) (L F' L' ~F) S~ **f**",
            shorthand: "S' {left-sexy} {left-sledge} S",
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
            full: "S (R U R' U') (R' F R ~F') S'~ **f'**",
            shorthand: "S {sexy} {sledge} S'",
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
            full: "F' (U' L' U L) F",
            shorthand: "F' {left-sexy}' F",
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
            full: "F (U R U' R') F'",
            shorthand: "F {sexy}' F'",
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
            full: "(R U R' U') (R' F R F')",
            shorthand: '{sexy} {sledge}',
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
            full: "F (R U R' U') F'",
            shorthand: "F {sexy} F'",
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
            full: "R U² R² F R F' U² (R' F R F')",
            shorthand: "R U² R² F R F' U² {sledge}",
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
            full: "F (R U R' U') F' f (R U R' U') f'",
            shorthand: "F {sexy} F' f {sexy} f'",
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
            full: "f' (L' U' L U) f U' F' (L' U' L U) F",
            shorthand: "f' {left-sexy} f U' F' {left-sexy} F",
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
            full: "f (R U R' U') f' U F (R U R' U') F'",
            shorthand: "f {sexy} f' U F {sexy} F'",
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
          algorithms: [{ full: "r U R' U R U² r² U' R U' R' U² r" }],
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
            full: "r' R U (R U R' U') r R² F R F'",
            shorthand: "r' R U {sexy} r R² F R F'",
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
            full: "R U R' U (R' F R F') U² (R' F R F')",
            shorthand: "R U R' U {sledge} U² {sledge}",
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
            full: "(r U R' U') M² (U R U' R') U' M'",
            shorthand: "{fat-sexy} M² {sexy}' U' M'",
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
            full: "f (R U R' U') (R U R' U') f'",
            shorthand: "f {sexy}² f'",
          }, {
            full: "[u2] F (U R U' R') (U R U' R') F'",
            shorthand: "[u2] F {sexy}'² F'",
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
          algorithms: [{ full: "R U R' U R d' R U' R' F'" }],
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
          algorithms: [{ full: "R' F U R U' R² F' R² U' R' U R U R'" }],
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
            full: "r' U' r U' R' (U R U' R') U R r' U r",
            shorthand: "r' U' r U' R' {sexy}' U R r' U r",
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
          algorithms: [{ full: "l' U² (L U L' U) l" }],
        },
        {
          number: 6,
          name: 'Square 2',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{ full: "r U² (R' U' R U') r'" }],
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
          algorithms: [{ full: "l' (U' L U' L') U² l" }],
        },
        {
          number: 7,
          name: 'Lightning 1',
          orientations: [
            Orientation.BACK, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{ full: "r (U R' U R) U² r'" }],
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
            full: "M (L' U' L U' L' U² L) U' M'",
            shorthand: "M {left-chair}' U M'",
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
            full: "M (R U R' U R U² R') U M'",
            shorthand: "M {chair}' U M'",
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
          number: 9,
          name: 'Fish 1',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            full: "(R U R' U') R' F R² U R' U' F'",
            shorthand: "{sexy} R' F R² U R' U' F'",
          }],
        },
      ],
      [
        {
          number: 10,
          name: 'Fish 2',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            full: "R U R' U (R' F R F') R U² R'",
            shorthand: "R U R' U {sledge} R U² R'",
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
          algorithms: [{ full: "R U² R² F R F' R U² R'" }],
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
            full: "(F R' F' R) (U R U' R')",
            shorthand: "(F R' F' R) {sexy}'",
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
            Orientation.TOP, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.TOP, Orientation.TOP,
          ],
          algorithms: [{ full: "R' U' R U' R' U R U l U' R' U x" }],
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
            full: "R U R' (U R U' R') U' (R' F R F')",
            shorthand: "R U R' {sexy}' U' {sledge}",
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
            Orientation.TOP, Orientation.TOP, Orientation.BACK,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
          ],
          algorithms: [{
            full: "R U R' F' (R U R' U') R' F R² U' R'",
            shorthand: "R U R' F' {sexy} R' F R² U' R'",
          }],
        },
        {
          number: 40,
          name: 'Big Lightning 2',
          orientations: [
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            full: "R' F (R U R' U') F' U R",
            shorthand: "R' F {sexy} F' U R",
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
          number: 13,
          name: 'Knight 1',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.TOP, Orientation.FRONT, Orientation.FRONT,
          ],
          algorithms: [{ full: "r U' r' U' r U r' F' U F" }],
        },
        {
          number: 14,
          name: 'Knight 2',
          orientations: [
            Orientation.LEFT, Orientation.BACK, Orientation.BACK,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{ full: "R' F R U R' F' R F U' F'" }],
        },
      ],
      [
        {
          number: 15,
          name: 'Knight 3',
          orientations: [
            Orientation.BACK, Orientation.BACK, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.TOP,
          ],
          algorithms: [{ full: "r' U' r R' U' R U r' U r" }],
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
            full: "r U r' (R U R' U') r U' r'",
            shorthand: "r U r' {sexy} r U' r'",
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
          number: 29,
          name: 'Awkward 1',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            full: "(R U R' U') R U' R' F' U' F R U R'",
            shorthand: "{sexy} R U' R' F' U' F R U R'",
          }],
        },
        {
          number: 30,
          name: 'Awkward 2',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{ full: "F U R U² R' U' R U² R' U' F'" }],
        },
      ],
      [
        {
          number: 41,
          name: 'Awkward 3',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.LEFT, Orientation.TOP, Orientation.TOP,
            Orientation.FRONT, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            full: "R U R' U R U² R' F (R U R' U') F'",
            shorthand: "R U R' U R U² R' F {sexy} F'",
          }],
        },
        {
          number: 42,
          name: 'Awkward 4',
          orientations: [
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.FRONT, Orientation.TOP, Orientation.FRONT,
          ],
          algorithms: [{
            full: "R' U' R U' R' U² R F (R U R' U') F'",
            shorthand: "R' U' R U' R' U² R F {sexy} F'",
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
            Orientation.TOP, Orientation.BACK, Orientation.TOP,
            Orientation.TOP, Orientation.TOP, Orientation.TOP,
            Orientation.LEFT, Orientation.FRONT, Orientation.RIGHT,
          ],
          algorithms: [{ full: "R U R² U' R' F R U R U' F'" }],
        },
        {
          number: 46,
          name: 'C Shape 2',
          orientations: [
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
            Orientation.LEFT, Orientation.TOP, Orientation.RIGHT,
            Orientation.TOP, Orientation.TOP, Orientation.RIGHT,
          ],
          algorithms: [{
            full: "R' U' (R' F R F') U R",
            shorthand: "R' U' {sledge} U R",
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
            full: "(r U R' U') M (U R U' R')",
            shorthand: "{fat-sexy} M {sexy}'",
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
            full: "(R U R' U') M' (U R U' r')",
            shorthand: "{sexy} M' {fat-sexy}'",
          }],
        },
      ],
    ],
  },
]
