interface InverseBadgeProps {
  inverseCaseNumber: number
  onClick: (caseNumber: number) => void
  className?: string
}

export default function InverseBadge({ inverseCaseNumber, onClick, className = '' }: InverseBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick(inverseCaseNumber)
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200 rounded-full hover:bg-amber-200 hover:border-amber-300 transition-colors cursor-pointer ${className}`}
      title={`Navigate to inverse: OLL ${inverseCaseNumber}`}
    >
      <span>{inverseCaseNumber}'</span>
    </button>
  )
}
