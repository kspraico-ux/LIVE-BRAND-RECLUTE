import Logo, { LogoMark } from '../Logo'

interface FooterProps {
  onOpenPanel: () => void
}

export default function Footer({ onOpenPanel }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink-950/70 pb-28 pt-14 sm:pb-14">
      <LogoMark
        tone="dark"
        className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 opacity-[0.06]"
        alt=""
      />

      <div className="container-page relative flex flex-col items-center justify-between gap-8 sm:flex-row">
        <div className="text-center sm:text-left">
          <a href="#" className="inline-flex items-center justify-center sm:justify-start">
            <Logo tone="dark" />
          </a>
          <p className="mt-3 max-w-sm text-sm text-white/60">
            Agencia oficial de TikTok LIVE · LATAM. Crece tus lives con clases y asesorías
            gratuitas.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 sm:items-end">
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/55">
            <a href="#como-funciona" className="transition hover:text-brand-200">Plan</a>
            <a href="#postular" className="transition hover:text-brand-200">Postular</a>
            <button onClick={onOpenPanel} className="transition hover:text-brand-200">Panel interno</button>
          </nav>
          <div className="flex items-center gap-2 text-xs text-white/55">
            <LogoMark tone="dark" className="h-4 w-4 opacity-70" alt="" />
            <span>© {new Date().getFullYear()} Live Brand. Todos los derechos reservados.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
