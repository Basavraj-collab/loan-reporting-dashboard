import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { PortalTabBar, type PortalOption } from './components/PortalTabBar'
import { Option2Layout } from './components/Option2Layout'
import { Option3Layout } from './components/Option3Layout'
import { BusinessDashboard } from './components/BusinessDashboard'
import { SegmentView } from './components/SegmentView'
import { PinnedReports } from './components/PinnedReports'

const appRoutes = (
  <Routes>
    <Route path="/" element={<Navigate to="/segment/business-dashboard/business-health" replace />} />
    <Route path="/pinned" element={<PinnedReports />} />
    <Route path="/segment/:segmentId/:subSegmentId" element={<BusinessDashboard />} />
    <Route path="/report/:reportId" element={<SegmentView />} />
    <Route path="*" element={<Navigate to="/segment/business-dashboard/business-health" replace />} />
  </Routes>
)

function App() {
  const [portalOption, setPortalOption] = useState<PortalOption>(1)

  return (
    <div className="portal-app">
      <PortalTabBar selected={portalOption} onSelect={setPortalOption} />
      {portalOption === 1 && <Layout>{appRoutes}</Layout>}
      {portalOption === 2 && <Option2Layout>{appRoutes}</Option2Layout>}
      {portalOption === 3 && <Option3Layout>{appRoutes}</Option3Layout>}
    </div>
  )
}

export default App
