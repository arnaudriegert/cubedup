/**
 * AlgorithmBreadcrumb - Navigation link back to case page
 *
 * Shows: "← Back to OLL 21" or "← Back to PLL Ua (Alt 1)"
 */

import { Link } from 'react-router-dom'
import type { AlgorithmId } from '../../types/algorithm'
import { parseAlgorithmId, getAlgorithmDisplayName } from '../../utils/algorithmId'
import { getCasePageUrl } from '../../utils/algorithmLinks'

export interface AlgorithmBreadcrumbProps {
  algorithmId: AlgorithmId
  showVariant?: boolean
  className?: string
}

export default function AlgorithmBreadcrumb({
  algorithmId,
  showVariant = true,
  className = '',
}: AlgorithmBreadcrumbProps) {
  const { variantIndex } = parseAlgorithmId(algorithmId)
  const displayName = getAlgorithmDisplayName(algorithmId)
  const caseUrl = getCasePageUrl(algorithmId)

  // Strip variant suffix if not showing
  const label = showVariant
    ? displayName
    : displayName.replace(/ \(Alt \d+\)$/, '')

  return (
    <Link
      to={caseUrl}
      className={`inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors ${className}`}
    >
      <span>←</span>
      <span>Back to {label}</span>
      {showVariant && variantIndex && variantIndex > 1 && (
        <span className="text-slate-400">(Algorithm {variantIndex})</span>
      )}
    </Link>
  )
}
