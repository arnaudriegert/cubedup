export interface Trigger {
  name: string
  notation: string
  moves: string
  inverse: string  // The inverse moves
  inverseNotation?: string  // Optional different notation for inverse (e.g., {sune} for chair's inverse)
  description?: string
}

// A trigger entry is always a left/right mirror pair
export type TriggerEntry = [Trigger, Trigger]

export interface TriggerCategory {
  name: string
  description: string
  triggers: TriggerEntry[]
}

export const triggerCategories: TriggerCategory[] = [
  {
    name: 'Core Triggers',
    description: 'The most frequently used algorithm building blocks',
    triggers: [
      // Left Sexy / Sexy pair
      [
        {
          name: 'Left Sexy',
          notation: '{left-sexy}',
          moves: 'L\' U\' L U',
          inverse: 'U\' L\' U L',
          description: 'Mirror of sexy move, executed with left hand.',
        },
        {
          name: 'Sexy Move',
          notation: '{sexy}',
          moves: 'R U R\' U\'',
          inverse: 'U R U\' R\'',
          description: 'The most common trigger. Used in nearly half of all OLL algorithms.',
        },
      ],
      // Left Sledgehammer / Sledgehammer pair
      [
        {
          name: 'Left Sledgehammer',
          notation: '{left-sledge}',
          moves: 'L F\' L\' F',
          inverse: 'F\' L F L\'',
          description: 'Mirror of sledgehammer.',
        },
        {
          name: 'Sledgehammer',
          notation: '{sledge}',
          moves: 'R\' F R F\'',
          inverse: 'F R\' F\' R',
          description: 'Second most common trigger. Often paired with sexy move.',
        },
      ],
    ],
  },
  {
    name: 'Wide Triggers',
    description: 'Triggers using wide moves (lowercase r/l = two layers together). These affect the M slice, making them useful for edge-related cases.',
    triggers: [
      // Left Fat Sexy / Fat Sexy pair
      [
        {
          name: 'Left Fat Sexy',
          notation: '{left-fat-sexy}',
          moves: 'l U L\' U\'',
          inverse: 'U L U\' l\'',
          description: 'Wide version of left sexy move.',
        },
        {
          name: 'Fat Sexy',
          notation: '{fat-sexy}',
          moves: 'r U R\' U\'',
          inverse: 'U R U\' r\'',
          description: 'Wide version of sexy move. Affects the M slice.',
        },
      ],
      // Left Fat Sledgehammer / Fat Sledgehammer pair
      [
        {
          name: 'Left Fat Sledgehammer',
          notation: '{left-fat-sledge}',
          moves: 'l F\' L\' F',
          inverse: 'F\' L F l\'',
          description: 'Wide version of left sledgehammer.',
        },
        {
          name: 'Fat Sledgehammer',
          notation: '{fat-sledge}',
          moves: 'r\' F R F\'',
          inverse: 'F R\' F\' r',
          description: 'Wide version of sledgehammer.',
        },
      ],
    ],
  },
  {
    name: 'Sune Family',
    description: 'The Sune family algorithms orient corners. Chair (Anti-Sune) and Sune are inverses—learning one gives you both. These are standalone OLL solutions and building blocks for other algorithms.',
    triggers: [
      // Left Chair / Chair pair (with Sune as inverse)
      [
        {
          name: 'Left Chair',
          notation: '{left-chair}',
          moves: 'L\' U² L U L\' U L',
          inverse: 'L\' U\' L U\' L\' U² L',
          inverseNotation: '{left-sune}',
          description: 'Mirror of Chair. Inverse is Left Sune.',
        },
        {
          name: 'Chair',
          notation: '{chair}',
          moves: 'R U² R\' U\' R U\' R\'',
          inverse: 'R U R\' U R U² R\'',
          inverseNotation: '{sune}',
          description: 'Also known as Anti-Sune. Inverse is Sune.',
        },
      ],
      // Left Half Sune / Half Sune pair
      [
        {
          name: 'Left Half Sune',
          notation: '{left-half-sune}',
          moves: 'L\' U\' L U\'',
          inverse: 'U L U L\'',
          description: 'First half of Left Sune. Mirror of Half Sune.',
        },
        {
          name: 'Half Sune',
          notation: '{half-sune}',
          moves: 'R U R\' U',
          inverse: 'U\' R U\' R\'',
          description: 'First half of Sune. Appears in many OLL/PLL algorithms.',
        },
      ],
    ],
  },
]
