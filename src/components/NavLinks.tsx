import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/cross', label: '1. Cross' },
  { path: '/f2l', label: '2. F2L' },
  { path: '/oll', label: '3. OLL' },
  { path: '/pll', label: '4. PLL' },
]

type Props = {
  onLinkClick?: () => void
  showDivider?: boolean
}

export default function NavLinks({ onLinkClick, showDivider }: Props) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {navLinks.map((link, index) => (
        <div key={link.path}>
          {showDivider && index === 1 && (
            <div className="mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
              Learning Path
            </div>
          )}
          <Link
            to={link.path}
            onClick={onLinkClick}
            className={isActive(link.path) ? 'sidebar-link-active' : 'sidebar-link'}
          >
            {link.label}
          </Link>
        </div>
      ))}
    </>
  )
}
