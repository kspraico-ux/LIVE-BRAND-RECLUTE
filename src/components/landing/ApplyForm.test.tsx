import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Applicant, NewApplicantData } from '../../types'
import ApplyForm from './ApplyForm'

const submitMock = vi.hoisted(() => vi.fn())

vi.mock('../../services/formspree', () => ({
  FORMSPREE_ENDPOINT: 'https://formspree.io/f/mppwnnng',
  submitToFormspree: submitMock,
}))

function buildOnSubmit() {
  return vi.fn((data: NewApplicantData): Applicant => ({
    id: 'ap_created_test',
    status: 'pendiente',
    createdAt: '2026-01-01T00:00:00.000Z',
    ...data,
  }))
}

type User = ReturnType<typeof userEvent.setup>

async function fillStep1(user: User, handle = 'anatest') {
  await user.type(screen.getByLabelText('@ de TikTok'), handle)
  await user.click(screen.getByRole('radio', { name: 'Gaming' }))
  await user.click(screen.getByRole('button', { name: /añadir métricas/i }))
  await user.type(screen.getByLabelText(/seguidores/i), '1200')
  await user.type(screen.getByLabelText(/viewers promedio en live/i), '300')
  await user.click(screen.getByRole('checkbox', { name: /confirmo que fui aprobado/i }))
}

async function goToStep2(user: User) {
  await user.click(screen.getByRole('button', { name: 'Continuar' }))
}

async function fillStep2(user: User) {
  await user.type(screen.getByLabelText('Nombre completo'), 'Ana Test')
  await user.type(screen.getByLabelText('Email de contacto'), 'ana@example.com')
}

async function fillValidForm(user: User) {
  await fillStep1(user)
  await goToStep2(user)
  await fillStep2(user)
}

