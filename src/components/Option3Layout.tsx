import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSegmentById, getSubSegmentById } from '../data/navigation'
import { saveRecentItem } from '../data/reportDiscovery'
import { DateRangeSelector } from './DateRangeSelector'
import { ReportSearch } from './ReportSearch'
import { SidebarNav } from './SidebarNav'
import styles from './Option3Layout.module.css'

interface Option3LayoutProps {
  children: React.ReactNode
}

export function Option3Layout({ children }: Option3LayoutProps) {
  const location = useLocation()
  const isSegmentRoute = /^\/segment\/[^/]+\/[^/]+$/.test(location.pathname)
  const m = location.pathname.match(/^\/segment\/([^/]+)\/([^/]+)/)
  const segmentId = m?.[1] ?? ''
  const subSegmentId = m?.[2] ?? ''

  useEffect(() => {
    if (!isSegmentRoute) return
    const segmentMeta = getSegmentById(segmentId)
    const subMeta = getSubSegmentById(segmentId, subSegmentId)
    const label =
      segmentMeta && subMeta ? `${segmentMeta.name} › ${subMeta.name}` : subSegmentId
    saveRecentItem({ segmentId, subSegmentId, label })
  }, [isSegmentRoute, segmentId, subSegmentId])

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.searchWrap}>
          <ReportSearch placeholder="Search reports and insights" />
        </div>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>◈</span>
            <span>Loan Reports</span>
          </div>
          <SidebarNav collapseBusinessDashboardToHealthOnly />
        </aside>
        <main className={styles.main}>
          <div className={styles.dateBar}>
            <DateRangeSelector />
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
