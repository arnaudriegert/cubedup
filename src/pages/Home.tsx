import { Link } from 'react-router-dom'
import Logo from '../components/Logo'
import SEOHead from '../components/SEOHead'

export default function Home() {
  return (
    <>
      <SEOHead
        title="Home"
        description="cubedup: Learn CFOP through algorithms that unlock each other. Symmetry-based organization means learning one case unlocks its mirror."
        path="/"
      />

      <header className="header-gradient text-center py-12">
        <Logo className="size-20 mx-auto mb-4" />
        <h1 className="page-header-title-lg">
          cubedup
        </h1>
        <p className="page-header-subtitle">
          Algorithms that unlock each other
        </p>
      </header>

      <main className="main-content-narrow">
        {/* Introduction */}
        <section className="card mb-12 p-8">
          <h2 className="page-title text-center">The CFOP Method</h2>
          <p className="body-text-lg text-center mb-6">
            CFOP (Cross, F2L, OLL, PLL) is the most popular speedsolving method for the Rubik's Cube.
            This guide organizes the 57 OLL and 21 PLL algorithms by visual patterns and symmetry relationships.
          </p>
          <p className="body-text text-center text-slate-600">
            When you learn one case, you often unlock its mirror or inverse for free.
            Instead of memorizing 78 isolated algorithms, you build a connected network
            where each new case reinforces others you already know.
          </p>
        </section>

        {/* How This Guide Helps */}
        <section className="card mb-12 p-8">
          <h2 className="page-title text-center mb-8">How This Guide Helps You Learn</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Building on What You Know</h3>
              <p className="body-text text-slate-600">
                If you solve the cube using the beginner method with 2-look OLL and 2-look PLL, you already
                know the foundations. Full CFOP replaces your 2-look algorithms with single-step solutions
                for each case. This guide presents those cases in groups that share common "triggers"—short
                move sequences like the sexy move (R U R' U') that appear across dozens of algorithms.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Symmetry as a Learning Tool</h3>
              <p className="body-text text-slate-600">
                Most OLL and PLL cases come in related pairs: mirrors (left-hand vs right-hand versions)
                or inverses (algorithms that undo each other). This guide visually groups related cases
                together so you can learn both simultaneously. If you already know Sune, you can derive
                Anti-Sune by recognizing the pattern.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-800 mb-2">Pattern Recognition Through Rotation</h3>
              <p className="body-text text-slate-600">
                Each case is shown in all 4 rotational variants (front, right, back, left). This develops
                muscle memory for recognizing cases from any angle—so you don't hesitate when a familiar
                pattern appears rotated 90° from how you first learned it.
              </p>
            </div>
          </div>
        </section>

        {/* Using This Site */}
        <section className="card mb-12 p-8">
          <h2 className="page-title text-center mb-6">Using This Site</h2>
          <div className="body-text text-slate-600 space-y-4">
            <p>
              Each section offers two views. <strong>Overview</strong> displays all cases as a compact
              grid—useful for quick reference or identifying a case you just encountered.
              <strong> Detailed</strong> shows full algorithm notation with visual diagrams, organized by category.
            </p>
            <p>
              Use the category buttons to filter by shape (OLL) or piece arrangement (PLL). The search
              field accepts case numbers (OLL 1-57) or names (Ua, T-perm). Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-sm font-mono">/</kbd> to
              focus search from anywhere on the page.
            </p>
            <p>
              Algorithms shown in <strong>shorthand notation</strong> display triggers in <em>italics</em>.
              Click any algorithm to expand the full move sequence. Learning triggers
              first (see the <Link to="/triggers" className="text-indigo-600 hover:underline">Triggers section</Link>)
              makes these shorthands meaningful.
            </p>
          </div>
        </section>

        {/* The Four Steps */}
        <section>
          <h2 className="page-title-centered">The Four Steps</h2>
          <p className="body-text text-center text-slate-600 mb-8 max-w-2xl mx-auto">
            Every CFOP solve follows this sequence. You can practice and improve each step independently.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/cross" className="feature-card-active group">
              <h3 className="card-title">Cross</h3>
              <p className="body-text-description">
                Plan your cross during inspection. Efficient sequences that set up F2L.
              </p>
              <span className="text-indigo-600 group-hover:text-indigo-700 font-medium">
                Explore →
              </span>
            </Link>

            <Link to="/f2l" className="feature-card-active group">
              <h3 className="card-title">F2L</h3>
              <p className="body-text-description">
                41 cases for pairing corners with edges. Learn intuitively before memorizing.
              </p>
              <span className="text-indigo-600 group-hover:text-indigo-700 font-medium">
                Explore →
              </span>
            </Link>

            <Link to="/oll" className="feature-card-active group">
              <h3 className="card-title">OLL</h3>
              <p className="body-text-description">
                57 cases organized by top-layer shape. Related cases grouped for faster learning.
              </p>
              <span className="text-indigo-600 group-hover:text-indigo-700 font-medium">
                Explore →
              </span>
            </Link>

            <Link to="/pll" className="feature-card-active group">
              <h3 className="card-title">PLL</h3>
              <p className="body-text-description">
                21 cases organized by what moves where. Headlights and swap patterns.
              </p>
              <span className="text-indigo-600 group-hover:text-indigo-700 font-medium">
                Explore →
              </span>
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
