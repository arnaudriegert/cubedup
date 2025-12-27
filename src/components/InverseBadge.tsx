import './InverseBadge.css'

interface InverseBadgeProps {
  inverseCaseNumber: number
  onClick?: (caseNumber: number) => void
  className?: string
}

export default function InverseBadge({ inverseCaseNumber, onClick, className = '' }: InverseBadgeProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClick?.(inverseCaseNumber)
  }

  return (
    <button
      onClick={handleClick}
      className={`inverse-badge ${className}`}
      title={`Navigate to inverse: OLL ${inverseCaseNumber}`}
    >
      <span>{inverseCaseNumber}'</span>
    </button>
  )
}
