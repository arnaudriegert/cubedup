/**
 * AlgorithmVariantSelector - Select between algorithm variants for a case
 *
 * Shows numbered buttons [1] [2] when a case has multiple algorithms.
 * Returns null if there's only one algorithm.
 */

import type { AlgorithmId } from '../../types/algorithm'
import { algorithmRegistry } from '../../data/algorithmRegistry'

export interface AlgorithmVariantSelectorProps {
  caseId: string
  selectedIndex: number
  onSelect: (algorithmId: AlgorithmId) => void
  size?: 'sm' | 'md'
  className?: string
}

export default function AlgorithmVariantSelector({
  caseId,
  selectedIndex,
  onSelect,
  size = 'md',
  className = '',
}: AlgorithmVariantSelectorProps) {
  const algorithms = algorithmRegistry.getAlgorithmsForCase(caseId)

  // Don't render if only one algorithm
  if (algorithms.length <= 1) return null

  const sizeStyles = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
  }

  return (
    <div className={`flex gap-1.5 ${className}`}>
      {algorithms.map((algo, index) => {
        const isSelected = index === selectedIndex
        return (
          <button
            key={algo.id}
            onClick={() => onSelect(algo.id)}
            className={`
              ${sizeStyles[size]} rounded-md font-medium transition-all
              ${isSelected ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
            `}
            title={index === 0 ? 'Main algorithm' : `Alternative ${index}`}
          >
            {index + 1}
          </button>
        )
      })}
    </div>
  )
}
