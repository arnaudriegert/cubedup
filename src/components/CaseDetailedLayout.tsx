import {
  useRef, type ReactNode, type ComponentType,
} from 'react'
import { useOutletContext } from 'react-router-dom'
import { getCase } from '../data/cases'
import { useClickOutside } from '../hooks'
import type {
  CaseGroup, CaseId, Case,
} from '../types/algorithm'

const DETAILED_IGNORE_SELECTORS = ['nav', 'header', 'input', '.case-card']

export interface CaseCardProps {
  caseData: Case
  isHighlighted: boolean
}

export interface CaseDetailedLayoutProps<TContext> {
  groups: CaseGroup[]
  scrollIdPrefix: string
  getHighlightedCase: (ctx: TContext) => string | null
  getClearSearch: (ctx: TContext) => () => void
  getCaseIdentifier: (caseId: CaseId) => string
  Card: ComponentType<CaseCardProps>
  introTitle: string
  introContent: ReactNode
}

export function CaseDetailedLayout<TContext>({
  groups,
  scrollIdPrefix,
  getHighlightedCase,
  getClearSearch,
  getCaseIdentifier,
  Card,
  introTitle,
  introContent,
}: CaseDetailedLayoutProps<TContext>) {
  const context = useOutletContext<TContext>()
  const mainRef = useRef<HTMLElement>(null)

  const highlightedCase = getHighlightedCase(context)
  const clearSearch = getClearSearch(context)

  useClickOutside({
    containerRef: mainRef,
    onClickOutside: clearSearch,
    enabled: highlightedCase !== null,
    ignoreSelectors: DETAILED_IGNORE_SELECTORS,
  })

  return (
    <main ref={mainRef} className="main-content-detailed">
      <details className="collapsible">
        <summary className="collapsible-trigger">{introTitle}</summary>
        <div className="collapsible-content">{introContent}</div>
      </details>

      {groups.map((group, groupIndex) => (
        <section key={groupIndex} id={group.name.replace(/\s+/g, '-').toLowerCase()} className="case-group scroll-mt-72">
          <h2 className="section-title">{group.name}</h2>
          <p className="section-description">{group.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(() => {
              const rendered: ReactNode[] = []
              let position = 0

              for (const entry of group.cases) {
                const isRelatedPair = entry.length === 2
                const firstCaseId = entry[0]
                const firstCase = getCase(firstCaseId)
                if (!firstCase) continue

                const firstId = getCaseIdentifier(firstCaseId)

                if (isRelatedPair && position === 1) {
                  rendered.push(<div key={`spacer-${firstId}`} className="hidden md:block" />)
                  position = (position + 1) % 2
                }

                if (isRelatedPair) {
                  const secondCaseId = entry[1]
                  const secondCase = getCase(secondCaseId)
                  if (!secondCase) continue

                  const secondId = getCaseIdentifier(secondCaseId)

                  rendered.push(
                    <div key={firstId} id={`${scrollIdPrefix}-${firstId}`} className="md:col-span-2">
                      <div id={`${scrollIdPrefix}-${secondId}`} className="pair-container">
                        <Card caseData={firstCase} isHighlighted={highlightedCase === firstId} />
                        <Card caseData={secondCase} isHighlighted={highlightedCase === secondId} />
                      </div>
                    </div>,
                  )
                  position = 0
                } else {
                  rendered.push(
                    <div key={firstId} id={`${scrollIdPrefix}-${firstId}`}>
                      <Card caseData={firstCase} isHighlighted={highlightedCase === firstId} />
                    </div>,
                  )
                  position = (position + 1) % 2
                }
              }

              return rendered
            })()}
          </div>
        </section>
      ))}
    </main>
  )
}
