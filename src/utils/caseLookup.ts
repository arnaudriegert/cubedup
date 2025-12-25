import { ollCategories, OLLCase } from '../data/ollCases'
import { pllCategories, PLLCase } from '../data/pllCases'
import { Algorithm } from '../types/algorithm'

export type CaseType = 'oll' | 'pll'

export interface CaseLookupResult {
  type: CaseType
  caseData: OLLCase | PLLCase
  algorithm: Algorithm
  caseId: string
  displayName: string
}

// Flatten OLL cases for quick lookup
const ollCasesMap = new Map<number, OLLCase>()
for (const category of ollCategories) {
  for (const entry of category.cases) {
    for (const ollCase of entry) {
      ollCasesMap.set(ollCase.number, ollCase)
    }
  }
}

// Flatten PLL cases for quick lookup (by lowercase name)
const pllCasesMap = new Map<string, PLLCase>()
for (const category of pllCategories) {
  for (const entry of category.cases) {
    for (const pllCase of entry) {
      pllCasesMap.set(pllCase.name.toLowerCase(), pllCase)
    }
  }
}

/**
 * Look up a case by ID string
 * @param caseId - Format: "oll-21" or "pll-ua"
 * @returns Case data with algorithm, or null if not found
 */
export function lookupCase(caseId: string): CaseLookupResult | null {
  const lower = caseId.toLowerCase()

  if (lower.startsWith('oll-')) {
    const num = parseInt(lower.slice(4), 10)
    if (isNaN(num)) return null

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
