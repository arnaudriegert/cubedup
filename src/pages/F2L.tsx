import AlgorithmBox from '../components/AlgorithmBox'
import { IsometricCube } from '../components/cube'
import SEOHead from '../components/SEOHead'
import { Color, FaceColors } from '../types/cube'
import { Algorithm } from '../data/ollCases'
import { solidFace, f2lFace } from '../utils/cubeHelpers'
import { getColorRotations } from '../utils/colors'
import {
  makeFace,
  makeLeftFront,
  makeLeftSide,
  makeRightFront,
  makeRightSide,
} from '../utils/f2lHelpers'

// Color rotations for showing all 4 orientations of a pattern
// For RIGHT slot view (front+right visible): start with blue-front
const colorRotationsRight = getColorRotations(Color.BLUE)
// For LEFT slot view (front+left visible): start with red-front (so blue+red are visible)
const colorRotationsLeft = getColorRotations(Color.RED)

// Component for showing a single F2L case with left OR right orientation
// Uses 2x2 grid for larger cube display
interface F2LCaseCardProps {
  slot: 'left' | 'right'
  algorithm: Algorithm
  generateFaces: (colors: typeof colorRotationsRight[0]) => {
    top?: FaceColors
    front?: FaceColors
    right?: FaceColors
    left?: FaceColors
  }
}

function F2LCaseCard({
  slot, algorithm, generateFaces,
}: F2LCaseCardProps) {
  const isLeft = slot === 'left'
  const label = isLeft ? 'Left Slot (FL)' : 'Right Slot (FR)'
  const view = isLeft ? 'top-front-left' : 'top-front-right'
  const colorRotations = isLeft ? colorRotationsLeft : colorRotationsRight

  return (
    <div className="case-card">
      <h4 className="case-card-title text-center">{label}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 md:gap-4 justify-items-center mb-4 md:mb-6">
        {colorRotations.map((colors, i) => (
          <IsometricCube
            key={i}
            faces={generateFaces(colors)}
            view={view}
            size="medium"
          />
        ))}
      </div>
      <AlgorithmBox algorithm={algorithm} />
    </div>
  )
}

export default function F2L() {
  return (
    <>
      <SEOHead
        title="F2L - First Two Layers"
        description="Learn F2L patterns for pairing corners with edges. Master intuitive F2L with pattern recognition across all color variations."
        path="/f2l"
      />

      <header className="header-gradient text-center py-8">
        <h1 className="page-header-title">F2L Patterns</h1>
        <p className="page-header-subtitle">
          Pattern recognition for First Two Layers
        </p>
      </header>

      <main className="main-content-wide">
        {/* Introduction */}
        <div className="section-card text-center mb-8">
          <h2 className="section-subtitle">The Goal</h2>
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
              <p className="body-text mb-2">
                <strong>Insert corner-edge pairs</strong> into the 4 slots around the bottom layer.
              </p>
              <p className="help-text mb-3">
                Each pattern shows all 4 color variations.
                Focus on recognizing the <em>relationship</em> between corner and edge, not specific colors.
              </p>
              <p className="text-sm text-slate-500">
                <strong>Learning strategy:</strong> F2L can be learned intuitively by understanding how moves
                affect pairs, or algorithmically by memorizing solutions.
                Start intuitive—understand <em>why</em> moves work—then optimize specific cases.
                Left-slot and right-slot algorithms are mirrors; learn one side, then adapt.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Patterns */}
        <h2 className="section-subtitle-centered">
          Basic Patterns
        </h2>
        <p className="text-gray-600 text-center mb-6 max-w-2xl mx-auto">
          The fundamental F2L cases. Corner and edge both on U layer.
          Left-handed algorithms (L moves) for FL slot, right-handed (R moves) for FR slot.
        </p>

        {/* Case 1: Joined Pair - Easy Insert */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">1. Joined Pair - Easy Insert</h3>
          <p className="help-text mb-6 text-center">
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
              algorithm={{ full: "U' L' U L", shorthand: "{left-sexy}'" }}
              generateFaces={(c) => ({
                // Joined pair: corner at UFL (white front), edge at UL
                top: makeFace(Color.YELLOW, {
                  6: c.left,
                  3: c.left,
                }),
                front: makeLeftFront(c, { 0: Color.WHITE }),
                left: makeLeftSide(c, {
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
              algorithm={{ full: "U R U' R'", shorthand: "{sexy}'" }}
              generateFaces={(c) => ({
                // Joined pair: corner at UFR (white front), edge at UR
                top: makeFace(Color.YELLOW, {
                  8: c.right,
                  5: c.right,
                }),
                front: makeRightFront(c, { 2: Color.WHITE }),
                right: makeRightSide(c, {
                  0: c.front,
                  1: c.front,
                }),
              })}
            />
          </div>
        </div>

        {/* Case 2: Split Pair - Three Move Insert */}
        <div className="case-group">
          <h3 className="card-title-centered mb-2">2. Split Pair - Three Move Insert</h3>
          <p className="help-text mb-6 text-center">
            Corner and edge separated. Corner in front with white facing sideways.
            Edge in back with front-color facing up.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Slot (FL) - L' U' L
                Corner at UFL: WHITE faces LEFT (visible on left face), L-color on top[6], F-color on front[0]
                Edge at UB: F-color faces UP (top[1]) */}
            <F2LCaseCard
              slot="left"
              algorithm={{ full: "L' U' L" }}
              generateFaces={(c) => ({
                // Split pair: corner at UFL (white left), edge at UB
                top: makeFace(Color.YELLOW, {
                  6: c.left,
                  1: c.front,
                }),
                front: makeLeftFront(c, { 0: c.front }),
                left: makeLeftSide(c, { 2: Color.WHITE }),
              })}
            />

            {/* Right Slot (FR) - R U R'
                Corner at UFR: WHITE faces RIGHT (right[0]), R-color on top[8], F-color on front[2]
                Edge at UB: F-color faces UP (top[1]) */}
            <F2LCaseCard
              slot="right"
              algorithm={{ full: "R U R'" }}
              generateFaces={(c) => ({
                // Split pair: corner at UFR (white right), edge at UB
                top: makeFace(Color.YELLOW, {
                  8: c.right,
                  1: c.front,
                }),
                front: makeRightFront(c, { 2: c.front }),
                right: makeRightSide(c, { 0: Color.WHITE }),
              })}
            />
          </div>
        </div>

        {/* More cases coming soon */}
        <div className="section-card text-center">
          <p className="text-gray-500 italic">More F2L cases coming soon...</p>
        </div>
      </main>
    </>
  )
}
