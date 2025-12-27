import { ollGroups } from '../data/cases'
import SEOHead from '../components/SEOHead'
import { CasePageLayout, type CasePageContextParams } from '../components/CasePageLayout'

// OLL search validation: must be number 1-57
function validateOLLSearch(value: string): string | null {
  const num = parseInt(value, 10)
  return (num >= 1 && num <= 57) ? String(num) : null
}

// Context type exported for child routes
export interface OLLContextType {
  debouncedSearch: string
  highlightedOll: string | null
  setSearch: (value: string) => void
  clearSearch: () => void
  selectedCategory: string | null
}

function buildOLLContext(params: CasePageContextParams): OLLContextType {
  return {
    debouncedSearch: params.debouncedSearch,
    highlightedOll: params.highlightedCase,
    setSearch: params.setSearch,
    clearSearch: params.clearSearch,
    selectedCategory: params.selectedCategory,
  }
}

export default function OLL() {
  return (
    <>
      <SEOHead
        title="OLL - Orientation of Last Layer"
        description="Learn all 57 OLL algorithms organized by symmetry. Master last layer orientation with visual patterns and related case groupings for faster memorization."
        path="/oll"
      />
      <CasePageLayout
        title="OLL - Orientation of Last Layer"
        subtitle="Orient all pieces on the last layer"
        basePath="/oll"
        searchPlaceholder="OLL # (press /)"
        searchInputMode="numeric"
        validateSearch={validateOLLSearch}
        groups={ollGroups}
        buildContext={buildOLLContext}
      />
    </>
  )
}
