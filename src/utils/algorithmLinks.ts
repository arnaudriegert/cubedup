/**
 * Generate Playground URL for a case ID
 * @param caseId - Format: "oll-21" or "pll-ua"
 */
export function getPlaygroundUrl(caseId: string): string {
  return `/playground?case=${encodeURIComponent(caseId)}`
}

/**
 * Generate Playground URL for a raw algorithm notation
 * @param notation - Algorithm notation like "R U R' U'"
 */
export function getPlaygroundUrlForAlgo(notation: string): string {
  return `/playground?algo=${encodeURIComponent(notation)}`
}

/**
 * Generate URL back to a case's learning page
 * @param caseId - Format: "oll-21" or "pll-ua"
 */
export function getCasePageUrl(caseId: string): string {
  const lower = caseId.toLowerCase()

  if (lower.startsWith('oll-')) {
    const num = lower.slice(4)
    return `/oll/detailed?select=${num}`
  }

  if (lower.startsWith('pll-')) {
    const name = lower.slice(4)
    return `/pll/detailed?select=${name}`
  }

  return '/oll'
}
