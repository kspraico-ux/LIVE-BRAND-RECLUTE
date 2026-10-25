import { LogoMark } from '../Logo'
import HeroBackdrop from './HeroBackdrop'

interface HeroProps {
  onApply: () => void
}

export default function Hero({ onApply }: HeroProps) {
  return (
    <section className="relative overflow-hidden px-5 pb-8 pt-24">
      <div className="pointer-events-none absolute inset-0">
        <HeroBackdrop />
      </div>
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-600/25 blur-[100px]" />

      <div className="relative mx-auto max-w-md">
        <div className="mb-7 flex items-center gap-3 animate-fade-up">
          <LogoMark tone="dark" className="h-10 w-10" />
          <div>
            <p className="font-display text-sm font-bold text-white">LIVE BRAND</p>
            <p className="text-xs text-white/55">Agencia oficial de TikTok LIVE · LATAM</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-1.5 font-display text-[11px] font-semibold text-emerald-200 animate-fade-up [animation-delay:30ms]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
          Gratis · Sin compromiso
        </span>

        <h1 className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.05] text-white animate-fade-up [animation-delay:60ms]">
          Haz crecer tus{' '}
          <span className="bg-gradient-to-r from-brand-300 via-glow to-brand-400 bg-clip-text text-transparent">
            lives
          </span>{' '}
          en TikTok
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-white/70 animate-fade-up [animation-delay:120ms]">
          Si TikTok LATAM te aprobó como talento emergente, postula para recibir formación y
          asesoría gratuita.
        </p>

        <div className="mt-6 flex flex-col gap-3 animate-fade-up [animation-delay:180ms]">
          <button onClick={onApply} className="btn-primary min-h-12 w-full">
            Empezar mi postulación
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <a href="#como-funciona" className="py-2 text-center text-sm font-medium text-white/65 underline decoration-white/25 underline-offset-4">
            ¿Cómo funciona?
          </a>
        </div>

        <p className="mt-2 text-center text-xs text-white/50">
          Revisión de perfil · Respuesta en un máximo de 3 días
        </p>
      </div>
    </section>
  )
}
