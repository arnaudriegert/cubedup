import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/oll') {
      return location.pathname.startsWith('/oll')
    }
    return location.pathname === path
  }

  return (
    <nav className="sidebar">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-indigo-700 mb-1">CFOP Guide</h2>
        <p className="text-slate-500 text-sm">Rubik's Cube</p>
      </div>

      <div className="space-y-1">
        <Link
          to="/"
          className={isActive('/') || isActive('') ? 'sidebar-link-active' : 'sidebar-link'}
        >
          Home
        </Link>

        <div className="mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
          Learning Path
        </div>

        <div className="sidebar-link opacity-50 cursor-not-allowed">
          1. Cross
        </div>
        <div className="sidebar-link opacity-50 cursor-not-allowed">
          2. F2L
        </div>
        <Link
          to="/oll"
          className={isActive('/oll') ? 'sidebar-link-active' : 'sidebar-link'}
        >
          3. OLL
        </Link>
        <div className="sidebar-link opacity-50 cursor-not-allowed">
          4. PLL
        </div>
      </div>
    </nav>
  )
}
