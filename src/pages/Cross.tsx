import IsometricCube from '../components/IsometricCube'
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
      <div className="sticky top-0 z-20">
        <header className="header-gradient text-center py-8">
          <h1 className="text-4xl font-bold mb-2">Cross Patterns</h1>
          <p className="text-lg opacity-90">
            Learn to recognize patterns in all color orientations
          </p>
        </header>
      </div>

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Introduction */}
        <div className="section-card text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">The Goal</h2>
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
              <p className="text-gray-700 mb-2">
                <strong>White cross on bottom</strong>, with edges matching center colors.
              </p>
              <p className="text-gray-600 text-sm">
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

      <footer className="text-center py-6 text-gray-600">
        <p>&copy; 2025 CFOP Learning Guide</p>
      </footer>
    </div>
  )
}
