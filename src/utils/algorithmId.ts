/**
 * Algorithm ID utilities for unique algorithm identification
 *
 * ID Format: {category}-{caseKey}-{variantIndex}
 * Examples:
 *   - "oll-21-1"     OLL case 21, first algorithm
 *   - "oll-21-2"     OLL case 21, second algorithm
 *   - "pll-ua-1"     PLL Ua, first algorithm
 */

type AlgorithmCategory = 'oll' | 'pll' | 'trigger'

interface ParsedAlgorithmId {
  category: AlgorithmCategory
  caseKey: string
  variantIndex?: number
}

/**
 * Parse an algorithm ID into its components
 */
export function parseAlgorithmId(id: string): ParsedAlgorithmId {
  const lower = id.toLowerCase()
  const parts = lower.split('-')

  if (parts.length < 2) {
    throw new Error(`Invalid algorithm ID: ${id}`)
  }

  const category = parts[0] as AlgorithmCategory

  if (category === 'trigger') {
    return {
      category,
      caseKey: parts.slice(1).join('-'),
    }
  }

  // For OLL/PLL, last part is variant index if it's a number and there are 3+ parts
  const lastPart = parts[parts.length - 1]
  const variantIndex = parseInt(lastPart, 10)

  if (Number.isNaN(variantIndex) || parts.length === 2) {
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
 * Get the case ID from an algorithm ID (strips variant index)
 */
export function getCaseIdFromAlgorithmId(algorithmId: string): string {
  const { category, caseKey } = parseAlgorithmId(algorithmId)
  return `${category}-${caseKey}`
}

/**
 * Get display name for an algorithm ID (includes variant if > 1)
 */
export function getAlgorithmDisplayName(algorithmId: string): string {
  const { category, caseKey, variantIndex } = parseAlgorithmId(algorithmId)

  // Build base name
  let baseName: string
  if (category === 'oll') {
    baseName = `OLL ${caseKey}`
  } else if (category === 'pll') {
    baseName = `PLL ${caseKey.charAt(0).toUpperCase() + caseKey.slice(1)}`
  } else {
    baseName = caseKey.charAt(0).toUpperCase() + caseKey.slice(1).replace(/-/g, ' ')
  }

  if (variantIndex && variantIndex > 1) {
    return `${baseName} (Alt ${variantIndex - 1})`
  }

  return baseName
}