describe('ApplyForm', () => {
  beforeEach(() => {
    submitMock.mockReset()
  })

  it('valida el paso 1 antes de avanzar al paso 2', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    render(<ApplyForm onSubmit={onSubmit} />)

    expect(screen.getByRole('heading', { name: 'Paso 1: Tu perfil' })).toBeInTheDocument()
    expect(screen.queryByLabelText('Nombre completo')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByText('Ejemplo: @tucuenta')).toBeInTheDocument()
    expect(screen.getByText('Selecciona una categoría')).toBeInTheDocument()
    expect(screen.getByText(/confirma tu aprobación por tiktok latam/i)).toBeInTheDocument()
    expect(screen.getByLabelText('@ de TikTok')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('@ de TikTok')).toHaveAttribute('aria-describedby', 'handle-error')
    expect(screen.queryByRole('heading', { name: 'Paso 2: Contacto' })).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('valida el paso 2 antes de enviar el formulario', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    render(<ApplyForm onSubmit={onSubmit} />)

    await fillStep1(user)
    await goToStep2(user)

    expect(screen.getByRole('heading', { name: 'Paso 2: Contacto' })).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Progreso de la postulación' })).toHaveAttribute(
      'aria-valuenow',
      '2',
    )

    await user.click(screen.getByRole('button', { name: /enviar mi inscripción gratis/i }))

    expect(screen.getByText('Ingresa tu nombre completo')).toBeInTheDocument()
    expect(screen.getByText('Email inválido')).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toHaveAttribute('aria-invalid', 'true')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(submitMock).not.toHaveBeenCalled()
  })

  it('permite volver al paso 1 con el botón Atrás sin perder los datos', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    render(<ApplyForm onSubmit={onSubmit} />)

    await fillStep1(user)
    await goToStep2(user)
    await user.click(screen.getByRole('button', { name: 'Atrás' }))

    expect(screen.getByRole('heading', { name: 'Paso 1: Tu perfil' })).toBeInTheDocument()
    expect(screen.getByLabelText('@ de TikTok')).toHaveValue('anatest')
    expect(screen.getByLabelText(/seguidores/i)).toHaveValue(1200)
    expect(screen.queryByLabelText('Nombre completo')).not.toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: 'Progreso de la postulación' })).toHaveAttribute(
      'aria-valuenow',
      '1',
    )
  })

  it('marca el @ duplicado como "Ese @ ya está en revisión"', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    render(<ApplyForm onSubmit={onSubmit} takenHandles={['@anatest', '@otracuenta']} />)

    await fillStep1(user, '@Anatest')
    await goToStep2(user)

    expect(screen.getByText('Ese @ ya está en revisión')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Paso 2: Contacto' })).not.toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.clear(screen.getByLabelText('@ de TikTok'))
    await user.type(screen.getByLabelText('@ de TikTok'), 'nuevacuenta')
    await goToStep2(user)

    expect(screen.getByRole('heading', { name: 'Paso 2: Contacto' })).toBeInTheDocument()
  })

  it('normaliza el handle sin "@" inicial', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    submitMock.mockResolvedValue({ ok: true, status: 200 })
    render(<ApplyForm onSubmit={onSubmit} />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /enviar mi inscripción gratis/i }))

    expect(await screen.findByRole('heading', { name: '¡Inscripción enviada!' })).toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    const data = onSubmit.mock.calls[0][0]
    expect(data.handle.startsWith('@')).toBe(true)
    expect(data.handle).toBe('@anatest')
  })

  it('envía números y muestra el mensaje de éxito con el nombre', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    submitMock.mockResolvedValue({ ok: true, status: 200 })
    render(<ApplyForm onSubmit={onSubmit} />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /enviar mi inscripción gratis/i }))

    expect(await screen.findByRole('status')).toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    const data = onSubmit.mock.calls[0][0]
    expect(typeof data.followers).toBe('number')
    expect(typeof data.avgViewers).toBe('number')
    expect(data.followers).toBe(1200)
    expect(data.avgViewers).toBe(300)
    expect(data.name).toBe('Ana Test')

    expect(screen.getByRole('heading', { name: '¡Inscripción enviada!' })).toBeInTheDocument()
    expect(screen.getByText('Ana Test')).toBeInTheDocument()
    expect(screen.queryByLabelText('Nombre completo')).not.toBeInTheDocument()
  })

  it('envía los datos a Formspree antes de registrar la inscripción local', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    submitMock.mockResolvedValue({ ok: true, status: 200 })
    render(<ApplyForm onSubmit={onSubmit} />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /enviar mi inscripción gratis/i }))

    expect(await screen.findByRole('heading', { name: '¡Inscripción enviada!' })).toBeInTheDocument()
    expect(submitMock).toHaveBeenCalledTimes(1)

    const payload = submitMock.mock.calls[0][0] as Record<string, string>
    expect(submitMock.mock.calls[0][0]).toBeTruthy()
    expect(payload.tiktok).toBe('@anatest')
    expect(payload.nombre).toBe('Ana Test')
    expect(payload.email).toBe('ana@example.com')
    expect(payload.seguidores).toBe('1200')
    expect(payload.categoria).toBe('Gaming')
    expect(payload.fuente).toBe('Landing · Inscripción gratuita')
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('muestra un error reintentable si Formspree no responde', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    submitMock.mockResolvedValue({
      ok: false,
      status: 500,
      error: 'Error interno del servidor.',
    })
    render(<ApplyForm onSubmit={onSubmit} />)

    await fillValidForm(user)
    await user.click(screen.getByRole('button', { name: /enviar mi inscripción gratis/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/no pudimos enviar tu inscripción/i)
    expect(onSubmit).not.toHaveBeenCalled()
    expect(
      screen.getByRole('button', { name: /reintentar inscripción/i }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Ana Test')

    submitMock.mockResolvedValue({ ok: true, status: 200 })
    await user.click(screen.getByRole('button', { name: /reintentar inscripción/i }))

    expect(await screen.findByRole('heading', { name: '¡Inscripción enviada!' })).toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    expect(submitMock).toHaveBeenCalledTimes(2)
  })

  it('muestra el microcopy de conversión y privacidad', () => {
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    expect(
      screen.getByText('Usamos tus datos solo para contactarte sobre esta convocatoria.'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/gratis y sin compromiso/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('progressbar', { name: 'Progreso de la postulación' }),
    ).toBeInTheDocument()
  })

  it('mantiene el formulario enfocado en la información necesaria', () => {
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    expect(screen.getByRole('heading', { name: 'Cuéntanos de tus lives' })).toBeInTheDocument()
    expect(screen.queryByText(/clases en vivo con profesionales de TikTok/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/plan de diamantes/i)).not.toBeInTheDocument()
  })

  it('ofrece las categorías como chips seleccionables', async () => {
    const user = userEvent.setup()
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    const group = screen.getByRole('radiogroup', { name: 'Categoría principal' })
    expect(within(group).getAllByRole('radio')).toHaveLength(7)

    await user.click(within(group).getByRole('radio', { name: 'Gaming' }))

    expect(within(group).getByRole('radio', { name: 'Gaming' })).toBeChecked()
    expect(within(group).getByRole('radio', { name: 'Lifestyle' })).not.toBeChecked()
  })

  it('rellena las métricas con los atajos rápidos', async () => {
    const user = userEvent.setup()
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    expect(screen.queryByLabelText(/seguidores/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /añadir métricas/i }))
    await user.click(screen.getByRole('button', { name: '10k – 100k' }))
    expect(screen.getByLabelText(/seguidores/i)).toHaveValue(50000)

    await user.click(screen.getByRole('button', { name: '100 – 500' }))
    expect(screen.getByLabelText(/viewers promedio en live/i)).toHaveValue(300)

    await user.click(screen.getByRole('button', { name: '10 h' }))
    expect(screen.getByLabelText(/horas en vivo por semana/i)).toHaveValue(10)
  })

  it('valida al salir del campo sin esperar a Continuar', async () => {
    const user = userEvent.setup()
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    const handle = screen.getByLabelText('@ de TikTok')
    await user.type(handle, 'x')
    await user.tab()

    expect(screen.getByText('Ejemplo: @tucuenta')).toBeInTheDocument()
    expect(handle).toHaveAttribute('aria-invalid', 'true')

    await user.clear(handle)
    await user.type(handle, 'cuentanueva')

    expect(screen.queryByText('Ejemplo: @tucuenta')).not.toBeInTheDocument()
    expect(handle).not.toHaveAttribute('aria-invalid')
  })

  it('muestra un resumen de errores al intentar avanzar', async () => {
    const user = userEvent.setup()
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByText(/revisa los 3 campos marcados/i)).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Paso 2: Contacto' })).not.toBeInTheDocument()
  })

  it('oculta los campos opcionales del paso 2 hasta desplegarlos', async () => {
    const user = userEvent.setup()
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    await fillStep1(user)
    await goToStep2(user)

    const toggle = screen.getByRole('button', { name: /añadir datos opcionales/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByLabelText('Teléfono / WhatsApp')).not.toBeInTheDocument()

    await user.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByLabelText('Teléfono / WhatsApp')).toBeInTheDocument()
    expect(screen.getByLabelText('¿Cómo te enteraste de Live Brand?')).toBeInTheDocument()

    await user.click(toggle)

    expect(screen.queryByLabelText('Teléfono / WhatsApp')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Nombre completo')).toBeInTheDocument()
  })

  it('explica la condición de admisión junto al checkbox de confirmación', () => {
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    expect(
      screen.getByText(/confirmo que fui aprobado previamente como potencial emergente por tiktok latam/i),
    ).toBeInTheDocument()
    expect(screen.queryByText(/1\.000 seguidores/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/5 horas semanales en vivo/i)).not.toBeInTheDocument()
  })

  it('exige el checkbox de aprobación de TikTok LATAM en el paso 1', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    render(<ApplyForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('@ de TikTok'), 'cuentanueva')
    await user.click(screen.getByRole('radio', { name: 'Gaming' }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(
      screen.getByText(/confirma tu aprobación por tiktok latam/i),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Paso 2: Contacto' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('checkbox', { name: /confirmo que fui aprobado/i }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByRole('heading', { name: 'Paso 2: Contacto' })).toBeInTheDocument()
  })

  it('permite enviar sin métricas porque son opcionales', async () => {
    const user = userEvent.setup()
    const onSubmit = buildOnSubmit()
    submitMock.mockResolvedValue({ ok: true, status: 200 })
    render(<ApplyForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('@ de TikTok'), 'sinmetricas')
    await user.click(screen.getByRole('radio', { name: 'Gaming' }))
    await user.click(screen.getByRole('checkbox', { name: /confirmo que fui aprobado/i }))
    await user.click(screen.getByRole('button', { name: 'Continuar' }))

    expect(screen.getByRole('heading', { name: 'Paso 2: Contacto' })).toBeInTheDocument()

    await fillStep2(user)
    await user.click(screen.getByRole('button', { name: /enviar mi inscripción gratis/i }))

    expect(await screen.findByRole('heading', { name: '¡Inscripción enviada!' })).toBeInTheDocument()
    expect(onSubmit).toHaveBeenCalledTimes(1)
    const data = onSubmit.mock.calls[0][0]
    expect(data.followers).toBe(0)
    expect(data.avgViewers).toBe(0)
    expect(data.hoursPerWeek).toBe(0)
  })

  it('conserva los datos opcionales al colapsar y volver a desplegar', async () => {
    const user = userEvent.setup()
    render(<ApplyForm onSubmit={buildOnSubmit()} />)

    await fillStep1(user)
    await goToStep2(user)

    const toggle = screen.getByRole('button', { name: /añadir datos opcionales/i })
    await user.click(toggle)
    await user.type(screen.getByLabelText('Teléfono / WhatsApp'), '+56912345678')
    await user.click(toggle)
    await user.click(toggle)

    expect(screen.getByLabelText('Teléfono / WhatsApp')).toHaveValue('+56912345678')
  })
})
