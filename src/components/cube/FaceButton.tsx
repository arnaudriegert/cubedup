interface FaceButtonProps {
  face: string
  prime?: boolean
  size: 'lg' | 'sm'
  colorStyle: { bg: string; text: string }
  onClick: () => void
  opacity?: number
  title?: string
}

export function FaceButton({
  face,
  prime = false,
  size,
  colorStyle,
  onClick,
  opacity,
  title,
}: FaceButtonProps) {
  const label = prime ? `${face}'` : face

  return (
    <button
      onClick={onClick}
      className={`${size === 'lg' ? 'face-btn' : 'face-btn-sm'} ${colorStyle.bg} ${colorStyle.text}`}
      style={opacity !== undefined ? { opacity } : undefined}
      title={title}
    >
      {label}
    </button>
  )
}
