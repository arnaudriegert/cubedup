import { useState } from 'react'
import { pllGroups, getPLLCases } from '../data/cases'
import SEOHead from '../components/SEOHead'
import ColorRemote from '../components/ColorRemote'
import { CasePageLayout, type CasePageContextParams } from '../components/CasePageLayout'
import { Color } from '../types/cube'

// Get all PLL case names for validation
const allPLLNames = getPLLCases().map(c => c.name.toLowerCase())

// PLL search validation: must be a valid PLL name
function validatePLLSearch(value: string): string | null {
  const lower = value.toLowerCase().trim()
  return allPLLNames.includes(lower) ? lower : null
}

// Context type exported for child routes
export interface PLLContextType {
  debouncedSearch: string
  highlightedPll: string | null
  setSearch: (value: string) => void
  clearSearch: () => void
  selectedCategory: string | null
  selectedColor: Color
}

export default function PLL() {
  const [selectedColor, setSelectedColor] = useState<Color>(Color.BLUE)

  function buildPLLContext(params: CasePageContextParams): PLLContextType {
    return {
      debouncedSearch: params.debouncedSearch,
      highlightedPll: params.highlightedCase,
      setSearch: params.setSearch,
      clearSearch: params.clearSearch,
      selectedCategory: params.selectedCategory,
      selectedColor,
    }
  }

  return (
    <>
      <SEOHead
        title="PLL - Permutation of Last Layer"
        description="Learn all 21 PLL algorithms organized by symmetry. Master last layer permutation with headlight recognition and swap patterns for faster solving."
        path="/pll"
      />
      <CasePageLayout
        title="PLL - Permutation of Last Layer"
        subtitle="Permute all pieces to their correct positions"
        basePath="/pll"
        searchPlaceholder="PLL name (press /)"
        validateSearch={validatePLLSearch}
        groups={pllGroups}
        buildContext={buildPLLContext}
      >
        <ColorRemote
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      </CasePageLayout>
    </>
  )
}
