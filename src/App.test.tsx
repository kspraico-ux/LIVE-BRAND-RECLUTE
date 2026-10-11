import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

beforeEach(() => {
  window.localStorage.clear()
  window.location.hash = ''
})

describe('App', () => {
  it('renderiza la landing cuando el hash está vacío', () => {
    expect(window.location.hash).toBe('')

    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /talento de lives/ }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /panel interno/i })).toBeInTheDocument()
  })

  it('renderiza el panel con hash #/panel', async () => {
    window.location.hash = '#/panel'

    render(<App />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Resumen de la convocatoria' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /talento de lives/ })).not.toBeInTheDocument()
  })

  it('renderiza el 404 con un hash desconocido', () => {
    window.location.hash = '#/noexiste'

    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Página no encontrada' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /talento de lives/ })).not.toBeInTheDocument()
  })

  it('incluye el plan de reclutamiento y el formulario en la landing', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 2, name: /cómo funciona/i })).toBeInTheDocument()
    expect(screen.getByLabelText('@ de TikTok')).toBeInTheDocument()
    expect(
      screen.getAllByText(/te contactamos en menos de 48 h \(máximo 3 días\)/i).length,
    ).toBeGreaterThan(0)
    expect(screen.getByText('92% de aprobación en postulaciones')).toBeInTheDocument()
  })

  it('no muestra las secciones retiradas del landing', () => {
    render(<App />)

    expect(
      screen.queryByRole('heading', { level: 2, name: /requisitos mínimos/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 2, name: /preguntas frecuentes/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { level: 2, name: /top de colombia/i }),
    ).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 2, name: /pocos cupos/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /qué categorías aceptan/i })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /beneficios/i }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /requisitos/i }),
    ).not.toBeInTheDocument()
  })

  it('no muestra secciones con datos de ejemplo eliminadas', () => {
    render(<App />)

    expect(screen.queryByRole('heading', { name: /ya crecieron/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /los números de nuestra comunidad/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /streamers/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /métricas/i })).not.toBeInTheDocument()
  })

  it('cambia de ruta al disparar hashchange', async () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: /talento de lives/ }),
    ).toBeInTheDocument()

    await act(async () => {
      window.location.hash = '#/panel'
      window.dispatchEvent(new Event('hashchange'))
    })

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Resumen de la convocatoria' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /talento de lives/ })).not.toBeInTheDocument()
  })
})
