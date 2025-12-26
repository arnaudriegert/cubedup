/**
 * Case and Algorithm lookup utilities
 *
 * Provides unified access to OLL/PLL cases and algorithms using the registry.
 * Supports both case-level lookups (returns first algorithm) and
 * algorithm-level lookups (returns specific variant).
 */

import { ollCategories, OLLCase } from '../data/ollCases'
import { pllCategories, PLLCase } from '../data/pllCases'
import { Algorithm, AlgorithmId } from '../types/algorithm'
import { algorithmRegistry, RegisteredAlgorithm } from '../data/algorithmRegistry'
import { getCaseIdFromAlgorithmId } from './algorithmId'

export type CaseType = 'oll' | 'pll'

export interface CaseLookupResult {
  type: CaseType
  caseData: OLLCase | PLLCase
  algorithm: Algorithm
  caseId: string
  displayName: string
}

export interface AlgorithmLookupResult {
  type: CaseType
  caseId: string
  displayName: string
  algorithm: RegisteredAlgorithm
  allAlgorithms: RegisteredAlgorithm[]
  variantIndex: number
}

// Flatten OLL cases for quick lookup (keep for backward compatibility)
const ollCasesMap = new Map<number, OLLCase>()
for (const category of ollCategories) {
  for (const entry of category.cases) {
    for (const ollCase of entry) {
      ollCasesMap.set(ollCase.number, ollCase)
    }
  }
}

// Flatten PLL cases for quick lookup (keep for backward compatibility)
const pllCasesMap = new Map<string, PLLCase>()
for (const category of pllCategories) {
  for (const entry of category.cases) {
    for (const pllCase of entry) {
      pllCasesMap.set(pllCase.name.toLowerCase(), pllCase)
    }
  }
}

/**
 * Look up a case by ID string (backward compatible)
 * @param caseId - Format: "oll-21" or "pll-ua"
 * @returns Case data with first algorithm, or null if not found
 */
export function lookupCase(caseId: string): CaseLookupResult | null {
  const lower = caseId.toLowerCase()

  if (lower.startsWith('oll-')) {
    const num = parseInt(lower.slice(4), 10)
    if (Number.isNaN(num)) return null

    const ollCase = ollCasesMap.get(num)
    if (!ollCase || ollCase.algorithms.length === 0) return null

    return {
      type: 'oll',
      caseData: ollCase,
      algorithm: ollCase.algorithms[0],
      caseId: `oll-${num}`,
      displayName: `OLL ${num}${ollCase.name ? ` - ${ollCase.name}` : ''}`,
    }
  }

  if (lower.startsWith('pll-')) {
    const name = lower.slice(4)
    const pllCase = pllCasesMap.get(name)
    if (!pllCase || pllCase.algorithms.length === 0) return null

    return {
      type: 'pll',
      caseData: pllCase,
      algorithm: pllCase.algorithms[0],
      caseId: `pll-${name}`,
      displayName: `PLL ${pllCase.name}`,
    }
  }

  return null
}

/**
 * Look up a specific algorithm by ID
 * @param algorithmId - Format: "oll-21-1" or "pll-ua-1"
 * @returns Algorithm data with all variants, or null if not found
 */
export function lookupAlgorithm(algorithmId: AlgorithmId): AlgorithmLookupResult | null {
  const algorithm = algorithmRegistry.get(algorithmId)
  if (!algorithm) return null

  const caseId = getCaseIdFromAlgorithmId(algorithmId)
  const allAlgorithms = algorithmRegistry.getAlgorithmsForCase(caseId)
  const type: CaseType = caseId.startsWith('oll-') ? 'oll' : 'pll'

  return {
    type,
    caseId,
    displayName: algorithm.displayName,
    algorithm,
    allAlgorithms,
    variantIndex: algorithm.variantIndex - 1, // 0-indexed
  }
}

/**
 * Look up algorithm by case ID and optional variant index
 * @param caseId - Format: "oll-21" or "pll-ua"
 * @param variantIndex - 0-based index (default: 0)
 */
export function lookupCaseAlgorithm(
  caseId: string,
  variantIndex: number = 0,
): AlgorithmLookupResult | null {
  const algorithms = algorithmRegistry.getAlgorithmsForCase(caseId)
  if (algorithms.length === 0) return null

  const algorithm = algorithms[variantIndex] || algorithms[0]
  const type: CaseType = caseId.startsWith('oll-') ? 'oll' : 'pll'

  return {
    type,
    caseId,
    displayName: algorithm.displayName,
    algorithm,
    allAlgorithms: algorithms,
    variantIndex: algorithm.variantIndex - 1,
  }
}

/**
 * Get all OLL case numbers
 */
export function getAllOLLNumbers(): number[] {
  return Array.from(ollCasesMap.keys()).sort((a, b) => a - b)
}

/**
 * Get all PLL case names
 */
export function getAllPLLNames(): string[] {
  return Array.from(pllCasesMap.keys())
}

/**
 * Get OLL case data by number
 */
export function getOLLCase(number: number): OLLCase | undefined {
  return ollCasesMap.get(number)
}

/**
 * Get PLL case data by name
 */
export function getPLLCase(name: string): PLLCase | undefined {
  return pllCasesMap.get(name.toLowerCase())
}
