import { createContext, useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { segments } from './data/navigation'
import { Layout } from './components/Layout'
import { PortalTabBar, type PortalOption } from './components/PortalTabBar'

export const PortalOptionContext = createContext<PortalOption>(1)
import { Option2Layout } from './components/Option2Layout'
import { Option3Layout } from './components/Option3Layout'
import { BusinessDashboard } from './components/BusinessDashboard'
import { SegmentView } from './components/SegmentView'
import { PinnedReports } from './components/PinnedReports'
import { ReportHub } from './components/ReportHub'

const defaultSegment = segments[0]
const defaultSubSegment = defaultSegment?.subSegments[0]
const OPTION3_DEFAULT_PATH =
  defaultSegment && defaultSubSegment
    ? `/segment/${defaultSegment.id}/${defaultSubSegment.id}`
    : '/segment/business-dashboard/business-health'

const PORTAL_STORAGE_KEY = 'loan-dashboard-portal-option'

function parsePortalOption(value: string | null): PortalOption | null {
  if (value === '1' || value === '2' || value === '3' || value === '4') return Number(value) as PortalOption
  return null
}

function readInitialPortalOption(): PortalOption {
  if (typeof window === 'undefined') return 1
  const fromUrl = parsePortalOption(new URLSearchParams(window.location.search).get('portal'))
  if (fromUrl != null) return fromUrl
  const fromStorage = parsePortalOption(localStorage.getItem(PORTAL_STORAGE_KEY))
  if (fromStorage != null) return fromStorage
  // Dev: default to Option 3 so Business Health funnel (Options 2 & 3) is visible without extra clicks
  if (import.meta.env.DEV) return 3
  return 1
}

/** Preserves ?portal=2 etc. when redirecting from / to Business Health */
function RootRedirectToBusinessHealth() {
  const location = useLocation()
  return (
    <Navigate to={{ pathname: '/segment/business-dashboard/business-health', search: location.search }} replace />
  )
}

const appRoutes = (
  <Routes>
    <Route path="/" element={<RootRedirectToBusinessHealth />} />
    <Route path="/hub" element={<ReportHub />} />
    <Route path="/pinned" element={<PinnedReports />} />
    <Route path="/segment/:segmentId/:subSegmentId" element={<BusinessDashboard />} />
    <Route path="/report/:reportId" element={<SegmentView />} />
    <Route path="*" element={<RootRedirectToBusinessHealth />} />
  </Routes>
)

function App() {
  const [portalOption, setPortalOption] = useState<PortalOption>(readInitialPortalOption)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    localStorage.setItem(PORTAL_STORAGE_KEY, String(portalOption))
  }, [portalOption])

  const handlePortalSelect = (option: PortalOption) => {
    setPortalOption(option)
    if (option === 2) navigate('/hub')
    if (option === 3) {
      const isSegmentRoute = /^\/segment\/[^/]+\/[^/]+$/.test(location.pathname)
      if (!isSegmentRoute) navigate(OPTION3_DEFAULT_PATH, { replace: true })
    }
  }

  return (
    <PortalOptionContext.Provider value={portalOption}>
      <div className="portal-app">
        <PortalTabBar selected={portalOption} onSelect={handlePortalSelect} />
        {portalOption === 1 && <Layout>{appRoutes}</Layout>}
        {portalOption === 2 && <Option2Layout>{appRoutes}</Option2Layout>}
        {portalOption === 3 && <Option3Layout>{appRoutes}</Option3Layout>}
        {portalOption === 4 && <div />}
      </div>
    </PortalOptionContext.Provider>
  )
}

export default App
