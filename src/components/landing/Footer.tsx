import Logo from '../Logo'

interface FooterProps {
  onOpenPanel: () => void
}

export default function Footer({ onOpenPanel }: FooterProps) {
  return (
    <footer className="border-t border-white/10 bg-ink-950/70 px-5 pb-8 pt-7">
      <div className="mx-auto flex max-w-md flex-col gap-5">
        <div>
          <a href="#" className="inline-flex items-center">
            <Logo tone="dark" />
          </a>
          <p className="mt-2 text-xs text-white/55">
            Agencia oficial de TikTok LIVE · LATAM
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-white/60">
            <a href="#como-funciona" className="transition hover:text-brand-200">Plan</a>
            <a href="#postular" className="transition hover:text-brand-200">Postular</a>
            <button onClick={onOpenPanel} className="transition hover:text-brand-200">Panel interno</button>
          </nav>
          <p className="text-[11px] text-white/40">© {new Date().getFullYear()} Live Brand</p>
        </div>
      </div>
    </footer>
  )
}
