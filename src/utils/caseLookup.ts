/**
 * Case and Algorithm lookup utilities
 *
 * Provides unified access to OLL/PLL cases and algorithms.
 * Uses the new static data format.
 */

import type {
  Algorithm, AlgorithmId, Case,
} from '../types/algorithm'
import {
  getCase, ollGroups, pllGroups, getAlgorithmsForCase,
} from '../data/cases'
import { getAlgorithm } from '../data/algorithms'
import { getCaseIdFromAlgorithmId } from './algorithmId'

export type CaseType = 'oll' | 'pll'

export interface CaseLookupResult {
  type: CaseType
  caseData: Case
  algorithm: Algorithm
  caseId: string
  displayName: string
}

/**
 * Lightweight algorithm info for variant selection
 */
export interface AlgorithmInfo {
  id: AlgorithmId
  displayName: string
  variantIndex: number
}

export interface AlgorithmLookupResult {
  type: CaseType
  caseId: string
  displayName: string
  algorithm: AlgorithmInfo
  allAlgorithms: AlgorithmInfo[]
  variantIndex: number
}

// Build lookup maps from new data format
const ollCasesMap = new Map<number, Case>()
for (const group of ollGroups) {
  for (const entry of group.cases) {
    for (const caseId of entry) {
      const caseData = getCase(caseId)
      if (caseData && caseData.number !== undefined) {
        ollCasesMap.set(caseData.number, caseData)
      }
    }
  }
}

const pllCasesMap = new Map<string, Case>()
for (const group of pllGroups) {
  for (const entry of group.cases) {
    for (const caseId of entry) {
      const caseData = getCase(caseId)
      if (caseData) {
        pllCasesMap.set(caseData.name.toLowerCase(), caseData)
      }
    }
  }
}

/**
 * Build AlgorithmInfo array for a case from new data
 */
function buildAlgorithmInfos(caseId: string): AlgorithmInfo[] {
  const caseData = getCase(caseId)
  if (!caseData) return []

  const algos = getAlgorithmsForCase(caseId)
  return algos.map((algo, index) => ({
    id: algo.id,
    displayName: index === 0
      ? `${caseData.category.toUpperCase()} ${caseData.name}`
      : `${caseData.category.toUpperCase()} ${caseData.name} (Alt ${index})`,
    variantIndex: index + 1,
  }))
}

/**
 * Look up a case by ID string
 * @param caseId - Format: "oll-21" or "pll-ua"
 * @returns Case data with first algorithm, or null if not found
 */
export function lookupCase(caseId: string): CaseLookupResult | null {
  const lower = caseId.toLowerCase()

  if (lower.startsWith('oll-')) {
    const num = parseInt(lower.slice(4), 10)
    if (Number.isNaN(num)) return null

    const ollCase = ollCasesMap.get(num)
    if (!ollCase) return null

    const algorithms = getAlgorithmsForCase(ollCase.id)
    if (algorithms.length === 0) return null

    return {
      type: 'oll',
      caseData: ollCase,
      algorithm: algorithms[0],
      caseId: ollCase.id,
      displayName: `OLL ${num}${ollCase.name ? ` - ${ollCase.name}` : ''}`,
    }
  }

  if (lower.startsWith('pll-')) {
    const name = lower.slice(4)
    const pllCase = pllCasesMap.get(name)
    if (!pllCase) return null

    const algorithms = getAlgorithmsForCase(pllCase.id)
    if (algorithms.length === 0) return null

    return {
      type: 'pll',
      caseData: pllCase,
      algorithm: algorithms[0],
      caseId: pllCase.id,
      displayName: `PLL ${pllCase.name}`,
    }
  }

  return null
}

/**
 * Look up a specific algorithm by ID using new data format
 * @param algorithmId - Format: "oll-21-1" or "pll-ua-1"
 * @returns Algorithm data with all variants, or null if not found
 */
export function lookupAlgorithm(algorithmId: AlgorithmId): AlgorithmLookupResult | null {
  const algo = getAlgorithm(algorithmId)
  if (!algo) return null

  const caseId = getCaseIdFromAlgorithmId(algorithmId)
  const caseData = getCase(caseId)
  if (!caseData) return null

  const allAlgorithms = buildAlgorithmInfos(caseId)
  const type: CaseType = caseId.startsWith('oll-') ? 'oll' : 'pll'

  // Find variant index
  const variantIndex = allAlgorithms.findIndex((a) => a.id === algorithmId)

  return {
    type,
    caseId,
    displayName: `${caseData.category.toUpperCase()} ${caseData.name}`,
    algorithm: allAlgorithms[variantIndex] || allAlgorithms[0],
    allAlgorithms,
    variantIndex,
  }
}

