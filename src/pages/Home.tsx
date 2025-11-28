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

      <main className="main-content-narrow">
        <section className="card mb-16 text-center p-8">
          <h2 className="page-title">The CFOP Method</h2>
          <p className="body-text-lg">
            CFOP (Cross, F2L, OLL, PLL) is the most popular speedsolving method for the Rubik's Cube.
            This guide helps you learn efficiently by leveraging symmetries and building on algorithms you already know.
          </p>
        </section>

        <section>
          <h2 className="page-title-centered">Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="feature-card-active">
              <h3 className="card-title">1. Cross</h3>
              <p className="body-text-description">Efficient cross planning techniques</p>
              <Link to="/cross" className="btn-primary">
                Start Learning →
              </Link>
            </div>

            <div className="feature-card-active">
              <h3 className="card-title">2. F2L</h3>
              <p className="body-text-description">First Two Layers - pair and insert corners with edges</p>
              <Link to="/f2l" className="btn-primary">
                Start Learning →
              </Link>
            </div>

            <div className="feature-card-active">
              <h3 className="card-title">3. OLL</h3>
              <p className="body-text-description">Orient Last Layer - 57 cases organized by symmetry</p>
              <Link to="/oll" className="btn-primary">
                Start Learning →
              </Link>
            </div>

            <div className="feature-card-active">
              <h3 className="card-title">4. PLL</h3>
              <p className="body-text-description">Permute Last Layer - 21 algorithms organized by symmetry</p>
              <Link to="/pll" className="btn-primary">
                Start Learning →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <p>&copy; 2025 CFOP Learning Guide</p>
      </footer>
    </div>
  )
}
