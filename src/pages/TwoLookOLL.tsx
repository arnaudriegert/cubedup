import {
  twoLookOllGroups, edgePatternMeta, getCase,
} from '../data/cases'
import SEOHead from '../components/SEOHead'
import CaseCard from '../components/CaseCard'
import CategoryNav from '../components/CategoryNav'
import type { CaseGroup, CaseId } from '../types/algorithm'

function getCaseNumber(caseId: CaseId): string {
  return caseId.replace('oll-', '')
}

function GroupCases({ group }: { group: CaseGroup }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {group.cases.map((entry) => {
        if (entry.length === 2) {
          const firstCase = getCase(entry[0])
          const secondCase = getCase(entry[1])
          if (!firstCase || !secondCase) return null

          return (
            <div key={entry[0]} id={`oll-${getCaseNumber(entry[0])}`} className="md:col-span-2">
              <div id={`oll-${getCaseNumber(entry[1])}`} className="pair-container">
                <CaseCard caseData={firstCase} />
                <CaseCard caseData={secondCase} />
              </div>
            </div>
          )
        }

        const caseId = entry[0]
        const caseData = getCase(caseId)
        if (!caseData) return null

        const meta = edgePatternMeta[caseId]

        return (
          <div key={caseId} id={`oll-${getCaseNumber(caseId)}`}>
            <CaseCard
              caseData={caseData}
              mask={meta ? 'oll-edges' : 'oll'}
              title={meta?.name}
              description={meta?.description}
              hideInverse={!!meta}
            />
          </div>
        )
      })}
    </div>
  )
}

const introContent = (
  <>
    <p>
      <strong>2-Look OLL</strong> breaks orientation into two steps: first orient edges
      (create a yellow cross), then orient corners. This reduces 57 cases to just 10 algorithms.
    </p>
    <p>
      <strong>Step 1 - Edges:</strong> Look only at edges (ignore corners). Identify if you have
      a dot (0 edges), L-shape (2 adjacent), or line (2 opposite). Apply the algorithm to create a cross.
    </p>
    <p>
      <strong>Step 2 - Corners:</strong> With the cross complete, recognize the corner pattern
      and apply one of the 7 corner algorithms.
    </p>
  </>
)

export default function TwoLookOLL() {
  return (
    <>
      <SEOHead
        title="2-Look OLL - Learn OLL in Two Steps"
        description="Master OLL with just 10 algorithms. First orient edges to create a cross, then orient corners. The perfect starting point before learning full OLL."
        path="/oll/2-look"
      />

      <header className="header-gradient text-center py-10">
        <h1 className="page-header-title">2-Look OLL</h1>
        <p className="page-header-subtitle text-slate-300">Orient the last layer in two steps</p>
      </header>

      <nav className="section-nav sticky top-0 z-20">
        <div className="max-w-5xl mx-auto">
          <CategoryNav
            categories={twoLookOllGroups}
            mode="jump"
            selectedCategory={null}
            onCategorySelect={() => {}}
          />
        </div>
      </nav>

      <main className="main-content-detailed">
        <details className="collapsible">
          <summary className="collapsible-trigger">About 2-Look OLL</summary>
          <div className="collapsible-content">{introContent}</div>
        </details>

        {twoLookOllGroups.map((group) => (
          <section
            key={group.name}
            id={group.name.toLowerCase().replace(/\s+/g, '-')}
            className="case-group scroll-mt-72"
          >
            <h2 className="section-title">{group.name}</h2>
            <p className="section-description">{group.description}</p>
            <GroupCases group={group} />
          </section>
        ))}
      </main>
    </>
  )
}
