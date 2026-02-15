import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { BusinessDashboard } from './components/BusinessDashboard'
import { SegmentView } from './components/SegmentView'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/segment/business-dashboard/business-health" replace />} />
        <Route path="/segment/:segmentId/:subSegmentId" element={<BusinessDashboard />} />
        <Route path="/report/:reportId" element={<SegmentView />} />
        <Route path="*" element={<Navigate to="/segment/business-dashboard/business-health" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
