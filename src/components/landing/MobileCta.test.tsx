import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import MobileCta from './MobileCta'

function setScrollY(value: number): void {
  Object.defineProperty(window, 'scrollY', { value, configurable: true, writable: true })
}

describe('MobileCta', () => {
  it('no se muestra al inicio de la página', () => {
    setScrollY(0)
    render(<MobileCta onApply={vi.fn()} />)

    expect(screen.queryByRole('button', { name: /postularme gratis/i })).not.toBeInTheDocument()
  })

  it('aparece al hacer scroll y envía al formulario al pulsarlo', async () => {
    const user = userEvent.setup()
    const onApply = vi.fn()
    setScrollY(0)
    render(<MobileCta onApply={onApply} />)

    setScrollY(600)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    const cta = await screen.findByRole('button', { name: /postularme gratis/i })
    expect(screen.getByText('Postulación gratis')).toBeInTheDocument()

    await user.click(cta)

    expect(onApply).toHaveBeenCalledTimes(1)
  })

  it('se oculta de nuevo al volver al top', async () => {
    setScrollY(600)
    render(<MobileCta onApply={vi.fn()} />)

    await screen.findByRole('button', { name: /postularme gratis/i })

    setScrollY(0)
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })

    await waitFor(() =>
      expect(screen.queryByRole('button', { name: /postularme gratis/i })).not.toBeInTheDocument(),
    )
  })

  it('deja libre el formulario y el pie cuando están en pantalla', () => {
    const { container } = render(
      <>
        <section id="postular">
          <MobileCta onApply={vi.fn()} />
        </section>
        <footer />
      </>,
    )
    const section = container.querySelector('#postular')
    const footer = container.querySelector('footer')
    let formTop = 200
    let footerTop = -900
    vi.spyOn(section as HTMLElement, 'getBoundingClientRect').mockImplementation(
      () => ({ top: formTop, bottom: formTop + 900 }) as DOMRect,
    )
    vi.spyOn(footer as HTMLElement, 'getBoundingClientRect').mockImplementation(
      () => ({ top: footerTop, bottom: footerTop + 900 }) as DOMRect,
    )

    setScrollY(600)
    act(() => window.dispatchEvent(new Event('scroll')))
    expect(screen.queryByRole('button', { name: /postularme gratis/i })).not.toBeInTheDocument()

    formTop = -900
    footerTop = 200
    act(() => window.dispatchEvent(new Event('scroll')))
    expect(screen.queryByRole('button', { name: /postularme gratis/i })).not.toBeInTheDocument()

    footerTop = -900
    act(() => window.dispatchEvent(new Event('scroll')))
    expect(screen.getByRole('button', { name: /postularme gratis/i })).toBeInTheDocument()
  })
})
