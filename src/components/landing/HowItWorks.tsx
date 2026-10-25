const steps = [
  {
    time: 'Ahora',
    title: 'Envía tu perfil',
    description: 'Comparte tu @ y categoría. Es gratis y no necesitas CV.',
  },
  {
    time: 'Máximo 3 días',
    title: 'Revisamos tu perfil',
    description: 'Te contactamos por email para contarte los siguientes pasos.',
  },
  {
    time: 'Después de aprobar',
    title: 'Empieza tu plan',
    description: 'Recibe diagnóstico, formación y asesoría para tus transmisiones.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="relative scroll-mt-24 px-5 py-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/40 to-transparent"
      />
      <div className="mx-auto max-w-md">
        <div>
          <p className="font-display text-xs font-semibold uppercase text-brand-200">El proceso</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">
            Qué pasa después
          </h2>
        </div>

        <ol className="mt-6 list-none divide-y divide-white/10">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4 py-4 animate-fade-up" style={{ animationDelay: `${index * 90}ms` }}>
              <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-brand-500/20 font-display text-xs font-bold text-brand-200">
                {index + 1}
              </span>
              <div>
                <p className="text-xs font-medium text-brand-200">{step.time}</p>
                <h3 className="mt-1 font-display text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/60">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5">
          <a href="#postular" className="btn-primary w-full">
            Postular gratis
          </a>
        </div>
      </div>
    </section>
  )
}
