import { LogoMark } from '../Logo'

const steps = [
  {
    time: 'Minuto 0 · 2 minutos',
    title: 'Postula gratis, sin CV',
    description:
      'Completa el formulario con tu @ y tu categoría. Sin carta de presentación y sin pagar nada.',
  },
  {
    time: 'Días 1 a 3 · Contacto de un pilar',
    title: 'Te contacta un pilar de la agencia',
    description:
      'Un pilar de Live Brand revisa tu perfil a mano y te escribe en menos de 48 h (máximo 3 días) por WhatsApp o email.',
  },
  {
    time: 'Semana 1 · Diagnóstico + clases',
    title: 'Llamada de diagnóstico y primeras clases',
    description:
      'Conversamos sobre tus metas y arrancas con clases gratuitas de profesionales de TikTok y de crecimiento digital.',
  },
  {
    time: 'Semanas 2 a 4 · Plan en vivo',
    title: 'Primer live con equipo y plan medible',
    description:
      'Sales con formato, horario y metas de vistas y diamantes, con equipo para wars y soporte durante la transmisión.',
  },
]

const pad = (index: number): string => String(index + 1).padStart(2, '0')

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative scroll-mt-24 py-24">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent"
      />
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">
            <LogoMark tone="dark" className="h-4 w-4" alt="" />
            Plan de reclutamiento
          </span>
          <h2 className="section-title mt-6">
            Cómo <span className="text-brand-300">funciona</span>
          </h2>
          <p className="mt-5 text-white/60">
            Un plan con tiempos claros: desde que postulas hasta que transmites con estructura.
            Sin letra chica y sin costos para ti.
          </p>
        </div>

        <ol className="relative mt-14 grid list-none gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative animate-fade-up rounded-2xl border border-white/10 bg-ink-800/60 p-6 backdrop-blur-xl transition duration-300 hover:border-brand-400/40"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[46px] hidden h-px w-6 bg-gradient-to-r from-brand-400/60 to-glow/60 lg:block"
                />
              )}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-6 left-[68px] top-[46px] hidden h-px bg-gradient-to-r from-brand-400/60 to-glow/60 lg:block"
                />
              )}
              {index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[46px] top-full h-6 w-px bg-gradient-to-b from-brand-400/60 to-glow/40 md:hidden"
                />
              )}

              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-sm font-bold text-white shadow-glow-sm">
                  {index + 1}
                </span>
                <span className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                  Paso {pad(index)}
                </span>
              </div>

              <p className="mt-4 font-display text-[11px] font-semibold uppercase tracking-[0.14em] text-glow">
                {step.time}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-white">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{step.description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
          <a href="#postular" className="btn-primary">
            Empezar mi postulación
          </a>
          <p className="text-xs text-white/60">
            Cupos limitados por categoría este mes · Respuesta en menos de 48 h (máximo 3 días).
          </p>
        </div>
      </div>
    </section>
  )
}
