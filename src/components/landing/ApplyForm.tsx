import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import type { Applicant, NewApplicantData } from '../../types'
import { submitToFormspree } from '../../services/formspree'
import { avatarColor, initials } from '../../utils/ui'
import { LogoMark } from '../Logo'

type FormState = {
  name: string
  handle: string
  followers: string
  avgViewers: string
  hoursPerWeek: string
  category: string
  email: string
  phone: string
  availability: string
  source: string
  note: string
}

type ErrorField = keyof FormState | 'approved'

type FormErrors = Partial<Record<ErrorField, string>>

type Step = 1 | 2

type SendStatus = 'idle' | 'sending' | 'failed'

const initialForm: FormState = {
  name: '',
  handle: '',
  followers: '',
  avgViewers: '',
  hoursPerWeek: '',
  category: '',
  email: '',
  phone: '',
  availability: '',
  source: '',
  note: '',
}

const categories = ['Gaming', 'Música en vivo', 'Lifestyle', 'Q&A / Charla', 'Deportes', 'Belleza', 'Otro']

const sources = [
  'TikTok (un live o un video)',
  'Instagram / YouTube',
  'Me lo recomendó un amigo',
  'Búsqueda en Google',
  'Otro',
]

const perks = [
  'Clases en vivo con profesionales de TikTok y coaches de crecimiento digital',
  'Asesorías 1:1 de estrategia, ritmo y comunidad para cada transmisión',
  'Plan de diamantes: más regalos, más vistas y más ingresos por live',
  'Sin costo de inscripción, sin matrícula y sin permanencia mínima',
]

const nextSteps = [
  'Envías tu perfil de TikTok en 2 minutos',
  'En menos de 48 h (máx. 3 días) te contacta un pilar de la agencia',
  'Entras a las clases gratuitas y arrancas tu plan de crecimiento',
]

const proofAvatars = ['Luna Vargas', 'Mateo Cruz', 'Sofía Rivas', 'Kevin Ortiz']

type QuickOption = { label: string; value: string }

const quickPicks: Partial<Record<keyof FormState, QuickOption[]>> = {
  followers: [
    { label: '< 1k', value: '900' },
    { label: '1k – 10k', value: '5000' },
    { label: '10k – 100k', value: '50000' },
    { label: '100k +', value: '250000' },
  ],
  avgViewers: [
    { label: '< 100', value: '80' },
    { label: '100 – 500', value: '300' },
    { label: '500 – 2k', value: '1200' },
    { label: '2k +', value: '4000' },
  ],
  hoursPerWeek: [
    { label: '5 h', value: '5' },
    { label: '10 h', value: '10' },
    { label: '20 h', value: '20' },
    { label: '40 h', value: '40' },
  ],
}

const stepFields: Record<Step, (keyof FormState)[]> = {
  1: ['handle', 'category', 'followers', 'avgViewers', 'hoursPerWeek'],
  2: ['name', 'email'],
}

const normalizeHandle = (value: string): string =>
  value.trim().replace(/^@+/, '').toLowerCase()

const clearOrSet = (
  errors: FormErrors,
  field: ErrorField,
  message: string | undefined,
): FormErrors => {
  const next = { ...errors }
  if (message) next[field] = message
  else delete next[field]
  return next
}

interface QuickPicksProps {
  field: keyof FormState
  value: string
  onPick: (value: string) => void
}

