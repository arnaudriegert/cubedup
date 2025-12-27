/**
 * Static algorithms map - single source of truth for all algorithms
 *
 * Algorithm IDs serve as shorthand keys:
 * - Triggers: "sexy", "left-sexy", "sledge", etc.
 * - OLL: "oll-21", "oll-21-2" (variant)
 * - PLL: "pll-ua", "pll-t"
 */

import type { Algorithm, AlgorithmId } from '../types/algorithm'

export const algorithms = new Map<AlgorithmId, Algorithm>([
  // ==========================================================================
  // CORE TRIGGERS
  // ==========================================================================
  ['sexy', {
    id: 'sexy',
    steps: [{ moves: "R U R' U'" }],
    mirror: 'left-sexy',
    tags: ['trigger', 'core'],
  }],
  ['left-sexy', {
    id: 'left-sexy',
    steps: [{ moves: "L' U' L U" }],
    mirror: 'sexy',
    tags: ['trigger', 'core'],
  }],
  ['sledge', {
    id: 'sledge',
    steps: [{ moves: "R' F R F'" }],
    mirror: 'left-sledge',
    tags: ['trigger', 'core'],
  }],
  ['left-sledge', {
    id: 'left-sledge',
    steps: [{ moves: "L F' L' F" }],
    mirror: 'sledge',
    tags: ['trigger', 'core'],
  }],

  // ==========================================================================
  // WIDE TRIGGERS
  // ==========================================================================
  ['fat-sexy', {
    id: 'fat-sexy',
    steps: [{ moves: "r U R' U'" }],
    mirror: 'left-fat-sexy',
    tags: ['trigger', 'wide'],
  }],
  ['left-fat-sexy', {
    id: 'left-fat-sexy',
    steps: [{ moves: "l' U' L U" }],
    mirror: 'fat-sexy',
    tags: ['trigger', 'wide'],
  }],
  ['fat-sledge', {
    id: 'fat-sledge',
    steps: [{ moves: "r' F R F'" }],
    mirror: 'left-fat-sledge',
    tags: ['trigger', 'wide'],
  }],
  ['left-fat-sledge', {
    id: 'left-fat-sledge',
    steps: [{ moves: "l F' L' F" }],
    mirror: 'fat-sledge',
    tags: ['trigger', 'wide'],
  }],

  // ==========================================================================
  // SUNE FAMILY
  // ==========================================================================
  ['chair', {
    id: 'chair',
    steps: [{ moves: "R U2 R' U' R U' R'" }],
    inverse: 'sune',
    mirror: 'left-chair',
    tags: ['trigger'],
  }],
  ['sune', {
    id: 'sune',
    steps: [{ moves: "R U R' U R U2 R'" }],
    inverse: 'chair',
    mirror: 'left-sune',
    tags: ['trigger', 'sune-family'],
  }],
  ['left-chair', {
    id: 'left-chair',
    steps: [{ moves: "L' U2 L U L' U L" }],
    inverse: 'left-sune',
    mirror: 'chair',
    tags: ['trigger'],
  }],
  ['left-sune', {
    id: 'left-sune',
    steps: [{ moves: "L' U' L U' L' U2 L" }],
    inverse: 'left-chair',
    mirror: 'sune',
    tags: ['trigger', 'sune-family'],
  }],
  ['half-sune', {
    id: 'half-sune',
    steps: [{ moves: "R U R' U" }],
    mirror: 'left-half-sune',
    tags: ['trigger', 'sune-family'],
  }],
  ['left-half-sune', {
    id: 'left-half-sune',
    steps: [{ moves: "L' U' L U'" }],
    mirror: 'half-sune',
    tags: ['trigger', 'sune-family'],
  }],
  ['fat-sune', {
    id: 'fat-sune',
    steps: [{ moves: "r U R' U R U2 r'" }],
    inverse: 'fat-chair',
    mirror: 'left-fat-sune',
    tags: ['trigger', 'wide'],
  }],
  ['fat-chair', {
    id: 'fat-chair',
    steps: [{ moves: "r U2 R' U' R U' r'" }],
    inverse: 'fat-sune',
    mirror: 'left-fat-chair',
    tags: ['trigger'],
  }],
  ['left-fat-sune', {
    id: 'left-fat-sune',
    steps: [{ moves: "l' U' L U' L' U2 l" }],
    inverse: 'left-fat-chair',
    mirror: 'fat-sune',
    tags: ['trigger', 'wide'],
  }],
  ['left-fat-chair', {
    id: 'left-fat-chair',
    steps: [{ moves: "l' U2 L U L' U l" }],
    inverse: 'left-fat-sune',
    mirror: 'fat-chair',
    tags: ['trigger'],
  }],
  ['front-fat-sune', {
    id: 'front-fat-sune',
    steps: [{ moves: "r' U' R U' R' U2 r" }],
    mirror: 'left-front-fat-sune',
    tags: ['trigger', 'wide'],
  }],
  ['left-front-fat-sune', {
    id: 'left-front-fat-sune',
    steps: [{ moves: "l U L' U L U2 l'" }],
    mirror: 'front-fat-sune',
    tags: ['trigger', 'wide'],
  }],

  // ==========================================================================
  // OLL - SOLVED CROSS (21-27)
  // ==========================================================================
  ['oll-21', {
    id: 'oll-21',
    steps: [
      { ref: 'chair' },
      { ref: 'chair' },
    ],
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-21-2', {
    id: 'oll-21-2',
    steps: [
      { moves: 'F' },
      { ref: 'sexy', repeat: 3 },
      { moves: "F'" },
    ],
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-22', {
    id: 'oll-22',
    steps: [
      { ref: 'chair' },
      { moves: "U'" },
      { ref: 'chair' },
    ],
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-23', {
    id: 'oll-23',
    steps: [
      { ref: 'chair' },
      { ref: 'left-chair' },
    ],
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-24', {
    id: 'oll-24',
    steps: [
      { ref: 'fat-sexy' },
      { ref: 'fat-sledge' },
    ],
    inverse: 'oll-25',
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-24-2', {
    id: 'oll-24-2',
    steps: [
      { moves: 'z' },
      { ref: 'chair' },
      { ref: 'left-chair' },
      { moves: "z'" },
    ],
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-25', {
    id: 'oll-25',
    steps: [
      { ref: 'fat-sledge', inverse: true },
      { ref: 'fat-sexy', inverse: true },
    ],
    inverse: 'oll-24',
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-25-2', {
    id: 'oll-25-2',
    steps: [
      { moves: 'F' },
      { ref: 'chair' },
      { ref: 'left-chair' },
      { moves: "F'" },
    ],
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-26', {
    id: 'oll-26',
    steps: [
      { ref: 'chair' },
    ],
    tags: ['oll', 'solved-cross'],
  }],
  ['oll-27', {
    id: 'oll-27',
    steps: [
      { ref: 'left-chair' },
    ],
    tags: ['oll', 'solved-cross'],
  }],

  // ==========================================================================
  // OLL - T SHAPES (33, 45)
  // ==========================================================================
  ['oll-33', {
    id: 'oll-33',
    steps: [
      { ref: 'sexy' },
      { ref: 'sledge' },
    ],
    inverse: 'oll-37',
    tags: ['oll', 't-shapes'],
  }],
  ['oll-45', {
    id: 'oll-45',
    steps: [
      { moves: 'F' },
      { ref: 'sexy' },
      { moves: "F'" },
    ],
    inverse: 'oll-44',
    tags: ['oll', 't-shapes'],
  }],

  // ==========================================================================
  // OLL - FISH (37)
  // ==========================================================================
  ['oll-37', {
    id: 'oll-37',
    steps: [
      { ref: 'sledge', inverse: true },
      { ref: 'sexy', inverse: true },
    ],
    inverse: 'oll-33',
    tags: ['oll', 'fish'],
  }],

  // ==========================================================================
  // OLL - P SHAPES (31, 32, 43, 44)
  // ==========================================================================
  ['oll-31', {
    id: 'oll-31',
    steps: [
      { moves: "S'" },
      { ref: 'left-sexy' },
      { ref: 'left-sledge' },
      { moves: 'S' },
    ],
    tags: ['oll', 'p-shapes'],
  }],
  ['oll-32', {
    id: 'oll-32',
    steps: [
      { moves: 'S' },
      { ref: 'sexy' },
      { ref: 'sledge' },
      { moves: "S'" },
    ],
    tags: ['oll', 'p-shapes'],
  }],
  ['oll-43', {
    id: 'oll-43',
    steps: [
      { moves: "F'" },
      { ref: 'left-sexy', inverse: true },
      { moves: 'F' },
    ],
    tags: ['oll', 'p-shapes'],
  }],
  ['oll-44', {
    id: 'oll-44',
    steps: [
      { moves: 'F' },
      { ref: 'sexy', inverse: true },
      { moves: "F'" },
    ],
    inverse: 'oll-45',
    tags: ['oll', 'p-shapes'],
  }],

  // ==========================================================================
  // OLL - L SHAPES (47, 48)
  // ==========================================================================
  ['oll-47', {
    id: 'oll-47',
    steps: [
      { moves: "F'" },
      { ref: 'left-sexy', repeat: 2 },
      { moves: 'F' },
    ],
    tags: ['oll', 'l-shapes'],
  }],
  ['oll-48', {
    id: 'oll-48',
    steps: [
      { moves: 'F' },
      { ref: 'sexy', repeat: 2 },
      { moves: "F'" },
    ],
    inverse: 'oll-51',
    tags: ['oll', 'l-shapes'],
  }],

  // ==========================================================================
  // OLL - SMALL LIGHTNING (7, 8)
  // ==========================================================================
  ['oll-7', {
    id: 'oll-7',
    steps: [
      { ref: 'fat-sune' },
    ],
    inverse: 'oll-6',
    tags: ['oll', 'small-lightning'],
  }],
  ['oll-8', {
    id: 'oll-8',
    steps: [
      { ref: 'left-fat-sune' },
    ],
    inverse: 'oll-5',
    tags: ['oll', 'small-lightning'],
  }],

  // ==========================================================================
  // OLL - SQUARE (5, 6)
  // ==========================================================================
  ['oll-5', {
    id: 'oll-5',
    steps: [
      { ref: 'left-fat-chair' },
    ],
    inverse: 'oll-8',
    tags: ['oll', 'square'],
  }],
  ['oll-6', {
    id: 'oll-6',
    steps: [
      { ref: 'fat-chair' },
    ],
    inverse: 'oll-7',
    tags: ['oll', 'square'],
  }],

  // ==========================================================================
  // OLL - SOLVED CORNERS (28, 57)
  // ==========================================================================
  ['oll-28', {
    id: 'oll-28',
    steps: [
      { ref: 'fat-sexy' },
      { moves: 'M' },
      { ref: 'sexy', inverse: true },
    ],
    inverse: 'oll-57',
    tags: ['oll', 'solved-corners'],
  }],
  ['oll-57', {
    id: 'oll-57',
    steps: [
      { ref: 'sexy' },
      { moves: "M'" },
      { ref: 'fat-sexy', inverse: true },
    ],
    inverse: 'oll-28',
    tags: ['oll', 'solved-corners'],
  }],

  // OLL - DOTS (no edges oriented)
  ['oll-1', {
    id: 'oll-1',
    steps: [
      { moves: "R U² R'" },
      { ref: 'sledge' },
      { moves: 'U²' },
      { ref: 'sledge' },
    ],
    tags: ['oll', 'dots'],
  }],
  ['oll-2', {
    id: 'oll-2',
    steps: [
      { moves: 'F' },
      { ref: 'sexy' },
      { moves: "F'" },
      { moves: 'f' },
      { ref: 'sexy' },
      { moves: '' },
      { moves: "f'" },
    ],
    tags: ['oll', 'dots'],
  }],
  ['oll-3', {
    id: 'oll-3',
    steps: [
      { moves: "f'" },
      { ref: 'left-sexy' },
      { moves: 'f' },
      { moves: 'U' },
      { moves: 'F' },
      { ref: 'sexy' },
      { moves: "F'" },
    ],
    tags: ['oll', 'dots'],
  }],
  ['oll-4', {
    id: 'oll-4',
    steps: [
      { moves: 'f' },
      { ref: 'sexy' },
      { moves: "f'" },
      { moves: 'U' },
      { moves: 'F' },
      { ref: 'sexy' },
      { moves: "F'" },
    ],
    tags: ['oll', 'dots'],
  }],
  ['oll-17-1', {
    id: 'oll-17-1',
    steps: [
      { ref: 'sledge', inverse: true },
      { moves: 'M' },
      { ref: 'sexy', inverse: true },
      { moves: "U' M'" },
    ],
    inverse: 'oll-19',
    tags: ['oll', 'dots'],
  }],
  [
    'oll-17-2', {
      id: 'oll-17-2',
      steps: [
        { ref: 'half-sune' },
        { ref: 'sledge' },
        { moves: 'U2' },
        { ref: 'sledge' },
      ],
    },
  ],
  ['oll-18', {
    id: 'oll-18',
    steps: [
      { ref: 'fat-sune' },
      { ref: 'front-fat-sune' },
    ],
    tags: ['oll', 'dots'],
  }],
  ['oll-19', {
    id: 'oll-19',
    steps: [
      { moves: 'M U' },
      { ref: 'sexy' },
      { moves: "M'" },
      { ref: 'sledge' },
    ],
    inverse: 'oll-17',
    tags: ['oll', 'dots'],
  }],
  ['oll-20', {
    id: 'oll-20',
    steps: [
      { ref: 'fat-sexy' },
      { moves: 'M²' },
      { ref: 'sexy', inverse: true },
      { moves: "U' M'" },
    ],
    tags: ['oll', 'dots'],
  }],

  // OLL - FISH
  ['oll-9', {
    id: 'oll-9',
    steps: [
      { ref: 'sexy' },
      { ref: 'sledge' },
      { moves: 'F' },
      { ref: 'sexy' },
      { moves: "F'" },
    ],
    inverse: 'oll-13',
    tags: ['oll', 'fish'],
  }],
  ['oll-10', {
    id: 'oll-10',
    steps: [
      { ref: 'left-sexy' },
      { ref: 'left-sledge' },
      { moves: "F'" },
      { ref: 'left-sexy' },
      { moves: 'F' },
    ],
    inverse: 'oll-14',
    tags: ['oll', 'fish'],
  }],
  ['oll-35', {
    id: 'oll-35',
    steps: [
      { moves: "R U² R'" },
      { ref: 'sledge' },
      { moves: "R U² R'" },
    ],
    tags: ['oll', 'fish'],
  }],

  // OLL - SMALL LIGHTNING
  ['oll-11', {
    id: 'oll-11',
    steps: [
      { moves: 'M' },
      { ref: 'sune' },
      { moves: "U M'" },
    ],
    tags: ['oll', 'small-lightning'],
  }],
  ['oll-12', {
    id: 'oll-12',
    steps: [
      { moves: 'M' },
      { ref: 'left-sune' },
      { moves: "U' M'" },
    ],
    tags: ['oll', 'small-lightning'],
  }],

  // OLL - KNIGHT MOVE
  ['oll-13', {
    id: 'oll-13',
    steps: [
      { moves: 'F' },
      { ref: 'sexy', inverse: true },
      { moves: "F'" },
      { ref: 'sledge', inverse: true },
      { ref: 'sexy', inverse: true },
    ],
    inverse: 'oll-9',
    tags: ['oll', 'knight-move'],
  }],
  ['oll-14', {
    id: 'oll-14',
    steps: [
      { moves: "F'" },
      { ref: 'left-sexy', inverse: true },
      { moves: 'F' },
      { ref: 'left-sledge', inverse: true },
      { ref: 'left-sexy', inverse: true },
    ],
    inverse: 'oll-10',
    tags: ['oll', 'knight-move'],
  }],
  ['oll-15', {
    id: 'oll-15',
    steps: [
      { moves: "l' U' l" },
      { ref: 'left-sexy' },
      { moves: "l' U l" },
    ],
    tags: ['oll', 'knight-move'],
  }],
  ['oll-16', {
    id: 'oll-16',
    steps: [
      { moves: "r U r'" },
      { ref: 'sexy' },
      { moves: "r U' r'" },
    ],
    tags: ['oll', 'knight-move'],
  }],

  // OLL - AWKWARD
  ['oll-29', {
    id: 'oll-29',
    steps: [
      { moves: 'M U' },
      { ref: 'sexy' },
      { ref: 'sledge' },
      { moves: "M'" },
    ],
    tags: ['oll', 'awkward'],
  }],
  ['oll-30', {
    id: 'oll-30',
    steps: [
      { moves: "M U'" },
      { ref: 'left-sexy' },
      { ref: 'left-sledge' },
      { moves: "M'" },
    ],
    tags: ['oll', 'awkward'],
  }],
  ['oll-41', {
    id: 'oll-41',
    steps: [
      { ref: 'sune' },
      { moves: 'F' },
      { ref: 'sexy' },
      { moves: "F'" },
    ],
    tags: ['oll', 'awkward'],
  }],
  ['oll-42', {
    id: 'oll-42',
    steps: [
      { ref: 'left-sune' },
      { moves: "F'" },
      { ref: 'left-sexy' },
      { moves: 'F' },
    ],
    tags: ['oll', 'awkward'],
  }],

  // OLL - C SHAPES
  ['oll-34', {
    id: 'oll-34',
    steps: [
      { ref: 'sexy' },
      { moves: "B'" },
      { ref: 'sledge' },
      { moves: 'B' },
    ],
    tags: ['oll', 'c-shapes'],
  }],
  ['oll-46', {
    id: 'oll-46',
    steps: [
      { moves: "R' U'" },
      { ref: 'sledge' },
      { moves: 'U R' },
    ],
    tags: ['oll', 'c-shapes'],
  }],

  // OLL - W SHAPES
  ['oll-36', {
    id: 'oll-36',
    steps: [
      { ref: 'left-half-sune' },
      { moves: "L' U L U" },
      { ref: 'left-sledge' },
    ],
    tags: ['oll', 'w-shapes'],
  }],
  ['oll-38', {
    id: 'oll-38',
    steps: [
      { ref: 'half-sune' },
      { moves: "R U' R' U'" },
      { ref: 'sledge' },
    ],
    tags: ['oll', 'w-shapes'],
  }],

  // OLL - BIG LIGHTNING
  ['oll-39', {
    id: 'oll-39',
    steps: [
      { moves: "L F'" },
      { ref: 'left-sexy' },
      { moves: "F U' L'" },
    ],
    tags: ['oll', 'big-lightning'],
  }],
  ['oll-40', {
    id: 'oll-40',
    steps: [
      { moves: "R' F" },
      { ref: 'sexy' },
      { moves: "F' U R" },
    ],
    tags: ['oll', 'big-lightning'],
  }],

  // OLL - L SHAPES
  ['oll-49', {
    id: 'oll-49',
    steps: [
      { moves: "l U' l'" },
      { moves: "l' U l" },
      { moves: "l U l'" },
      { moves: "l' U' l" },
    ],
    tags: ['oll', 'l-shapes'],
  }],
  ['oll-50', {
    id: 'oll-50',
    steps: [
      { moves: "r' U r" },
      { moves: "r U' r'" },
      { moves: "r' U' r" },
      { moves: "r U r'" },
    ],
    tags: ['oll', 'l-shapes'],
  }],
  ['oll-53', {
    id: 'oll-53',
    steps: [
      { moves: "r'" },
      { moves: "U' R U' R'" },
      { ref: 'sexy', inverse: true },
      { moves: 'U² r' },
    ],
    tags: ['oll', 'l-shapes'],
  }],
  ['oll-54', {
    id: 'oll-54',
    steps: [
      { moves: 'l' },
      { moves: "U L' U L" },
      { ref: 'left-sexy', inverse: true },
      { moves: "U² l'" },
    ],
    tags: ['oll', 'l-shapes'],
  }],

  // OLL - LINE
  ['oll-51', {
    id: 'oll-51',
    steps: [
      { moves: 'F' },
      { ref: 'sexy', inverse: true, repeat: 2 },
      { moves: "F'" },
    ],
    inverse: 'oll-48',
    tags: ['oll', 'line'],
  }],
  ['oll-52', {
    id: 'oll-52',
    steps: [
      { moves: "R U R' U" },
      { moves: "R d'" },
      { moves: "R U' R' F'" },
    ],
    tags: ['oll', 'line'],
  }],
  ['oll-55', {
    id: 'oll-55',
    steps: [
      { moves: "R' F" },
      { ref: 'sexy', inverse: true },
      { moves: "R' F'" },
      { moves: 'R' },
      { ref: 'sexy' },
      { moves: '' },
      { moves: 'R' },
    ],
    tags: ['oll', 'line'],
  }],
  ['oll-56', {
    id: 'oll-56',
    steps: [
      { moves: "r' U' r" },
      { moves: "U' R'" },
      { ref: 'sexy', inverse: true },
      { moves: 'U R' },
      { moves: "r' U r" },
    ],
    tags: ['oll', 'line'],
  }],

  // ==========================================================================
  // PLL - EDGES ONLY
  // ==========================================================================
  ['pll-ua', {
    id: 'pll-ua',
    steps: [
      { moves: 'R2' },
      { moves: "U' R' U' R U R U R U' R" },
    ],
    tags: ['pll', 'edges-only'],
  }],
  ['pll-ub', {
    id: 'pll-ub',
    steps: [
      { moves: 'L2' },
      { moves: "U L U L' U' L' U' L' U L'" },
    ],
    tags: ['pll', 'edges-only'],
  }],
  ['pll-h', {
    id: 'pll-h',
    steps: [
      { moves: 'M2' },
      { moves: "U' M2" },
      { moves: 'U2 M2' },
      { moves: "U' M2" },
    ],
    tags: ['pll', 'edges-only'],
  }],
  ['pll-z', {
    id: 'pll-z',
    steps: [
      { moves: "M' U'" },
      { moves: "M2 U' M2" },
      { moves: "U' M'" },
      { moves: 'U2 M2' },
    ],
    tags: ['pll', 'edges-only'],
  }],

  // ==========================================================================
  // PLL - CORNERS ONLY
  // ==========================================================================
  ['pll-aa', {
    id: 'pll-aa',
    steps: [
      { moves: 'L2 B2' },
      { moves: "L' F' L" },
      { moves: "B2 L' F L'" },
    ],
    tags: ['pll', 'corners-only'],
  }],
  ['pll-ab', {
    id: 'pll-ab',
    steps: [
      { moves: 'R2 B2' },
      { moves: "R F R'" },
      { moves: "B2 R F' R" },
    ],
    tags: ['pll', 'corners-only'],
  }],
  ['pll-e', {
    id: 'pll-e',
    steps: [
      { moves: "r' U r F' r' U' r F" },
      { moves: "r' U' r F' r' U r F" },
    ],
    tags: ['pll', 'corners-only'],
  }],

  // ==========================================================================
  // PLL - ADJACENT CORNERS
  // ==========================================================================
  ['pll-t', {
    id: 'pll-t',
    steps: [
      { ref: 'sexy' },
      { ref: 'sledge' },
      { moves: 'F' },
      { moves: "R U' R' U' R U R'" },
      { moves: "F'" },
    ],
    tags: ['pll', 'adjacent-corners'],
  }],
  ['pll-f', {
    id: 'pll-f',
    steps: [
      { moves: "R'" },
      { ref: 'sledge' },
      { moves: "R'" },
      { moves: "U' F' U F" },
      { moves: 'R' },
      { ref: 'sexy' },
      { moves: 'R' },
    ],
    tags: ['pll', 'adjacent-corners'],
  }],
  ['pll-ja', {
    id: 'pll-ja',
    steps: [
      { moves: "L' U' L F" },
      { ref: 'left-sexy' },
      { moves: "L F' L'" },
      { moves: "L' U L" },
    ],
    tags: ['pll', 'adjacent-corners'],
  }],
  ['pll-jb', {
    id: 'pll-jb',
    steps: [
      { moves: "R U R' F'" },
      { ref: 'sexy' },
      { moves: "R' F R" },
      { moves: "R U' R'" },
    ],
    tags: ['pll', 'adjacent-corners'],
  }],
  ['pll-ra', {
    id: 'pll-ra',
    steps: [
      { moves: "L U2 L' U2" },
      { moves: "L F'" },
      { ref: 'left-sexy' },
      { moves: 'L F L2' },
    ],
    tags: ['pll', 'adjacent-corners'],
  }],
  ['pll-rb', {
    id: 'pll-rb',
    steps: [
      { moves: "R' U2 R U2" },
      { moves: "R' F" },
      { ref: 'sexy' },
      { moves: "R' F' R2" },
    ],
    tags: ['pll', 'adjacent-corners'],
  }],

  // ==========================================================================
  // PLL - DIAGONAL CORNERS
  // ==========================================================================
  ['pll-y', {
    id: 'pll-y',
    steps: [
      { moves: 'F' },
      { moves: "R U' R' U' R U R'" },
      { moves: "F'" },
      { ref: 'sexy' },
      { ref: 'sledge' },
    ],
    tags: ['pll', 'diagonal-corners'],
  }],
  ['pll-v', {
    id: 'pll-v',
    steps: [
      { moves: "R' U R'" },
      { moves: "U' y R' F'" },
      { moves: "R2 U' R' U R'" },
      { moves: 'F R F' },
    ],
    tags: ['pll', 'diagonal-corners'],
  }],
  ['pll-na', {
    id: 'pll-na',
    steps: [
      { moves: "L U'" },
      { ref: 'left-sledge' },
      { moves: "L' U L" },
      { moves: "F U' F'" },
      { ref: 'left-sexy' },
      { moves: "L'" },
    ],
    tags: ['pll', 'diagonal-corners'],
  }],
  ['pll-nb', {
    id: 'pll-nb',
    steps: [
      { moves: "R' U" },
      { ref: 'sledge' },
      { moves: "R U' R'" },
      { moves: "F' U F" },
      { ref: 'sexy' },
      { moves: 'R' },
    ],
    tags: ['pll', 'diagonal-corners'],
  }],

  // ==========================================================================
  // PLL - G PERMUTATIONS
  // ==========================================================================
  ['pll-ga', {
    id: 'pll-ga',
    steps: [
      { moves: 'L2 F2' },
      { moves: "L' U2 L' U2 L F'" },
      { ref: 'left-sexy' },
      { moves: "L F' L2" },
    ],
    tags: ['pll', 'g-perms'],
  }],
  ['pll-gb', {
    id: 'pll-gb',
    steps: [
      { moves: "L2 F L'" },
      { ref: 'left-sexy', inverse: true },
      { moves: "F L' U2 L U2 L" },
      { moves: 'F2 L2' },
    ],
    tags: ['pll', 'g-perms'],
  }],
  ['pll-gc', {
    id: 'pll-gc',
    steps: [
      { moves: 'R2 F2' },
      { moves: "R U2 R U2 R' F" },
      { ref: 'sexy' },
      { moves: "R' F R2" },
    ],
    tags: ['pll', 'g-perms'],
  }],
  ['pll-gd', {
    id: 'pll-gd',
    steps: [
      { moves: "R2 F' R" },
      { ref: 'sexy', inverse: true },
      { moves: "F' R U2 R' U2 R'" },
      { moves: 'F2 R2' },
    ],
    tags: ['pll', 'g-perms'],
  }],
])

