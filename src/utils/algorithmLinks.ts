/**
 * Algorithm URL utilities
 *
 * Supports both case-level and algorithm-level URLs:
 * - Case: /playground?case=oll-21 (uses first algorithm)
 * - Algorithm: /playground?algo=oll-21-1 (specific variant)
 * - Notation: /playground?notation=RUR'U' (raw moves)
 */

import type { AlgorithmId } from '../types/algorithm'
import { parseAlgorithmId } from './algorithmId'

/**
 * Generate Playground URL for a specific algorithm
 * @param algorithmId - Format: "oll-21-1" or "pll-ua-1"
 */
export function getPlaygroundUrlForAlgorithm(algorithmId: AlgorithmId): string {
  return `/playground?algo=${encodeURIComponent(algorithmId)}`
}

/**
 * Generate Playground URL for a case (uses first algorithm)
 * @param caseId - Format: "oll-21" or "pll-ua"
 */
export function getPlaygroundUrl(caseId: string): string {
  return `/playground?case=${encodeURIComponent(caseId)}`
}

/**
 * Generate Playground URL for raw algorithm notation
 * @param notation - Algorithm notation like "R U R' U'"
 */
export function getPlaygroundUrlForNotation(notation: string): string {
  return `/playground?notation=${encodeURIComponent(notation)}`
}

/**
 * Generate URL back to a case's learning page
 * @param idOrCaseId - Format: "oll-21-1" (algorithm ID) or "oll-21" (case ID)
 */
export function getCasePageUrl(idOrCaseId: string): string {
  const lower = idOrCaseId.toLowerCase()

  // Check if this looks like an algorithm ID (has variant index)
  let caseId: string
  let variantIndex: number | undefined

  try {
    const parsed = parseAlgorithmId(lower)
    caseId = `${parsed.category}-${parsed.caseKey}`
    variantIndex = parsed.variantIndex
  } catch {
    // Not a valid algorithm ID, treat as case ID
    caseId = lower
  }

  if (caseId.startsWith('oll-')) {
    const num = caseId.slice(4)
    const algoParam = variantIndex && variantIndex > 1 ? `&algo=${variantIndex}` : ''
    return `/oll/detailed?select=${num}${algoParam}`
  }

  if (caseId.startsWith('pll-')) {
    const name = caseId.slice(4)
    const algoParam = variantIndex && variantIndex > 1 ? `&algo=${variantIndex}` : ''
    return `/pll/detailed?select=${name}${algoParam}`
  }

  return '/oll'
}

/**
 * Parse Playground URL parameters
 */
export function parsePlaygroundUrl(searchParams: URLSearchParams): {
  algorithmId?: AlgorithmId
  caseId?: string
  notation?: string
} {
  const algo = searchParams.get('algo')
  const caseParam = searchParams.get('case')
  const notation = searchParams.get('notation')

  if (algo) {
    // Check if it's a full algorithm ID (has variant) or just a case ID
    try {
      const parsed = parseAlgorithmId(algo)
      if (parsed.variantIndex) {
        return { algorithmId: algo }
      }
      // No variant index, treat as case ID with -1 appended
      return {
        algorithmId: `${algo}-1`,
        caseId: algo,
      }
    } catch {
      // Invalid format, might be raw notation
      return { notation: algo }
    }
  }

  if (caseParam) {
    // Convert case to algorithm ID (first variant)
    return {
      algorithmId: `${caseParam}-1`,
      caseId: caseParam,
    }
  }

  if (notation) {
    return { notation: decodeURIComponent(notation) }
  }

  return {}
}
