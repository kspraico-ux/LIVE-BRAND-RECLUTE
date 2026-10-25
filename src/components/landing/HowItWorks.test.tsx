import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HowItWorks from './HowItWorks'

describe('HowItWorks', () => {
  it('resume el proceso en tres pasos claros', () => {
    render(<HowItWorks />)

    expect(screen.getByRole('heading', { level: 2, name: /qué pasa después/i })).toBeInTheDocument()

    const list = screen.getByRole('list')
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(3)

    expect(screen.getByRole('heading', { level: 3, name: /envía tu perfil/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /revisamos tu perfil/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /empieza tu plan/i })).toBeInTheDocument()
  })

  it('muestra un plazo de respuesta consistente', () => {
    render(<HowItWorks />)

    expect(screen.getByText('Máximo 3 días')).toBeInTheDocument()
    expect(screen.getByText(/te contactamos por email/i)).toBeInTheDocument()
  })

  it('ofrece un CTA directo al formulario', () => {
    render(<HowItWorks />)

    expect(screen.getByRole('link', { name: /postular gratis/i })).toHaveAttribute(
      'href',
      '#postular',
    )
  })
})
