// Algorithm types - shared across OLL, PLL, F2L, and Triggers

export interface AlgorithmStep {
  moves: string           // The raw moves for this segment
  trigger?: string        // Optional trigger notation e.g., '{sexy}'
}

export interface Algorithm {
  decomposition: AlgorithmStep[]  // Source of truth - full is built from this
  simplifiedResult?: string       // Optional simplified result with cancellations marked
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
