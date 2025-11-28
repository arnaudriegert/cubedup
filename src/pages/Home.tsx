import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="page-bg">
      <div className="sticky top-0 z-20">
        <header className="header-gradient text-center py-12">
          <h1 className="text-5xl font-bold mb-3">
            CFOP Method Learning Guide
          </h1>
          <p className="text-lg opacity-90">
            Master speedcubing through systematic learning with symmetry-based algorithms
          </p>
        </header>
      </div>

      <main className="max-w-5xl mx-auto px-8 py-12">
        <section className="card mb-16 text-center p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">The CFOP Method</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            CFOP (Cross, F2L, OLL, PLL) is the most popular speedsolving method for the Rubik's Cube.
            This guide helps you learn efficiently by leveraging symmetries and building on algorithms you already know.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="feature-card">
              <h3 className="text-xl font-bold text-gray-800 mb-2">1. Cross</h3>
              <p className="text-gray-600 mb-4">Solve the white cross on the bottom layer</p>
              <span className="text-sm text-gray-500 italic">Coming Soon</span>
            </div>

            <div className="feature-card-active">
              <h3 className="text-xl font-bold text-gray-800 mb-2">2. F2L</h3>
              <p className="text-gray-700 mb-4">First Two Layers - pair and insert corners with edges</p>
              <Link to="/f2l" className="btn-primary">
                Start Learning →
              </Link>
            </div>

            <div className="feature-card-active">
              <h3 className="text-xl font-bold text-gray-800 mb-2">3. OLL</h3>
              <p className="text-gray-700 mb-4">Orient Last Layer - 57 cases organized by symmetry</p>
              <Link to="/oll" className="btn-primary">
                Start Learning →
              </Link>
            </div>

            <div className="feature-card-active">
              <h3 className="text-xl font-bold text-gray-800 mb-2">4. PLL</h3>
              <p className="text-gray-700 mb-4">Permute Last Layer - 21 algorithms organized by symmetry</p>
              <Link to="/pll" className="btn-primary">
                Start Learning →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 text-gray-600">
        <p>&copy; 2025 CFOP Learning Guide</p>
      </footer>
    </div>
  )
}
