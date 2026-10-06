import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X, Plus } from 'lucide-react'
import Logo from './Logo'

const nav = [
  { to: '/trails', label: 'Explore map' },
  { to: '/places', label: 'Hidden places' },
  { to: '/community', label: 'Community' },
  { to: '/passport', label: 'My passport' },
] as const

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-cedar/10 bg-limestone/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo />
          <span className="font-display text-xl font-semibold tracking-tight text-cedar">
            Lebanon <em className="font-normal text-clay">Trails</em>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-cedar/80 transition hover:bg-cedar/5 hover:text-cedar"
              activeProps={{ className: '!bg-cedar !text-limestone' }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/community"
            className="hidden items-center gap-1.5 rounded-full bg-clay px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-clay-600 sm:inline-flex"
          >
            <Plus size={16} /> Share a hike
          </Link>
          <button
            className="rounded-full p-2 text-cedar hover:bg-cedar/5 md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-cedar/10 bg-limestone px-5 py-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 font-medium text-cedar hover:bg-cedar/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
