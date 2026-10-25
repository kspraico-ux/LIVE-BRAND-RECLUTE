import HeroBackdrop from './HeroBackdrop'
import CreatorMarquee from './CreatorMarquee'

interface HeroProps {
  onApply: () => void
}

export default function Hero({ onApply }: HeroProps) {
  return (
    <section className="relative overflow-hidden pb-10 pt-24 sm:pt-28 lg:pt-32">
      <div className="pointer-events-none absolute inset-0">
        <HeroBackdrop />
      </div>
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl px-5">
        <p className="font-display text-xs font-semibold uppercase text-brand-200 animate-fade-up">
          Agencia oficial de TikTok LIVE · LATAM
        </p>

        <h1 className="mt-4 max-w-5xl font-display text-[2.75rem] font-extrabold leading-[1.02] text-white animate-fade-up [animation-delay:60ms] sm:text-6xl lg:text-8xl">
          Tus lives pueden llegar{' '}
          <span className="bg-gradient-to-r from-brand-300 via-glow to-brand-400 bg-clip-text text-transparent">
            mucho más lejos
          </span>
        </h1>

        <div className="mt-5 flex flex-col gap-5 sm:mt-7 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-white/70 animate-fade-up [animation-delay:120ms] sm:text-base">
            Si TikTok LATAM te aprobó como talento emergente, postula gratis para acceder a formación
            y asesoría para tus transmisiones.
          </p>
          <button onClick={onApply} className="btn-primary min-h-12 w-full flex-none animate-fade-up [animation-delay:180ms] sm:w-auto">
            Empezar mi postulación
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="mt-3 text-xs text-white/50">
          Gratis · Sin compromiso · Respuesta en un máximo de 3 días
        </p>
      </div>

      <CreatorMarquee />
    </section>
  )
}
