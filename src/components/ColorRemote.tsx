import { Color } from '../types/cube'
import { SIDE_COLORS, colorToTailwind } from '../utils/colors'

interface ColorRemoteProps {
  selectedColor: Color
  onColorSelect: (color: Color) => void
}

export default function ColorRemote({
  selectedColor,
  onColorSelect,
}: ColorRemoteProps) {
  return (
    <div className="color-remote">
      {SIDE_COLORS.map((color) => (
        <button
          key={color}
          onClick={() => onColorSelect(color)}
          className={`color-remote-btn ${colorToTailwind[color]} ${
            selectedColor === color
              ? 'color-remote-btn-active'
              : 'color-remote-btn-inactive'
          }`}
          aria-label={`Show ${color} color variant`}
          aria-pressed={selectedColor === color}
        />
      ))}
    </div>
  )
}
