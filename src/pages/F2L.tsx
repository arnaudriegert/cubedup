import AlgorithmText from '../components/AlgorithmText'
import IsometricCube from '../components/IsometricCube'
import { Color, TopFaceColors } from '../types/cube'
import { solidFace, f2lFace } from '../utils/cubeHelpers'

// Standard color scheme (yellow on top, viewed from front):
// Left=Blue, Front=Red, Right=Green, Back=Orange
// When we rotate the cube, these relationships shift

// Color pairs for showing all 4 orientations of a pattern
// For RIGHT slot view (front+right visible): blue-red first
const colorRotationsRight = [
  {
    front: Color.BLUE,
    right: Color.RED,
    back: Color.GREEN,
    left: Color.ORANGE,
  },
  {
    front: Color.RED,
    right: Color.GREEN,
    back: Color.ORANGE,
    left: Color.BLUE,
  },
  {
    front: Color.GREEN,
    right: Color.ORANGE,
    back: Color.BLUE,
    left: Color.RED,
  },
  {
    front: Color.ORANGE,
    right: Color.BLUE,
    back: Color.RED,
    left: Color.GREEN,
  },
]

// For LEFT slot view (front+left visible): red-blue first (so blue+red are visible)
const colorRotationsLeft = [
  {
    front: Color.RED,
    right: Color.GREEN,
    back: Color.ORANGE,
    left: Color.BLUE,
  },
  {
    front: Color.GREEN,
    right: Color.ORANGE,
    back: Color.BLUE,
    left: Color.RED,
  },
  {
    front: Color.ORANGE,
    right: Color.BLUE,
    back: Color.RED,
    left: Color.GREEN,
  },
  {
    front: Color.BLUE,
    right: Color.RED,
    back: Color.GREEN,
    left: Color.ORANGE,
  },
]

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

// Component for showing a single F2L case with left OR right orientation
// Uses 2x2 grid for larger cube display
interface F2LCaseCardProps {
  slot: 'left' | 'right'
  algorithm: string
  generateFaces: (colors: typeof colorRotationsRight[0]) => {
    top?: TopFaceColors
    front?: TopFaceColors
    right?: TopFaceColors
    left?: TopFaceColors
  }
}

function F2LCaseCard({
  slot, algorithm, generateFaces,
}: F2LCaseCardProps) {
  const isLeft = slot === 'left'
  const bgColor = isLeft ? 'bg-blue-50' : 'bg-green-50'
  const textColor = isLeft ? 'text-blue-800' : 'text-green-800'
  const label = isLeft ? 'Left Slot (FL)' : 'Right Slot (FR)'
  const view = isLeft ? 'top-front-left' : 'top-front-right'
  const colorRotations = isLeft ? colorRotationsLeft : colorRotationsRight

  return (
    <div className={`${bgColor} rounded-xl p-6`}>
      <h4 className={`font-semibold ${textColor} mb-4 text-center text-lg`}>{label}</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 justify-items-center mb-6">
        {colorRotations.map((colors, i) => (
          <IsometricCube
            key={i}
            faces={generateFaces(colors)}
            view={view}
            size="medium"
          />
        ))}
      </div>
      <div className="algorithm-box text-center bg-white">
        <AlgorithmText text={algorithm} />
      </div>
    </div>
  )
}

