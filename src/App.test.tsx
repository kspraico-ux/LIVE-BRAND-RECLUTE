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
      screen.getByRole('heading', { level: 1, name: /tus lives pueden llegar mucho más lejos/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /panel interno/i })).toBeInTheDocument()
  })

  it('mantiene el header acotado al ancho móvil sin CTA que expanda el lienzo', () => {
    render(<App />)

    const header = screen.getByRole('banner')
    expect(header).toHaveClass('inset-x-0', 'max-w-[1440px]', 'overflow-x-clip')
    expect(header).not.toHaveClass('-translate-x-1/2')
    expect(header.querySelector('a[href="#postular"]')).toHaveClass('!shadow-none')
  })

  it('renderiza el panel con hash #/panel', async () => {
    window.location.hash = '#/panel'

    render(<App />)

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Resumen de la convocatoria' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /tus lives pueden llegar mucho más lejos/i })).not.toBeInTheDocument()
  })

  it('renderiza el 404 con un hash desconocido', () => {
    window.location.hash = '#/noexiste'

    render(<App />)

    expect(screen.getByRole('heading', { level: 1, name: 'Página no encontrada' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /tus lives pueden llegar mucho más lejos/i })).not.toBeInTheDocument()
  })

  it('incluye el plan de reclutamiento y el formulario en la landing', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 2, name: /qué pasa después/i })).toBeInTheDocument()
    expect(screen.getByLabelText('@ de TikTok')).toBeInTheDocument()
    expect(screen.getAllByText(/respuesta en un máximo de 3 días/i).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /empezar mi postulación/i })).toBeInTheDocument()
    expect(screen.getByText(/TikTok LATAM te aprobó como talento emergente/i)).toBeInTheDocument()
  })

  it('muestra la galería continua de referentes con créditos y aviso de no afiliación', () => {
    render(<App />)

    const gallery = screen.getByRole('region', { name: /creadores populares de tiktok/i })
    const images = Array.from(gallery.querySelectorAll('img'))
    expect(images).toHaveLength(10)
    expect(images[0]).toHaveAttribute(
      'src',
      `${import.meta.env.BASE_URL}creators/charli-damelio.jpg`,
    )
    expect(screen.getByText(/no implican colaboración ni respaldo/i)).toBeInTheDocument()

    const credits = screen.getByText('Créditos de imágenes')
    expect(credits.closest('details')).toBeInTheDocument()
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
      screen.getByRole('heading', { level: 1, name: /tus lives pueden llegar mucho más lejos/i }),
    ).toBeInTheDocument()

    await act(async () => {
      window.location.hash = '#/panel'
      window.dispatchEvent(new Event('hashchange'))
    })

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Resumen de la convocatoria' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /tus lives pueden llegar mucho más lejos/i })).not.toBeInTheDocument()
  })
})
