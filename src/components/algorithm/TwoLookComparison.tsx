/**
 * TwoLookComparison - Collapsible 2-look path comparison for OLL cases
 *
 * Uses details/summary for progressive disclosure.
 * Shows the algorithm using AlgorithmDisplay for consistent UX.
 */

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  getTwoLookPath,
  getTwoLookCaseName,
  getMoveCountDiff,
  getTwoLookMoveCount,
  type TwoLookPath,
  flattenTwoLookSteps,
} from '../../utils/twoLook'
import { expandAlgorithmObject } from '../../utils/algorithmExpander'
import { movesToNotation } from '../../utils/moveParser'
import type { Algorithm } from '../../types/algorithm'
import AlgorithmDisplay from './AlgorithmDisplay'
import './TwoLookComparison.css'

interface TwoLookComparisonProps {
  caseId: string
}

/**
 * Build the descriptive path string.
 * e.g., "L-shape → U2 → H (23)"
 */
function buildPathDescription(path: TwoLookPath): string {
  const parts: string[] = []

  if (path.rotation) {
    parts.push(`[${path.rotation}]`)
  }

  if (path.edgeCase) {
    parts.push(getTwoLookCaseName(path.edgeCase))
  }

  if (path.aufBetween) {
    parts.push(path.aufBetween)
  }

  parts.push(getTwoLookCaseName(path.cornerCase))

  return parts.join(' → ')
}

export default function TwoLookComparison({ caseId }: TwoLookComparisonProps) {
  const path = getTwoLookPath(caseId)

  const { flattenedAlgo, twoLookMoves, moveDiff, playgroundUrl } = useMemo(() => {
    if (!path) {
      return { flattenedAlgo: null, twoLookMoves: 0, moveDiff: 0, playgroundUrl: '' }
    }

    // Create algorithm from steps with internal triggers visible
    const flattened: Algorithm = {
      id: `${caseId}-two-look`,
      steps: flattenTwoLookSteps(path.steps),
    }

    const twoLookCount = getTwoLookMoveCount(path)
    const diff = getMoveCountDiff(caseId)

    // Generate notation for playground URL
    const expanded = expandAlgorithmObject(flattened)
    const notation = movesToNotation(expanded.moves)
    const url = `/playground?notation=${encodeURIComponent(notation)}`

    return {
      flattenedAlgo: flattened,
      twoLookMoves: twoLookCount,
      moveDiff: diff,
      playgroundUrl: url,
    }
  }, [caseId, path])

  if (!path || !flattenedAlgo) {
    return null
  }

  const pathDescription = buildPathDescription(path)

  return (
    <details className="two-look-details">
      <summary className="two-look-summary">
        2-look: {twoLookMoves} moves
        <span className={`two-look-diff ${moveDiff <= 0 ? 'two-look-diff-good' : ''}`}>
          {' '}({moveDiff > 0 ? `+${moveDiff}` : moveDiff === 0 ? '=' : moveDiff})
        </span>
      </summary>

      <div className="two-look-content">
        <div className="two-look-path">{pathDescription}</div>

        <div className="two-look-algo-row">
          <Link to={playgroundUrl} title="Demo 2-look" className="ghost-icon-btn">
            <span className="text-sm">▶</span>
          </Link>

          <div className="flex-1 min-w-0">
            <AlgorithmDisplay algorithm={flattenedAlgo} size="sm" />
          </div>
        </div>
      </div>
    </details>
  )
}