export default function F2L() {
  return (
    <div className="page-bg">
      <div className="sticky top-0 z-20">
        <header className="header-gradient text-center py-8">
          <h1 className="text-4xl font-bold mb-2">F2L Patterns</h1>
          <p className="text-lg opacity-90">
            Pattern recognition for First Two Layers
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
                bottom: solidFace(Color.WHITE),
                front: f2lFace(Color.BLUE),
                right: f2lFace(Color.RED),
              }}
              view="bottom-front-right"
              size="normal"
            />
            <div className="text-left max-w-md">
              <p className="text-gray-700 mb-2">
                <strong>Insert corner-edge pairs</strong> into the 4 slots around the bottom layer.
              </p>
              <p className="text-gray-600 text-sm">
                Each pattern shows all 4 color variations.
                Focus on recognizing the <em>relationship</em> between corner and edge, not specific colors.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Patterns */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Basic Patterns
        </h2>
        <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
          The fundamental F2L cases. Corner and edge both on U layer.
          Left-handed algorithms (L moves) for FL slot, right-handed (R moves) for FR slot.
        </p>

        {/* Case 1: Joined Pair - Easy Insert */}
        <div className="section-card mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">1. Joined Pair - Easy Insert</h3>
          <p className="text-gray-600 mb-4 text-center">
            Corner and edge already paired (touching, colors aligned). Pair is in front, slot is behind.
            U move hides pair, then insert.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Slot (FL) - pair at front-left area
                Corner at UFL: WHITE faces FRONT, F-color faces LEFT
                Edge at UL (top[3], left[1]) - joined with corner
                For U' L' U L: U' hides pair, L' opens slot, U brings pair over, L closes */}
            <F2LCaseCard
              slot="left"
              algorithm="**U' L' U L**"
              generateFaces={(c) => ({
                // LEFT slot joined pair: corner at UFL, edge at UL
                // Corner: WHITE faces FRONT (front[0]), F-color on left[2], L-color on top[6]
                // Edge at UL: top[3]=L-color (orange), left[1]=F-color (blue)
                // Joined = corner's left[2] (F-color) adjacent to edge's left[1] (F-color) - same color!
                top: makeFace(Color.YELLOW, {
                  6: c.left,
                  3: c.left,
                }),
                front: makeFace(c.front, { 0: Color.WHITE }),
                left: makeFace(c.left, {
                  2: c.front,
                  1: c.front,
                }),
              })}
            />

            {/* Right Slot (FR) - pair at front-right area
                Corner at UFR: WHITE faces FRONT = visible on front[2]
                Edge at UR (top[5], right[1]) - joined with corner
                For U R U' R': U hides pair, R opens slot, U' brings pair over, R' closes */}
            <F2LCaseCard
              slot="right"
              algorithm="**U R U' R'**"
              generateFaces={(c) => ({
                // RIGHT slot joined pair: corner at UFR, edge at UR
                // Corner: WHITE faces FRONT (front[2]), R-color on top[8], F-color on right[0]
                // Edge at UR: top[5]=R-color, right[1]=F-color
                // Joined = corner's right[0] (F-color) adjacent to edge's right[1] (F-color)
                top: makeFace(Color.YELLOW, {
                  8: c.right,
                  5: c.right,
                }),
                front: makeFace(c.front, { 2: Color.WHITE }),
                right: makeFace(c.right, {
                  0: c.front,
                  1: c.front,
                }),
              })}
            />
          </div>
        </div>

        {/* Case 2: Split Pair - Three Move Insert */}
        <div className="section-card mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">2. Split Pair - Three Move Insert</h3>
          <p className="text-gray-600 mb-4 text-center">
            Corner and edge separated. Corner in front with white facing sideways.
            Edge in back with front-color facing up.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Slot (FL) - L' U' L
                Corner at UFL: WHITE faces LEFT (visible on left face), L-color on top[6], F-color on front[0]
                Edge at UB: F-color faces UP (top[1]) */}
            <F2LCaseCard
              slot="left"
              algorithm="**L' U' L**"
              generateFaces={(c) => ({
                // LEFT slot split pair: corner at UFL, edge at UB (back)
                // Corner: WHITE faces LEFT (left[2]), top[6]=L-color, front[0]=F-color
                // Edge at UB: top[1]=F-color (facing up), back face has L-color (not visible)
                top: makeFace(Color.YELLOW, {
                  6: c.left,
                  1: c.front,
                }),
                front: makeFace(c.front, { 0: c.front }),
                left: makeFace(c.left, { 2: Color.WHITE }),
              })}
            />

            {/* Right Slot (FR) - R U R'
                Corner at UFR: WHITE faces RIGHT (right[0]), R-color on top[8], F-color on front[2]
                Edge at UB: F-color faces UP (top[1]) */}
            <F2LCaseCard
              slot="right"
              algorithm="**R U R'**"
              generateFaces={(c) => ({
                // RIGHT slot split pair: corner at UFR, edge at UB (back)
                // Corner: WHITE faces RIGHT (right[0]), top[8]=R-color, front[2]=F-color
                // Edge at UB: top[1]=F-color (facing up), back face has R-color (not visible)
                top: makeFace(Color.YELLOW, {
                  8: c.right,
                  1: c.front,
                }),
                front: makeFace(c.front, { 2: c.front }),
                right: makeFace(c.right, { 0: Color.WHITE }),
              })}
            />
          </div>
        </div>

        {/* More cases coming soon */}
        <div className="section-card text-center">
          <p className="text-gray-500 italic">More F2L cases coming soon...</p>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-600">
        <p>&copy; 2025 CFOP Learning Guide</p>
      </footer>
    </div>
  )
}
