import { useOutletContext } from 'react-router-dom'
import { ollGroups } from '../data/cases'
import { OLLContextType } from './OLL'
import CaseCard from '../components/CaseCard'
import { CaseDetailedLayout, type CaseCardProps } from '../components/CaseDetailedLayout'
import type { CaseId } from '../types/algorithm'

function OLLCaseCard({ caseData, isHighlighted }: CaseCardProps) {
  const { setSearch } = useOutletContext<OLLContextType>()
  return (
    <CaseCard
      caseData={caseData}
      isHighlighted={isHighlighted}
      onInverseClick={(num) => setSearch(String(num))}
    />
  )
}

function getOLLId(caseId: CaseId): string {
  return caseId.replace('oll-', '')
}

export default function OLLDetailed() {
  return (
    <CaseDetailedLayout<OLLContextType>
      groups={ollGroups}
      scrollIdPrefix="oll"
      getHighlightedCase={(ctx) => ctx.highlightedOll}
      getClearSearch={(ctx) => ctx.clearSearch}
      getCaseIdentifier={getOLLId}
      Card={OLLCaseCard}
      introTitle="About OLL cases"
      introContent={
        <>
          <p>
            The 57 OLL cases cover every possible last-layer orientation. Cases are grouped by the shape
            formed by incorrectly-oriented pieces: edges form patterns (lines, dots, L-shapes) while
            corners create the characteristic silhouette.
          </p>
          <p>
            <strong>Learning strategy:</strong> Start with Solved Cross cases—you likely know some from 2-look OLL.
            Then learn one category at a time. Mirror pairs share muscle memory; learn them together.
            Small categories (T-shapes, C-shapes) are quick wins.
          </p>
        </>
      }
    />
  )
}
