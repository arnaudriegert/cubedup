import { useState } from 'react'
import NavLinks from './NavLinks'

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile: Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mobile-nav-toggle"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
      >
        <span className={`hamburger-line ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
        <span className={`hamburger-line ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`hamburger-line ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
      </button>

      {/* Mobile: Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile: Slide-out menu */}
      <nav className={`mobile-nav-menu md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-indigo-700">CFOP Guide</h2>
          <p className="text-slate-500 text-sm">Rubik's Cube</p>
        </div>
        <div className="p-4 space-y-1">
          <NavLinks onLinkClick={() => setIsOpen(false)} />
        </div>
      </nav>

      {/* Desktop: Sidebar */}
      <nav className="sidebar hidden md:block">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-indigo-700 mb-1">CFOP Guide</h2>
          <p className="text-slate-500 text-sm">Rubik's Cube</p>
        </div>
        <div className="space-y-1">
          <NavLinks showDivider />
        </div>
      </nav>
    </>
  )
}
