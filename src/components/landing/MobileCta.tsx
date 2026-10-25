import { useEffect, useState } from 'react'

interface MobileCtaProps {
  onApply: () => void
}

export default function MobileCta({ onApply }: MobileCtaProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = (): void => {
      const applySection = document.getElementById('postular')
      const footer = document.querySelector('footer')
      const isOnScreen = (element: Element | null): boolean => {
        if (!element) return false
        const { top, bottom } = element.getBoundingClientRect()
        return top < window.innerHeight && bottom > 0
      }

      setVisible(window.scrollY > 380 && !isOnScreen(applySection) && !isOnScreen(footer))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-white/10 bg-ink-950/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl animate-fade-up">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-display text-xs font-semibold text-white">
            Postulación gratis
          </p>
          <p className="truncate text-[11px] text-white/60">Respuesta en máximo 3 días</p>
        </div>
        <button type="button" onClick={onApply} className="btn-primary flex-none !px-5 !py-2.5">
          Postularme gratis
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}
