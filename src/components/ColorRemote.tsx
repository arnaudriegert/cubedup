import { Color } from '../types/cube'
import { SIDE_COLORS, colorToTailwind } from '../utils/colors'
import './ColorRemote.css'

interface ColorRemoteProps {
  selectedColor: Color
  onColorSelect: (color: Color) => void
}

export default function ColorRemote({
  selectedColor,
  onColorSelect,
}: ColorRemoteProps) {
  return (
    <fieldset className="color-remote">
      {SIDE_COLORS.map((color) => (
        <label key={color} className={`color-remote-btn ${colorToTailwind[color]}`}>

          <input
            type="radio"
            name="color-select"
            value={color}
            checked={selectedColor === color}
            onChange={() => onColorSelect(color)}
            className="sr-only"
          />
          <span className="sr-only">Show {color} color variant</span>
        </label>
      ))}
    </fieldset>
  )
}
