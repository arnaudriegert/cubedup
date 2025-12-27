// Algorithm types - shared across OLL, PLL, F2L, and Triggers

// Algorithm ID is a string key: "sexy", "oll-21", "oll-21-2", "pll-ua"
export type AlgorithmId = string

// Case ID is a string key: "oll-21", "pll-ua"
export type CaseId = string

// A step is either raw moves OR a reference to another algorithm
export type AlgorithmStep =
  | { moves: string }
  | { ref: AlgorithmId; repeat?: number; inverse?: boolean } // inverse: true inverts the referenced algorithm

// Type guards for AlgorithmStep
export function isMovesStep(step: AlgorithmStep): step is { moves: string } {
  return 'moves' in step
}

export function isRefStep(
  step: AlgorithmStep,
): step is { ref: AlgorithmId; repeat?: number; inverse?: boolean } {
  return 'ref' in step
}

export interface Algorithm {
  id: AlgorithmId
  steps: AlgorithmStep[]
  inverse?: AlgorithmId // Inverse algorithm reference
  mirror?: AlgorithmId // Left/right symmetry
  tags?: string[] // ["trigger", "2-look", "solved-cross"]
}

export type CaseCategory = 'oll' | 'pll'

export interface Case {
  id: CaseId
  name: string
  category: CaseCategory
  number?: number // OLL: 1-57
  inverseOf?: CaseId
  algorithms?: AlgorithmId[] // Algorithms that solve this case
}

// Case entry: single case or pair (for mirror/inverse relationships displayed side-by-side)
export type CaseEntry = [CaseId] | [CaseId, CaseId]

export interface CaseGroup {
  name: string
  description?: string
  cases: CaseEntry[]
}

// ==========================================================================
// PLL-specific types for arrow overlay
// ==========================================================================

// Positions on the last layer grid
export type CornerPosition = 'FL' | 'FR' | 'BL' | 'BR'
export type EdgePosition = 'F' | 'R' | 'B' | 'L'

// A cycle describes pieces that rotate through positions
// 2 positions = swap, 3 positions = 3-cycle
export interface Cycle {
  positions: (CornerPosition | EdgePosition)[]
  direction?: 'cw' | 'ccw' // Visual hint for 3-cycles
}

export interface PLLSwapInfo {
  corners?: Cycle[]
  edges?: Cycle[]
  description: string
}

