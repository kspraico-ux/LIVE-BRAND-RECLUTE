import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import type { Applicant, PanelTab } from './types'
import Navbar from './components/landing/Navbar'
import Hero from './components/landing/Hero'
import HowItWorks from './components/landing/HowItWorks'
import ApplyForm from './components/landing/ApplyForm'
import MobileCta from './components/landing/MobileCta'
import Footer from './components/landing/Footer'
import NotFound from './components/NotFound'
import { useApplicants } from './hooks/useApplicants'

const PanelLayout = lazy(() => import('./components/panel/PanelLayout'))
const KpiCards = lazy(() => import('./components/panel/KpiCards'))
const StatusOverview = lazy(() => import('./components/panel/StatusOverview'))
const ApplicantsTable = lazy(() => import('./components/panel/ApplicantsTable'))
const ApplicantDetail = lazy(() => import('./components/panel/ApplicantDetail'))
const DataActions = lazy(() => import('./components/panel/DataActions'))

function PanelFallback() {
  return (
    <div className="grid min-h-screen place-items-center" role="status" aria-label="Cargando panel">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-300" />
    </div>
  )
}

type Route = 'landing' | 'panel' | 'notfound'

function routeFromHash(): Route {
  const hash = window.location.hash
  if (hash.startsWith('#/panel')) return 'panel'
  if (hash.startsWith('#/') && hash !== '#/') return 'notfound'
  return 'landing'
}

export default function App() {
  const { applicants, stats, addApplicant, updateStatus, removeApplicant } = useApplicants()
  const [route, setRoute] = useState<Route>(routeFromHash)
  const [tab, setTab] = useState<PanelTab>('resumen')
  const [selected, setSelected] = useState<Applicant | null>(null)

  useEffect(() => {
    const onHashChange = () => {
      const next = routeFromHash()
      setRoute(next)
      if (next === 'panel') setSelected(null)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const openPanel = useCallback(() => {
    window.location.hash = '/panel'
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const exitPanel = useCallback(() => {
    window.location.hash = '/'
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const goToApply = useCallback(() => {
    document.getElementById('postular')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const goHome = useCallback(() => {
    window.location.hash = '/'
  }, [])

  if (route === 'notfound') {
    return <NotFound onHome={goHome} />
  }

  if (route === 'panel') {
    return (
      <Suspense fallback={<PanelFallback />}>
        <PanelLayout activeTab={tab} onTabChange={setTab} onExit={exitPanel}>
          <KpiCards stats={stats} applicants={applicants} />

          {tab === 'resumen' ? (
            <>
              <div className="mt-6 flex flex-wrap justify-end">
                <DataActions rows={applicants} />
              </div>
              <StatusOverview
                stats={stats}
                applicants={applicants}
                onSelect={setSelected}
                onShowAll={() => setTab('postulantes')}
              />
            </>
          ) : (
            <div className="mt-6">
              <ApplicantsTable
                applicants={applicants}
                onSelect={setSelected}
                onStatusChange={updateStatus}
              />
            </div>
          )}
        </PanelLayout>

        {selected && (
          <ApplicantDetail
            applicant={selected}
            onClose={() => setSelected(null)}
            onStatusChange={updateStatus}
            onDelete={removeApplicant}
          />
        )}
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar onOpenPanel={openPanel} />
      <main id="main-content" tabIndex={-1}>
        <Hero onApply={goToApply} />
        <ApplyForm onSubmit={addApplicant} takenHandles={applicants.map((a) => a.handle)} />
        <HowItWorks />
      </main>
      <Footer onOpenPanel={openPanel} />
      <MobileCta onApply={goToApply} />
    </div>
  )
}
