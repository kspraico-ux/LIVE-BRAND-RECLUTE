import { useEffect, useState } from 'react'
import { LogoMark } from '../Logo'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-[480px] overflow-x-clip transition duration-300 ${
        scrolled ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      <nav aria-label="Principal" className="flex h-16 min-w-0 items-center justify-between px-5">
        <a href="#" aria-label="Live Brand, ir al inicio" className="group flex min-w-0 items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-ink-800/70 shadow-glow-sm transition group-hover:border-brand-400/50">
            <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-500 to-glow opacity-0 blur-md transition group-hover:opacity-40" />
            <LogoMark tone="dark" className="relative h-7 w-7 transition group-hover:scale-110" />
          </span>
          <span className="whitespace-nowrap font-display text-lg font-bold tracking-tight">
            LIVE<span className="text-brand-300">BRAND</span>
          </span>
        </a>

        <a href="#postular" className="btn-primary !shrink-0 !px-3 !py-2.5 !shadow-none hover:!shadow-none text-xs">
          Postular
        </a>
      </nav>
    </header>
  )
}
