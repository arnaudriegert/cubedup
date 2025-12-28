import { useOutletContext } from 'react-router-dom'
import { pllGroups } from '../data/cases'
import { PLLContextType } from './PLL'
import CaseCard from '../components/CaseCard'
import { CaseDetailedLayout, type CaseCardProps } from '../components/CaseDetailedLayout'
import type { CaseId } from '../types/algorithm'

function PLLCaseCard({ caseData, isHighlighted }: CaseCardProps) {
  const { selectedRotation } = useOutletContext<PLLContextType>()
  return (
    <CaseCard
      caseData={caseData}
      isHighlighted={isHighlighted}
      selectedRotation={selectedRotation}
    />
  )
}

function getPLLId(caseId: CaseId): string {
  return caseId.replace('pll-', '')
}

export default function PLLDetailed() {
  return (
    <CaseDetailedLayout<PLLContextType>
      groups={pllGroups}
      scrollIdPrefix="pll"
      getHighlightedCase={(ctx) => ctx.highlightedPll}
      getClearSearch={(ctx) => ctx.clearSearch}
      getCaseIdentifier={getPLLId}
      Card={PLLCaseCard}
      introTitle="About PLL cases"
      introContent={
        <>
          <p>
            The 21 PLL cases rearrange last-layer pieces without disturbing their orientation.
            Recognition is key: identify cases quickly from side-face patterns. Look for
            <strong> headlights</strong> (two matching colors on one side)—their presence and position
            narrows down possibilities dramatically.
          </p>
          <p>
            <strong>Learning strategy:</strong> Start with Edges Only (Ua, Ub, H, Z)—common cases with short algorithms.
            Then learn T and Jb from Adjacent Corners; they appear frequently. G-perms can wait until last;
            they're complex but occur less often. Use the color selector to practice recognition from any angle.
          </p>
        </>
      }
    />
  )
}
