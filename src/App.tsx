import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './components/Dashboard'
import { ReportHub } from './components/ReportHub'
import { ReportView } from './components/ReportView'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/reports" element={<ReportHub />} />
        <Route path="/reports/:reportId" element={<ReportView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