function QuickPicks({ field, value, onPick }: QuickPicksProps) {
  const options = quickPicks[field]
  if (!options) return null

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onPick(option.value)}
            className={`rounded-lg border px-2.5 py-1 font-display text-[11px] font-medium transition ${
              active
                ? 'border-brand-400 bg-brand-500/25 text-white shadow-glow-sm'
                : 'border-white/10 bg-white/5 text-white/55 hover:border-brand-400/50 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

interface ApplyFormProps {
  onSubmit: (data: NewApplicantData) => Applicant
  takenHandles?: string[]
}

export default function ApplyForm({ onSubmit, takenHandles = [] }: ApplyFormProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [step, setStep] = useState<Step>(1)
  const [submitted, setSubmitted] = useState<Applicant | null>(null)
  const [status, setStatus] = useState<SendStatus>('idle')
  const [sendError, setSendError] = useState<string | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [showOptional, setShowOptional] = useState(false)
  const [approved, setApproved] = useState(false)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    stepHeadingRef.current?.focus()
  }, [step])

  const takenSet = takenHandles.map(normalizeHandle)

  const validateField = (
    field: keyof FormState,
    state: FormState = form,
  ): string | undefined => {
    switch (field) {
      case 'handle':
        if (!/^@?[a-zA-Z0-9._]{2,}$/.test(state.handle.trim())) return 'Ejemplo: @tucuenta'
        if (takenSet.includes(normalizeHandle(state.handle))) return 'Ese @ ya está en revisión'
        return undefined
      case 'followers':
        if (state.followers && (!Number.isFinite(Number(state.followers)) || Number(state.followers) < 0))
          return 'Indica un número válido'
        return undefined
      case 'avgViewers':
        if (state.avgViewers && (!Number.isFinite(Number(state.avgViewers)) || Number(state.avgViewers) < 0))
          return 'Indica un número válido'
        return undefined
      case 'hoursPerWeek':
        if (state.hoursPerWeek && (!Number.isFinite(Number(state.hoursPerWeek)) || Number(state.hoursPerWeek) < 0))
          return 'Indica un número válido'
        return undefined
      case 'category':
        if (!state.category) return 'Selecciona una categoría'
        return undefined
      case 'name':
        if (state.name.trim().length < 3) return 'Ingresa tu nombre completo'
        return undefined
      case 'email':
        if (!state.email.includes('@')) return 'Email inválido'
        return undefined
      default:
        return undefined
    }
  }

  const validateStep = (target: Step): FormErrors => {
    const next: FormErrors = {}
    for (const field of stepFields[target]) {
      const message = validateField(field)
      if (message) next[field] = message
    }
    if (target === 1 && !approved) {
      next.approved = 'Confirma tu aprobación por TikTok LATAM para postular'
    }
    return next
  }

  const update =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      const { value } = event.target
      const next = { ...form, [field]: value }
      setForm(next)
      setErrors((prev) => clearOrSet(prev, field, validateField(field, next)))
    }

  const pick = (field: keyof FormState) => (value: string): void => {
    const next = { ...form, [field]: value }
    setForm(next)
    setErrors((prev) => clearOrSet(prev, field, validateField(field, next)))
  }

  const touch = (field: keyof FormState) => (): void => {
    setErrors((prev) => clearOrSet(prev, field, validateField(field)))
  }

  const toggleApproved = (event: ChangeEvent<HTMLInputElement>): void => {
    const checked = event.target.checked
    setApproved(checked)
    setErrors((prev) =>
      clearOrSet(prev, 'approved', checked ? undefined : 'Confirma tu aprobación por TikTok LATAM para postular'),
    )
  }

  const goToStep2 = (): void => {
    setAttempted(true)
    const nextErrors = validateStep(1)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    setErrors({})
    setStep(2)
  }

  const goToStep1 = (): void => {
    setErrors({})
    setAttempted(false)
    setStep(1)
  }

  const buildPayload = (data: NewApplicantData): Record<string, string> => ({
    _subject: `Nueva inscripción Live Brand · ${data.handle}`,
    _gotcha: '',
    fuente: 'Landing · Inscripción gratuita',
    url: typeof window === 'undefined' ? '' : window.location.href,
    nombre: data.name,
    tiktok: data.handle,
    email: data.email,
    telefono: data.phone?.trim() || 'No indicado',
    categoria: data.category ?? 'Sin categoría',
    seguidores: String(data.followers),
    viewers_promedio: String(data.avgViewers),
    horas_semana: data.hoursPerWeek ? String(data.hoursPerWeek) : 'No indicadas',
    disponibilidad: data.availability?.trim() || 'No indicada',
    como_enteraste: data.source?.trim() || 'No indicado',
    mensaje: data.note?.trim() || 'Sin mensaje',
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setAttempted(true)

    if (step === 1) {
      goToStep2()
      return
    }

    if (status === 'sending') return

    const step1Errors = validateStep(1)
    if (Object.keys(step1Errors).length) {
      setErrors(step1Errors)
      setStep(1)
      return
    }

    const step2Errors = validateStep(2)
    if (Object.keys(step2Errors).length) {
      setErrors(step2Errors)
      return
    }

    const normalized: NewApplicantData = {
      ...form,
      name: form.name.trim(),
      handle: form.handle.trim().startsWith('@') ? form.handle.trim() : `@${form.handle.trim()}`,
      followers: form.followers ? Number(form.followers) : 0,
      avgViewers: form.avgViewers ? Number(form.avgViewers) : 0,
      hoursPerWeek: Number(form.hoursPerWeek || 0),
    }

    void (async () => {
      setStatus('sending')
      setSendError(null)

      const result = await submitToFormspree(buildPayload(normalized))

      if (!result.ok) {
        setStatus('failed')
        setSendError(result.error)
        return
      }

      const applicant = onSubmit(normalized)
      setSubmitted(applicant)
      setForm(initialForm)
      setErrors({})
      setStep(1)
      setStatus('idle')
      setSendError(null)
      setAttempted(false)
      setShowOptional(false)
      setApproved(false)
    })()
  }

  const fieldAria = (field: keyof FormErrors) =>
    errors[field]
      ? ({ 'aria-invalid': true, 'aria-describedby': `${field}-error` } as const)
      : {}

  const errorFor = (field: keyof FormErrors): ReactNode =>
    errors[field] ? (
      <p id={`${field}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-300">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
        </svg>
        {errors[field]}
      </p>
    ) : null

  const errorCount = Object.values(errors).filter(Boolean).length
  const showSummary = attempted && errorCount > 0

  if (submitted) {
    return (
      <section id="postular" className="relative scroll-mt-24 py-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/30 blur-[150px]" />
        <div className="container-page relative">
          <div className="card mx-auto max-w-2xl animate-fade-up p-8 text-center sm:p-12" role="status" aria-live="polite">
            <div className="relative mx-auto h-16 w-16">
              <div className="grid h-16 w-16 place-items-center rounded-2xl border border-brand-400/40 bg-ink-900 shadow-glow">
                <LogoMark tone="dark" className="h-10 w-10 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]" />
              </div>
              <span className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-white ring-4 ring-ink-800">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3.5">
                  <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>

            <span className="mt-6 inline-flex rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-200">
              Inscripción gratuita
            </span>

            <h3 className="mt-4 font-display text-3xl font-bold text-white">¡Inscripción enviada!</h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/60">
              Listo, <span className="text-brand-300">{submitted.name}</span>. Tu perfil de{' '}
              <span className="text-brand-300">{submitted.handle}</span> quedó en revisión con estado{' '}
              <span className="text-amber-300">Pendiente</span>. Te escribimos a{' '}
              <span className="text-brand-300">{submitted.email}</span> en menos de 48 h (máximo
              3 días) un pilar de la agencia, con tu diagnóstico gratis.
            </p>

            <ol className="mx-auto mt-8 grid max-w-md gap-3 text-left">
              {nextSteps.map((item, index) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-[11px] font-bold text-white">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#como-funciona" className="btn-primary">
                Ver el plan de reclutamiento
              </a>
              <button onClick={() => setSubmitted(null)} className="btn-ghost">
                Inscribir otro perfil
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="postular" className="relative scroll-mt-24 pb-24 pt-10 sm:pt-14">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/30 blur-[150px]" />
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-glow/15 blur-[120px]" />

      <div className="container-page relative">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <span className="eyebrow animate-fade-up">
              <LogoMark tone="dark" className="h-4 w-4" alt="" />
              Inscripción 100% gratuita
            </span>
            <h2 className="section-title mt-6 animate-fade-up">
              Aprende con profesionales de <span className="text-brand-300">TikTok</span> y sube
              tus <span className="text-brand-300">diamantes</span>
            </h2>
            <p className="mt-5 animate-fade-up text-white/60">
              Live Brand es la agencia oficial de TikTok LIVE en LATAM. Tomamos a creadores que ya
              hacen lives y los formamos con clases y asesorías directas de profesionales de la
              plataforma y de crecimiento digital: mejoras tu live, ganas más diamantes y construyes
              un negocio real en la app.
            </p>

            <ul className="mt-8 space-y-4">
              {perks.map((item) => (
                <li
                  key={item}
                  className="flex animate-fade-up items-start gap-3 text-sm text-white/70"
                >
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-brand-500/20 text-brand-300">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                Único requisito
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Haber sido aprobado previamente como potencial emergente por TikTok LIVE LATAM. Si
                TikTok ya te marcó como talento de lives, tu entrada es gratuita.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-brand-400/25 bg-brand-500/10 p-5">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-200">
                Qué pasa después de enviar tu inscripción
              </p>
              <ol className="mt-4 space-y-3">
                {nextSteps.map((item, index) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-white/70">
                    <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-gradient-to-br from-brand-500 to-glow font-display text-[11px] font-bold text-white shadow-glow-sm">
                      {index + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-800/60 p-5 backdrop-blur-xl">
              <div className="flex flex-none -space-x-3" aria-hidden="true">
                {proofAvatars.map((name) => (
                  <span
                    key={name}
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 border-ink-800 bg-gradient-to-br ${avatarColor(
                      name,
                    )} font-display text-[10px] font-bold text-white`}
                  >
                    {initials(name)}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-white">
                  +320 creadores ya confían en Live Brand
                </p>
                <p className="mt-0.5 text-xs text-white/60">
                  Respuesta en menos de 48 h (máximo 3 días) · +3.400 h de live gestionadas al mes
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-ink-800/60 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-lg border border-brand-400/30 bg-ink-900/70">
                  <LogoMark tone="dark" className="h-5 w-5" />
                </span>
                <p className="text-sm text-white/70">
                  <span className="font-semibold text-brand-200">¿Ya eres parte?</span> Entra al{' '}
                  <a href="#/panel" className="font-semibold text-glow underline underline-offset-4">
                    panel interno
                  </a>{' '}
                  para gestionar postulantes.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative order-1 animate-fade-up rounded-3xl bg-gradient-to-br from-brand-400/70 via-white/10 to-glow/60 p-px shadow-card lg:order-2"
            noValidate
          >
            <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-ink-900/85 p-7 backdrop-blur-xl sm:p-9">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.28),transparent_70%)]" />

              <div className="relative mb-7">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-9 w-9 flex-none place-items-center rounded-full font-display text-sm font-bold transition ${
                        step >= 1
                          ? 'bg-gradient-to-br from-brand-500 to-glow text-white shadow-glow-sm'
                          : 'border border-white/15 bg-white/5 text-white/50'
                      }`}
                    >
                      1
                    </span>
                    <span
                      className={`font-display text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        step === 1 ? 'text-brand-200' : 'text-white/50'
                      }`}
                    >
                      Tu perfil
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className={`h-px flex-1 bg-gradient-to-r transition ${
                      step === 2 ? 'from-glow to-brand-400' : 'from-white/15 to-white/5'
                    }`}
                  />

                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-9 w-9 flex-none place-items-center rounded-full font-display text-sm font-bold transition ${
                        step >= 2
                          ? 'bg-gradient-to-br from-brand-500 to-glow text-white shadow-glow-sm'
                          : 'border border-white/15 bg-white/5 text-white/50'
                      }`}
                    >
                      2
                    </span>
                    <span
                      className={`font-display text-[11px] font-semibold uppercase tracking-[0.18em] ${
                        step === 2 ? 'text-brand-200' : 'text-white/50'
                      }`}
                    >
                      Contacto
                    </span>
                  </div>
                </div>

                <div
                  className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label="Progreso de la postulación"
                  aria-valuemin={1}
                  aria-valuemax={2}
                  aria-valuenow={step}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-glow transition-[width] duration-500"
                    style={{ width: step === 1 ? '50%' : '100%' }}
                  />
                </div>

                <h3
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="mt-5 font-display text-lg font-semibold text-white focus:outline-none"
                >
                  {step === 1 ? 'Paso 1: Tu perfil' : 'Paso 2: Contacto'}
                </h3>
                <p className="mt-1 text-xs text-white/60">
                  {step === 1
                    ? '2 minutos, sin CV y sin costo. Solo tu @, tu categoría y tu confirmación de TikTok.'
                    : '¿Cómo te contactamos para tu clase de diagnóstico gratuita?'}
                </p>
              </div>

              <input
                type="text"
                name="_gotcha"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                value=""
                onChange={() => undefined}
              />

              {showSummary && (
                <div
                  role="alert"
                  className="relative mb-5 rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200"
                >
                  <span className="font-semibold">
                    Revisa {errorCount === 1 ? 'el campo marcado' : `los ${errorCount} campos marcados`}
                  </span>{' '}
                  para {step === 1 ? 'continuar al paso 2' : 'enviar tu inscripción'}.
                </div>
              )}

              {step === 1 ? (
                <div key={1} className="grid animate-fade-up gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label after:ml-0.5 after:text-glow after:content-['*']" htmlFor="handle">
                      @ de TikTok
                    </label>
                    <input
                      id="handle"
                      {...fieldAria('handle')}
                      className="input"
                      placeholder="@tucuenta"
                      autoComplete="off"
                      spellCheck={false}
                      value={form.handle}
                      onChange={update('handle')}
                      onBlur={touch('handle')}
                    />
                    {errorFor('handle')}
                  </div>

                  <div className="sm:col-span-2">
                    <span id="category-label" className="label after:ml-0.5 after:text-glow after:content-['*']">
                      Categoría principal
                    </span>
                    <div
                      role="radiogroup"
                      aria-labelledby="category-label"
                      {...fieldAria('category')}
                      className="mt-1 flex flex-wrap gap-2"
                    >
                      {categories.map((cat) => {
                        const active = form.category === cat
                        return (
                          <label
                            key={cat}
                            className={`cursor-pointer rounded-full border px-3.5 py-2 font-display text-xs font-medium transition ${
                              active
                                ? 'border-brand-300 bg-brand-500/25 text-white shadow-glow-sm'
                                : 'border-white/10 bg-white/5 text-white/60 hover:border-brand-400/50 hover:text-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name="category"
                              value={cat}
                              checked={active}
                              onChange={update('category')}
                              className="sr-only"
                            />
                            {cat}
                          </label>
                        )
                      })}
                    </div>
                    {errorFor('category')}
                  </div>

                  <div>
                    <label className="label" htmlFor="followers">
                      Seguidores
                      <span className="ml-1.5 font-normal normal-case tracking-normal text-white/45">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="followers"
                      {...fieldAria('followers')}
                      type="number"
                      inputMode="numeric"
                      min="0"
                      className="input"
                      placeholder="Ej: 45000"
                      value={form.followers}
                      onChange={update('followers')}
                      onBlur={touch('followers')}
                    />
                    <QuickPicks field="followers" value={form.followers} onPick={pick('followers')} />
                    {errorFor('followers')}
                  </div>

                  <div>
                    <label className="label" htmlFor="avgViewers">
                      Viewers promedio en live
                      <span className="ml-1.5 font-normal normal-case tracking-normal text-white/45">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="avgViewers"
                      {...fieldAria('avgViewers')}
                      type="number"
                      inputMode="numeric"
                      min="0"
                      className="input"
                      placeholder="Ej: 850"
                      value={form.avgViewers}
                      onChange={update('avgViewers')}
                      onBlur={touch('avgViewers')}
                    />
                    <QuickPicks field="avgViewers" value={form.avgViewers} onPick={pick('avgViewers')} />
                    {errorFor('avgViewers')}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="hoursPerWeek">
                      Horas en vivo por semana
                      <span className="ml-1.5 font-normal normal-case tracking-normal text-white/45">
                        (opcional)
                      </span>
                    </label>
                    <input
                      id="hoursPerWeek"
                      {...fieldAria('hoursPerWeek')}
                      type="number"
                      inputMode="numeric"
                      min="0"
                      className="input"
                      placeholder="Ej: 15"
                      value={form.hoursPerWeek}
                      onChange={update('hoursPerWeek')}
                      onBlur={touch('hoursPerWeek')}
                    />
                    <QuickPicks
                      field="hoursPerWeek"
                      value={form.hoursPerWeek}
                      onPick={pick('hoursPerWeek')}
                    />
                    {errorFor('hoursPerWeek')}
                  </div>

                  <p className="text-xs text-white/60 sm:col-span-2">
                    Opcional: compartir tus métricas nos ayuda a preparar tu diagnóstico.
                  </p>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="tiktok-approval"
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-400/30 bg-brand-500/10 p-4 transition hover:border-brand-400/60"
                    >
                      <input
                        id="tiktok-approval"
                        type="checkbox"
                        checked={approved}
                        onChange={toggleApproved}
                        {...fieldAria('approved')}
                        className="mt-0.5 h-4 w-4 flex-none accent-brand-500"
                      />
                      <span className="text-sm leading-relaxed text-white/80">
                        Confirmo que fui aprobado previamente como potencial emergente por TikTok
                        LATAM
                      </span>
                    </label>
                    {errorFor('approved')}
                  </div>
                </div>
              ) : (
                <div key={2} className="grid animate-fade-up gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="label after:ml-0.5 after:text-glow after:content-['*']" htmlFor="name">
                      Nombre completo
                    </label>
                    <input
                      id="name"
                      autoComplete="name"
                      {...fieldAria('name')}
                      className="input"
                      placeholder="Tu nombre y apellido"
                      value={form.name}
                      onChange={update('name')}
                      onBlur={touch('name')}
                    />
                    {errorFor('name')}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="label after:ml-0.5 after:text-glow after:content-['*']" htmlFor="email">
                      Email de contacto
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...fieldAria('email')}
                      className="input"
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={update('email')}
                      onBlur={touch('email')}
                    />
                    {errorFor('email')}
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={() => setShowOptional((open) => !open)}
                      aria-expanded={showOptional}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-left font-display text-xs font-semibold uppercase tracking-[0.16em] text-white/60 transition hover:border-brand-400/50 hover:text-brand-200"
                    >
                      Opcional · mejora tu postulación
                      <svg
                        viewBox="0 0 24 24"
                        className={`h-4 w-4 transition-transform duration-300 ${
                          showOptional ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {showOptional && (
                      <div className="mt-5 grid animate-fade-up gap-5 sm:grid-cols-2">
                        <div>
                          <label className="label" htmlFor="phone">
                            Teléfono / WhatsApp
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            autoComplete="tel"
                            className="input"
                            placeholder="+56 9 0000 0000"
                            value={form.phone}
                            onChange={update('phone')}
                          />
                        </div>

                        <div>
                          <label className="label" htmlFor="availability">
                            Horarios disponibles
                          </label>
                          <input
                            id="availability"
                            className="input"
                            placeholder="Ej: Lunes a viernes, 18:00 – 23:00"
                            value={form.availability}
                            onChange={update('availability')}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="label" htmlFor="source">
                            ¿Cómo te enteraste de Live Brand?
                          </label>
                          <select
                            id="source"
                            className="input"
                            value={form.source}
                            onChange={update('source')}
                          >
                            <option value="">Selecciona una opción</option>
                            {sources.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="label" htmlFor="note">
                            Cuéntanos de tu proyecto
                          </label>
                          <textarea
                            id="note"
                            rows={4}
                            className="input resize-none"
                            placeholder="¿Qué lograste en tus últimas transmisiones? ¿Qué buscas en una agencia?"
                            value={form.note}
                            onChange={update('note')}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="mt-6 text-xs font-medium text-brand-200">
                Inscripción gratuita y sin compromiso · Cupos limitados por categoría · Te contactamos
                en menos de 48 h (máximo 3 días).
              </p>

              {sendError && (
                <div
                  role="alert"
                  className="mt-4 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 text-sm text-rose-200"
                >
                  <span className="font-semibold">No pudimos enviar tu inscripción.</span>{' '}
                  {sendError} Tus datos siguen aquí: vuelve a intentarlo en un momento.
                </div>
              )}

              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1 text-xs text-white/60">
                  <p>Solo usamos tus datos para contactarte sobre la convocatoria.</p>
                  <p>Los enviamos a nuestro equipo de admisión y se guardan en este dispositivo.</p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {step === 2 && (
                    <button
                      type="button"
                      onClick={goToStep1}
                      disabled={status === 'sending'}
                      className="btn-ghost w-full sm:w-auto"
                    >
                      Atrás
                    </button>
                  )}
                  {step === 1 ? (
                    <button
                      type="button"
                      onClick={goToStep2}
                      className="btn-primary w-full sm:w-auto"
                    >
                      Continuar
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      aria-busy={status === 'sending'}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {status === 'sending' ? (
                        <>
                          <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                          </svg>
                          Enviando…
                        </>
                      ) : (
                        <>
                          {status === 'failed' ? 'Reintentar inscripción' : 'Enviar mi inscripción gratis'}
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
