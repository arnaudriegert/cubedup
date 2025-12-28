import { Link, useLocation } from 'react-router-dom'

const topLinks = [
  { path: '/', label: 'Home' },
  { path: '/playground', label: 'Playground' },
]

type NavLink = { path: string; label: string }
type NavItem = NavLink | { label: string; children: NavLink[] }

const stepsLinks: NavItem[] = [
  { path: '/cross', label: 'Cross' },
  { path: '/f2l', label: 'F2L' },
  {
    label: 'OLL',
    children: [
      { path: '/oll/2-look', label: '2-Look' },
      { path: '/oll/full', label: 'Full' },
    ],
  },
  { path: '/pll', label: 'PLL' },
]

const referenceLinks = [
  { path: '/triggers', label: 'Triggers' },
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

  const renderLink = (link: NavLink, isChild = false) => (
    <Link
      key={link.path}
      to={link.path}
      onClick={onLinkClick}
      className={`${isActive(link.path) ? 'sidebar-link-active' : 'sidebar-link'} ${isChild ? 'sidebar-link-child' : ''}`}
    >
      {link.label}
    </Link>
  )

  const renderNavItem = (item: NavItem) => {
    if ('path' in item) {
      return renderLink(item)
    }

    // Group with children
    return (
      <div key={item.label}>
        <div className="sidebar-group-label">{item.label}</div>
        {item.children.map((child) => renderLink(child, true))}
      </div>
    )
  }

  return (
    <>
      {/* Top level links */}
      {topLinks.map((link) => renderLink(link))}

      {/* Steps section */}
      {showDivider && (
        <div className="mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
          Steps
        </div>
      )}
      {stepsLinks.map(renderNavItem)}

      {/* Reference section */}
      {showDivider && (
        <div className="mt-6 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider px-3">
          Reference
        </div>
      )}
      {referenceLinks.map((link) => renderLink(link))}
    </>
  )
}
