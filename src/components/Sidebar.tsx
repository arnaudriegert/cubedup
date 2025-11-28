import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/oll') {
      return location.pathname.startsWith('/oll')
    }
    if (path === '/pll') {
      return location.pathname.startsWith('/pll')
    }
    if (path === '/cross') {
      return location.pathname.startsWith('/cross')
    }
    if (path === '/f2l') {
      return location.pathname.startsWith('/f2l')
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

        <Link
          to="/cross"
          className={isActive('/cross') ? 'sidebar-link-active' : 'sidebar-link'}
        >
          1. Cross
        </Link>
        <Link
          to="/f2l"
          className={isActive('/f2l') ? 'sidebar-link-active' : 'sidebar-link'}
        >
          2. F2L
        </Link>
        <Link
          to="/oll"
          className={isActive('/oll') ? 'sidebar-link-active' : 'sidebar-link'}
        >
          3. OLL
        </Link>
        <Link
          to="/pll"
          className={isActive('/pll') ? 'sidebar-link-active' : 'sidebar-link'}
        >
          4. PLL
        </Link>
      </div>
    </nav>
  )
}
