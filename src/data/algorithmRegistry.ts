/**
 * Central Algorithm Registry
 *
 * Provides unified access to all algorithms across OLL, PLL, and Triggers.
 * Algorithms are indexed by unique IDs and support lookups, inverse relationships,
 * and trigger expansion.
 */

import type { Algorithm, AlgorithmId } from '../types/algorithm'
import { buildAlgorithmId } from '../utils/algorithmId'
import { ollCategories, type OLLCase } from './ollCases'
import { pllCategories, type PLLCase } from './pllCases'
import { triggerCategories, type Trigger } from './triggers'
import { buildFullFromSteps } from '../utils/algorithmTokenizer'

export interface RegisteredAlgorithm extends Algorithm {
  id: AlgorithmId
  caseId: string
  category: 'OLL' | 'PLL' | 'Trigger'
  displayName: string
  variantIndex: number
}

export interface CaseInfo {
  type: 'oll' | 'pll'
  caseId: string
  displayName: string
  algorithmIds: AlgorithmId[]
}

class AlgorithmRegistryClass {
  private algorithms: Map<AlgorithmId, RegisteredAlgorithm> = new Map()
  private caseToAlgorithms: Map<string, AlgorithmId[]> = new Map()
  private triggerByNotation: Map<string, AlgorithmId> = new Map()
  private ollCaseMap: Map<number, OLLCase> = new Map()
  private pllCaseMap: Map<string, PLLCase> = new Map()

  constructor() {
    this.initializeFromData()
  }

  /**
   * Get algorithm by ID
   */
  get(id: AlgorithmId): RegisteredAlgorithm | undefined {
    return this.algorithms.get(id.toLowerCase())
  }

  /**
   * Get all algorithms for a case
   */
  getAlgorithmsForCase(caseId: string): RegisteredAlgorithm[] {
    const ids = this.caseToAlgorithms.get(caseId.toLowerCase()) || []
    return ids.map(id => this.algorithms.get(id)!).filter(Boolean)
  }

  /**
   * Get case info by case ID
   */
  getCaseInfo(caseId: string): CaseInfo | null {
    const lower = caseId.toLowerCase()
    const algorithmIds = this.caseToAlgorithms.get(lower)
    if (!algorithmIds || algorithmIds.length === 0) return null

    const firstAlgo = this.algorithms.get(algorithmIds[0])
    if (!firstAlgo) return null

    return {
      type: lower.startsWith('oll-') ? 'oll' : 'pll',
      caseId: lower,
      displayName: firstAlgo.displayName.replace(/ \(Alt \d+\)$/, ''),
      algorithmIds,
    }
  }

  /**
   * Get inverse algorithm
   */
  getInverse(id: AlgorithmId): RegisteredAlgorithm | undefined {
    const algo = this.algorithms.get(id.toLowerCase())
    if (algo?.inverseOf) {
      return this.algorithms.get(algo.inverseOf.toLowerCase())
    }
    return undefined
  }

  /**
   * Expand trigger notation to moves
   */
  expandTrigger(notation: string): string | undefined {
    // Handle both {sexy} and sexy formats
    const key = notation.replace(/[{}]/g, '').toLowerCase()
    const triggerId = this.triggerByNotation.get(key)
    if (triggerId) {
      const trigger = this.algorithms.get(triggerId)
      if (trigger) {
        return buildFullFromSteps(trigger.decomposition)
      }
    }
    return undefined
  }

  /**
   * Get trigger algorithm by notation
   */
  getTriggerByNotation(notation: string): RegisteredAlgorithm | undefined {
    const key = notation.replace(/[{}]/g, '').toLowerCase()
    const triggerId = this.triggerByNotation.get(key)
    if (triggerId) {
      return this.algorithms.get(triggerId)
    }
    return undefined
  }

  /**
   * Get fully expanded moves for an algorithm (resolves all triggers)
   */
  getExpandedMoves(id: AlgorithmId): string {
    const algo = this.get(id)
    if (!algo) return ''

    const parts: string[] = []
    for (const step of algo.decomposition) {
      if (step.trigger) {
        const expanded = this.expandTrigger(step.trigger)
        parts.push(expanded || step.moves)
      } else {
        parts.push(step.moves)
      }
    }

    return parts.join(' ').replace(/\s+/g, ' ').trim()
  }

  /**
   * Get OLL case data
   */
  getOLLCase(number: number): OLLCase | undefined {
    return this.ollCaseMap.get(number)
  }

  /**
   * Get PLL case data
   */
  getPLLCase(name: string): PLLCase | undefined {
    return this.pllCaseMap.get(name.toLowerCase())
  }

  /**
   * Get all algorithm IDs
   */
  getAllIds(): AlgorithmId[] {
    return Array.from(this.algorithms.keys())
  }

  /**
   * Get all case IDs
   */
  getAllCaseIds(): string[] {
    return Array.from(this.caseToAlgorithms.keys())
  }

  private initializeFromData() {
    // Register triggers first (they may be referenced by other algorithms)
    this.registerTriggers()

    // Register OLL algorithms
    this.registerOLLAlgorithms()

    // Register PLL algorithms
    this.registerPLLAlgorithms()

    // Set up inverse relationships at algorithm level
    this.setupInverseRelationships()
  }

  private registerTriggers() {
    for (const category of triggerCategories) {
      for (const [leftTrigger, rightTrigger] of category.triggers) {
        this.registerTrigger(rightTrigger)
        this.registerTrigger(leftTrigger)
      }
    }
  }

