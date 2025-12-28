import { Cube, CubeDisplay } from '../components/cube'
import { CaseCard4Rotations } from '../components/CaseCard.4Rotations'
import SEOHead from '../components/SEOHead'
import { createSolvedCube } from '../utils/cubeState'
import { applyMask } from '../utils/pieceIdentity'

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
            <CubeDisplay>
              <Cube
                cubeState={applyMask(createSolvedCube(), 'f2l')}
                view="bottom-front-right"
                size="normal"
              />
            </CubeDisplay>
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
            <CaseCard4Rotations
              isLeft
              algorithm={{ id: 'f2l-1-left', steps: [{ ref: 'left-sexy', inverse: true }] }}
              mask="f2l"
            />
            <CaseCard4Rotations
              algorithm={{ id: 'f2l-1-right', steps: [{ ref: 'sexy', inverse: true }] }}
              mask="f2l"
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
            <CaseCard4Rotations
              isLeft
              algorithm={{ id: 'f2l-2-left', steps: [{ moves: "L' U' L" }] }}
              mask="f2l"
            />
            <CaseCard4Rotations
              algorithm={{ id: 'f2l-2-right', steps: [{ moves: "R U R'" }] }}
              mask="f2l"
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
