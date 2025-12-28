import CaseGrid from './CaseGrid'
import { AlgoCardRow } from './algorithm'
import { getAlgorithmsForCase, getPLLSwaps } from '../data/cases'
import { getPlaygroundUrlForAlgorithm } from '../utils/algorithmLinks'
import { CORNER_COLOR, EDGE_COLOR } from './PLLArrowOverlay'
import type { Case, PLLSwapInfo } from '../types/algorithm'
import type { YRotation } from './ColorRemote'

export interface CaseCardProps {
  caseData: Case
  isHighlighted: boolean
  selectedRotation?: YRotation
  onInverseClick?: (num: number) => void
}

export default function CaseCard({
  caseData,
  isHighlighted,
  selectedRotation = '',
  onInverseClick,
}: CaseCardProps) {
  const { id, name, number } = caseData
  const isOLL = id.startsWith('oll-')
  const algorithms = getAlgorithmsForCase(id)
  const swaps = getPLLSwaps(id)

  const title = isOLL ? `OLL ${number} - ${name}` : name

  return (
    <div className={`case-card transition-all duration-300 relative ${isHighlighted ? 'case-card-highlight' : ''}`}>
      <div className="flex flex-col items-center">
        <h3 className="case-card-title">{title}</h3>

        <div className="mb-4">
          <CaseGrid
            caseId={id}
            selectedRotation={selectedRotation}
            showArrows={!!swaps}
            swaps={swaps}
          />
        </div>

        {swaps && <SwapDescription swaps={swaps} />}

        <div className="w-full space-y-3">
          {algorithms.map((algorithm, i) => (
            <AlgoCardRow
              key={i}
              algorithm={algorithm}
              playgroundUrl={getPlaygroundUrlForAlgorithm(algorithm.id)}
              onInverseClick={onInverseClick}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function SwapDescription({ swaps }: { swaps: PLLSwapInfo }) {
  const parts = swaps.description.split(/(corners?|edges?)/gi)
  return (
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
      {parts.map((part, i) => {
        const lower = part.toLowerCase()
        if (lower === 'corner' || lower === 'corners') {
          return <span key={i} style={{ color: CORNER_COLOR, fontWeight: 500 }}>{part}</span>
        }
        if (lower === 'edge' || lower === 'edges') {
          return <span key={i} style={{ color: EDGE_COLOR, fontWeight: 500 }}>{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </p>
  )
}
