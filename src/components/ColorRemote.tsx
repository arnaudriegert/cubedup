import { colorToTailwind } from '../utils/colors'
import { createSolvedCube } from '../utils/cubeState'
import './ColorRemote.css'

export type YRotation = '' | 'y' | 'y2' | "y'"

// Y rotation cycles side faces clockwise: front → right → back → left
// Read center stickers from solved cube as source of truth
const solved = createSolvedCube()
const ROTATION_COLORS = new Map<YRotation, typeof solved.front[4]>([
  ['', solved.front[4]],
  ['y', solved.right[4]],
  ['y2', solved.back[4]],
  ["y'", solved.left[4]],
])

interface ColorRemoteProps {
  selectedRotation: YRotation
  onRotationSelect: (rotation: YRotation) => void
}

export default function ColorRemote({
  selectedRotation,
  onRotationSelect,
}: ColorRemoteProps) {
  return (
    <fieldset className="color-remote">
      {[...ROTATION_COLORS].map(([rotation, color]) => (
        <label key={rotation || 'none'} className={`color-remote-btn ${colorToTailwind[color]}`}>
          <input
            type="radio"
            name="rotation-select"
            value={rotation}
            checked={selectedRotation === rotation}
            onChange={() => onRotationSelect(rotation)}
            className="sr-only"
          />
          <span className="sr-only">Rotate to show {color} in front</span>
        </label>
      ))}
    </fieldset>
  )
}
