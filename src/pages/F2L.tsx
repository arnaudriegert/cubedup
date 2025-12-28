import SEOHead from '../components/SEOHead'
import { PatternIntro } from '../components/PatternIntro'
import { CaseGroup4Rotations } from '../components/CaseGroup4Rotations'

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
        <PatternIntro cubeView="bottom-front-right" mask="f2l">
          <p className="body-text mb-3">
            <strong>Insert corner-edge pairs</strong> into the 4 slots around the bottom layer.
            Each pattern shows all 4 color variations—focus on the <em>relationship</em> between
            corner and edge, not specific colors.
          </p>
          <p className="help-text mb-3">
            Each case shows <strong>four cubes</strong>: the same pattern rotated to all four front
            colors. Left and right variants train both hands. The goal is instant recognition—see
            the pattern, execute without thinking.
          </p>
          <p className="text-sm text-slate-500">
            <strong>Learning strategy:</strong> F2L can be learned intuitively by understanding how moves
            affect pairs, or algorithmically by memorizing solutions.
            Start intuitive—understand <em>why</em> moves work—then optimize specific cases.
          </p>
        </PatternIntro>

        <CaseGroup4Rotations
          title="1. Joined Pair - Easy Insert"
          description="Corner and edge already paired (touching, colors aligned). Pair is in front, slot is behind. U move hides pair, then insert."
          left={{ id: 'f2l-1-left', steps: [{ ref: 'left-sexy', inverse: true }] }}
          right={{ id: 'f2l-1-right', steps: [{ ref: 'sexy', inverse: true }] }}
          mask="f2l"
        />

        <CaseGroup4Rotations
          title="2. Split Pair - Three Move Insert"
          description="Corner and edge separated. Corner in front with white facing sideways. Edge in back with front-color facing up."
          left={{ id: 'f2l-2-left', steps: [{ moves: "L' U' L" }] }}
          right={{ id: 'f2l-2-right', steps: [{ moves: "R U R'" }] }}
          mask="f2l"
        />

        <div className="section-card text-center">
          <p className="text-gray-500 italic">More F2L cases coming soon...</p>
        </div>
      </main>
    </>
  )
}
