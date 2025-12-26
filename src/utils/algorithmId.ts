/**
 * Algorithm ID utilities for unique algorithm identification
 *
 * ID Format: {category}-{caseKey}-{variantIndex}
 * Examples:
 *   - "oll-21-1"     OLL case 21, first algorithm
 *   - "oll-21-2"     OLL case 21, second algorithm
 *   - "pll-ua-1"     PLL Ua, first algorithm
 *   - "trigger-sexy" Trigger: sexy move (no variant index)
 */

export type AlgorithmId = string

export type AlgorithmCategory = 'oll' | 'pll' | 'trigger'

export interface ParsedAlgorithmId {
  category: AlgorithmCategory
  caseKey: string
  variantIndex?: number
}

/**
 * Parse an algorithm ID into its components
 */
export function parseAlgorithmId(id: AlgorithmId): ParsedAlgorithmId {
  const lower = id.toLowerCase()
  const parts = lower.split('-')

  if (parts.length < 2) {
    throw new Error(`Invalid algorithm ID: ${id}`)
  }

  const category = parts[0] as AlgorithmCategory

  if (category === 'trigger') {
    // Triggers don't have variant index: "trigger-sexy", "trigger-left-sexy"
    return {
      category,
      caseKey: parts.slice(1).join('-'),
    }
  }

  // For OLL/PLL, last part is variant index if it's a number
  const lastPart = parts[parts.length - 1]
  const variantIndex = parseInt(lastPart, 10)

  if (Number.isNaN(variantIndex)) {
    // No variant index, use the whole thing as caseKey
    return {
      category,
      caseKey: parts.slice(1).join('-'),
    }
  }

  return {
    category,
    caseKey: parts.slice(1, -1).join('-'),
    variantIndex,
  }
}

/**
 * Build an algorithm ID from components
 */
export function buildAlgorithmId(
  category: AlgorithmCategory,
  caseKey: string,
  variantIndex?: number,
): AlgorithmId {
  if (category === 'trigger') {
    return `trigger-${caseKey.toLowerCase()}`
  }

  if (variantIndex === undefined) {
    return `${category}-${caseKey.toLowerCase()}`
  }

  return `${category}-${caseKey.toLowerCase()}-${variantIndex}`
}

/**
 * Get the case ID from an algorithm ID (strips variant index)
 */
export function getCaseIdFromAlgorithmId(algorithmId: AlgorithmId): string {
  const { category, caseKey } = parseAlgorithmId(algorithmId)
  return `${category}-${caseKey}`
}

/**
 * Get display name for a case ID
 */
export function getCaseDisplayName(caseId: string): string {
  const parts = caseId.split('-')
  const category = parts[0].toUpperCase()
  const caseKey = parts.slice(1).join('-')

  if (category === 'OLL') {
    return `OLL ${caseKey}`
  }
  if (category === 'PLL') {
    return `PLL ${caseKey.charAt(0).toUpperCase() + caseKey.slice(1)}`
  }
  if (category === 'TRIGGER') {
    return caseKey.charAt(0).toUpperCase() + caseKey.slice(1).replace(/-/g, ' ')
  }

  return caseId
}

/**
 * Get display name for an algorithm ID (includes variant if > 1)
 */
export function getAlgorithmDisplayName(algorithmId: AlgorithmId): string {
  const { category, caseKey, variantIndex } = parseAlgorithmId(algorithmId)
  const baseName = getCaseDisplayName(`${category}-${caseKey}`)

  if (variantIndex && variantIndex > 1) {
    return `${baseName} (Alt ${variantIndex - 1})`
  }

  return baseName
}
