import { createContext, useState } from 'react'
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

const appRoutes = (
  <Routes>
    <Route path="/" element={<Navigate to="/segment/business-dashboard/business-health" replace />} />
    <Route path="/hub" element={<ReportHub />} />
    <Route path="/pinned" element={<PinnedReports />} />
    <Route path="/segment/:segmentId/:subSegmentId" element={<BusinessDashboard />} />
    <Route path="/report/:reportId" element={<SegmentView />} />
    <Route path="*" element={<Navigate to="/segment/business-dashboard/business-health" replace />} />
  </Routes>
)

function App() {
  const [portalOption, setPortalOption] = useState<PortalOption>(1)
  const navigate = useNavigate()
  const location = useLocation()

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
      </div>
    </PortalOptionContext.Provider>
  )
}

export default App
