import { IsometricCube } from '../components/cube'
import { Color, TopFaceColors } from '../types/cube'
import { crossFace } from '../utils/cubeHelpers'

// Helper to create a face with specific stickers highlighted
function makeFace(
  center: Color,
  positions: { [key: number]: Color },
): TopFaceColors {
  const face: TopFaceColors = [
    Color.GRAY, Color.GRAY, Color.GRAY,
    Color.GRAY, center, Color.GRAY,
    Color.GRAY, Color.GRAY, Color.GRAY,
  ]
  for (const [pos, color] of Object.entries(positions)) {
    face[parseInt(pos)] = color
  }
  return face
}

export default function Cross() {
  return (
    <div className="page-bg">
      <header className="header-gradient text-center py-8">
        <h1 className="page-header-title">Cross Patterns</h1>
        <p className="page-header-subtitle">
          Learn to recognize patterns in all color orientations
        </p>
      </header>

      <main className="main-content-wide">
        {/* Introduction */}
        <div className="section-card text-center mb-8">
          <h2 className="section-subtitle">The Goal</h2>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <IsometricCube
              faces={{
                bottom: crossFace(Color.WHITE, Color.WHITE),
                front: makeFace(Color.BLUE, { 7: Color.BLUE }),
                right: makeFace(Color.RED, { 7: Color.RED }),
              }}
              view="bottom-front-right"
              size="normal"
            />
            <div className="text-left max-w-md">
              <p className="body-text mb-2">
                <strong>White cross on bottom</strong>, with edges matching center colors.
              </p>
              <p className="help-text">
                Each pattern below shows all 4 color variations to build pattern recognition.
              </p>
            </div>
          </div>
        </div>

        {/* More cases coming soon */}
        <div className="section-card text-center">
          <p className="text-gray-500 italic">Cross patterns coming soon...</p>
        </div>
      </main>

      <footer className="page-footer">
        <p>&copy; 2025 CFOP Learning Guide</p>
      </footer>
    </div>
  )
}
