interface PinBadgeProps {
  className?: string
}

export default function PinBadge({ className = '' }: PinBadgeProps) {
  return (
    <span className={`bg-emerald-100 text-emerald-600 p-1 rounded-full shadow-sm ${className}`}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
      </svg>
    </span>
  )
}
