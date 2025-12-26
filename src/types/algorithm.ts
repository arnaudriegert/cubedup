// Algorithm types - shared across OLL, PLL, F2L, and Triggers

import type { AlgorithmId } from '../utils/algorithmId'

// Re-export for convenience
export type { AlgorithmId } from '../utils/algorithmId'

export interface AlgorithmStep {
  moves: string           // The raw moves for this segment
  trigger?: string        // Optional trigger notation e.g., '{sexy}'
  triggerId?: AlgorithmId // Optional type-safe reference to trigger algorithm
}

export interface Algorithm {
  id?: AlgorithmId                // Unique algorithm identifier
  decomposition: AlgorithmStep[]  // Source of truth - full is built from this
  simplifiedResult?: string       // Optional simplified result with cancellations marked
  inverseOf?: AlgorithmId         // Algorithm-level inverse relationship
  caseId?: string                 // Back-reference to parent case e.g., "oll-21"
}

// Algorithm category for organizing cases
export type AlgorithmCategory = 'OLL' | 'PLL' | 'F2L' | 'Trigger'

// Metadata for algorithm identification and search
export interface AlgorithmMetadata {
  id: string              // e.g., "oll-21" or "pll-ua"
  category: AlgorithmCategory
  caseNumber?: number     // OLL: 1-57
  caseName?: string       // PLL: "Ua", "T", etc.
}