  private registerTrigger(trigger: Trigger) {
    // Extract key from notation: {sexy} -> sexy
    const key = trigger.notation.slice(1, -1).toLowerCase()
    const id = buildAlgorithmId('trigger', key)

    const registered: RegisteredAlgorithm = {
      id,
      caseId: `trigger-${key}`,
      category: 'Trigger',
      displayName: trigger.name,
      variantIndex: 1,
      decomposition: [{ moves: trigger.moves }],
    }

    this.algorithms.set(id, registered)
    this.triggerByNotation.set(key, id)

    // Also register inverse notation if present
    if (trigger.inverseNotation) {
      const inverseKey = trigger.inverseNotation.slice(1, -1).toLowerCase()
      const inverseId = buildAlgorithmId('trigger', inverseKey)

      const inverseRegistered: RegisteredAlgorithm = {
        id: inverseId,
        caseId: `trigger-${inverseKey}`,
        category: 'Trigger',
        displayName: `${trigger.name} (Inverse)`,
        variantIndex: 1,
        decomposition: [{ moves: trigger.inverse }],
        inverseOf: id,
      }

      this.algorithms.set(inverseId, inverseRegistered)
      this.triggerByNotation.set(inverseKey, inverseId)

      // Set bidirectional inverse
      registered.inverseOf = inverseId
    }
  }

  private registerOLLAlgorithms() {
    for (const category of ollCategories) {
      for (const entry of category.cases) {
        for (const ollCase of entry) {
          this.ollCaseMap.set(ollCase.number, ollCase)
          const caseId = `oll-${ollCase.number}`
          const algorithmIds: AlgorithmId[] = []

          ollCase.algorithms.forEach((algo, index) => {
            const variantIndex = index + 1
            const algorithmId = buildAlgorithmId('oll', String(ollCase.number), variantIndex)

            const displayName = variantIndex === 1
              ? `OLL ${ollCase.number}`
              : `OLL ${ollCase.number} (Alt ${variantIndex - 1})`

            const registered: RegisteredAlgorithm = {
              ...algo,
              id: algorithmId,
              caseId,
              category: 'OLL',
              displayName,
              variantIndex,
            }

            this.algorithms.set(algorithmId, registered)
            algorithmIds.push(algorithmId)
          })

          this.caseToAlgorithms.set(caseId, algorithmIds)
        }
      }
    }
  }

  private registerPLLAlgorithms() {
    for (const category of pllCategories) {
      for (const entry of category.cases) {
        for (const pllCase of entry) {
          const nameLower = pllCase.name.toLowerCase()
          this.pllCaseMap.set(nameLower, pllCase)
          const caseId = `pll-${nameLower}`
          const algorithmIds: AlgorithmId[] = []

          pllCase.algorithms.forEach((algo, index) => {
            const variantIndex = index + 1
            const algorithmId = buildAlgorithmId('pll', nameLower, variantIndex)

            const displayName = variantIndex === 1
              ? `PLL ${pllCase.name}`
              : `PLL ${pllCase.name} (Alt ${variantIndex - 1})`

            const registered: RegisteredAlgorithm = {
              ...algo,
              id: algorithmId,
              caseId,
              category: 'PLL',
              displayName,
              variantIndex,
            }

            this.algorithms.set(algorithmId, registered)
            algorithmIds.push(algorithmId)
          })

          this.caseToAlgorithms.set(caseId, algorithmIds)
        }
      }
    }
  }

  private setupInverseRelationships() {
    // OLL inverse pairs - derived from case-level inverseOf
    // These map algorithm variants: case 24 algo 1 <-> case 25 algo 1, etc.
    const ollInversePairs: Array<[number, number]> = []

    // Collect inverse pairs from OLL data
    for (const category of ollCategories) {
      for (const entry of category.cases) {
        for (const ollCase of entry) {
          if (ollCase.inverseOf) {
            // Only add each pair once (avoid duplicates)
            const pair: [number, number] = ollCase.number < ollCase.inverseOf
              ? [ollCase.number, ollCase.inverseOf]
              : [ollCase.inverseOf, ollCase.number]
            if (!ollInversePairs.some(p => p[0] === pair[0] && p[1] === pair[1])) {
              ollInversePairs.push(pair)
            }
          }
        }
      }
    }

    // Set up algorithm-level inverse relationships
    for (const [caseA, caseB] of ollInversePairs) {
      const algosA = this.caseToAlgorithms.get(`oll-${caseA}`) || []
      const algosB = this.caseToAlgorithms.get(`oll-${caseB}`) || []

      // Match algorithms by variant index
      const minLength = Math.min(algosA.length, algosB.length)
      for (let i = 0; i < minLength; i++) {
        const algoA = this.algorithms.get(algosA[i])
        const algoB = this.algorithms.get(algosB[i])
        if (algoA && algoB) {
          algoA.inverseOf = algosB[i]
          algoB.inverseOf = algosA[i]
        }
      }
    }
  }
}

// Singleton instance
export const algorithmRegistry = new AlgorithmRegistryClass()

// Convenience hooks for React components
export function useAlgorithm(id: AlgorithmId): RegisteredAlgorithm | undefined {
  return algorithmRegistry.get(id)
}

export function useAlgorithmsForCase(caseId: string): RegisteredAlgorithm[] {
  return algorithmRegistry.getAlgorithmsForCase(caseId)
}

export function useAlgorithmInverse(id: AlgorithmId): RegisteredAlgorithm | undefined {
  return algorithmRegistry.getInverse(id)
}
