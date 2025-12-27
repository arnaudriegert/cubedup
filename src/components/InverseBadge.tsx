interface InverseBadgeProps {
  inverseCaseNumber: number
  onClick?: (caseNumber: number) => void
  className?: string
  ghost?: boolean
}

export default function InverseBadge({ inverseCaseNumber, onClick, className = '', ghost = false }: InverseBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(inverseCaseNumber)
  }

  const baseStyles = ghost
    ? 'text-slate-400 border-transparent group-hover/algocard:text-amber-700 group-hover/algocard:bg-amber-100 group-hover/algocard:border-amber-200 hover:bg-amber-200 hover:border-amber-300'
    : 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 hover:border-amber-300'

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium border rounded-full transition-colors cursor-pointer ${baseStyles} ${className}`}
      title={`Navigate to inverse: OLL ${inverseCaseNumber}`}
    >
      <span>{inverseCaseNumber}'</span>
    </button>
  )
}
