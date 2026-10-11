import { useEffect, useState } from 'react'
import { LogoMark } from '../Logo'

const links = [
  { href: '#como-funciona', label: 'Plan' },
  { href: '#postular', label: 'Postular' },
]

interface NavbarProps {
  onOpenPanel: () => void
}

export default function Navbar({ onOpenPanel }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <nav aria-label="Principal" className="container-page flex h-20 items-center justify-between">
        <a href="#" aria-label="Live Brand, ir al inicio" className="group flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-ink-800/70 shadow-glow-sm transition group-hover:border-brand-400/50">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-glow opacity-0 blur-md transition group-hover:opacity-40" />
            <LogoMark tone="dark" className="relative h-7 w-7 transition group-hover:scale-110" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            LIVE<span className="text-brand-300">BRAND</span>
          </span>
        </a>

        <div className="hidden items-center gap-6 sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-display text-sm font-medium text-white/70 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPanel}
            className="hidden font-display text-sm font-medium text-white/60 transition hover:text-brand-200 sm:block"
          >
            Panel interno
          </button>
          <a href="#postular" className="btn-primary !px-5 !py-2.5">
            Quiero unirme
          </a>
        </div>
      </nav>
    </header>
  )
}