// ==========================================================================
// Helper functions
// ==========================================================================

/**
 * Get an algorithm by ID.
 */
export function getAlgorithm(id: AlgorithmId): Algorithm | undefined {
  return algorithms.get(id.toLowerCase())
}

// getAlgorithmsForCase is now in cases.ts to avoid circular dependencies

/**
 * Get all algorithms with a specific tag.
 */
export function getAlgorithmsByTag(tag: string): Algorithm[] {
  return Array.from(algorithms.values())
    .filter((algo) => algo.tags?.includes(tag))
}

/**
 * Get all trigger algorithms.
 */
export function getTriggers(): Algorithm[] {
  return getAlgorithmsByTag('trigger')
}

/**
 * Get triggers for a category tag, paired as [left, right] mirrors.
 */
export function getTriggerPairsByTag(tag: string): [Algorithm, Algorithm][] {
  const triggers = getTriggers().filter((t) => t.tags?.includes(tag))
  const pairs: [Algorithm, Algorithm][] = []
  const seen = new Set<string>()

  for (const trigger of triggers) {
    if (seen.has(trigger.id)) continue

    if (trigger.mirror) {
      const mirror = getAlgorithm(trigger.mirror)
      if (mirror) {
        seen.add(trigger.id)
        seen.add(mirror.id)
        // Left-hand triggers start with "left-"
        if (trigger.id.startsWith('left-')) {
          pairs.push([trigger, mirror])
        } else {
          pairs.push([mirror, trigger])
        }
      }
    }
  }

  return pairs
}

/**
 * Get all OLL algorithms.
 */
export function getOLLAlgorithms(): Algorithm[] {
  return getAlgorithmsByTag('oll')
}

/**
 * Get all PLL algorithms.
 */
export function getPLLAlgorithms(): Algorithm[] {
  return getAlgorithmsByTag('pll')
}
