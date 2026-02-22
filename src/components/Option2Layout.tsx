import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getSegmentById, getSubSegmentById } from '../data/navigation'
import { loadRecent, saveRecentItem, type RecentItem } from '../data/reportDiscovery'
import { DateRangeSelector } from './DateRangeSelector'
import { ReportSearch } from './ReportSearch'
import { ReportsFlyout } from './ReportsFlyout'
import styles from './Option2Layout.module.css'

interface Option2LayoutProps {
  children: React.ReactNode
}

export function Option2Layout({ children }: Option2LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const [recent, setRecent] = useState<RecentItem[]>(() => loadRecent())

  const isSegmentRoute = useMemo(() => {
    const m = location.pathname.match(/^\/segment\/([^/]+)\/([^/]+)/)
    return m ? { segmentId: m[1], subSegmentId: m[2] } : null
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/hub', { replace: true })
    }
  }, [location.pathname, navigate])

  useEffect(() => {
    if (!isSegmentRoute) return
    const { segmentId, subSegmentId } = isSegmentRoute
    const segment = getSegmentById(segmentId)
    const sub = getSubSegmentById(segmentId, subSegmentId)
    const label = segment && sub ? `${segment.name} › ${sub.name}` : subSegmentId
    saveRecentItem({ segmentId, subSegmentId, label })
    setRecent(loadRecent())
  }, [isSegmentRoute?.segmentId, isSegmentRoute?.subSegmentId])

  const openBrowse = () => setFlyoutOpen(true)
  const isOnHub = location.pathname === '/hub'

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div
          className={styles.logo}
          onClick={() => navigate('/hub')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/hub')}
        >
          <span className={styles.logoIcon}>◈</span>
          <span>Loan Reports</span>
        </div>
        <div className={styles.searchWrap}>
          <ReportSearch onOpenBrowse={openBrowse} onSelect={() => setFlyoutOpen(false)} />
        </div>
        <div className={styles.actions}>
          {!isOnHub && (
            <button type="button" className={styles.homeBtn} onClick={() => navigate('/hub')}>
              Home
            </button>
          )}
          <button type="button" className={styles.browseBtn} onClick={openBrowse}>
            Browse all
          </button>
          <button type="button" className={styles.pinnedBtn} onClick={() => navigate('/pinned')}>
            Pinned
          </button>
        </div>
      </header>

      <ReportsFlyout
        open={flyoutOpen}
        onClose={() => setFlyoutOpen(false)}
        recent={recent}
        onNavigate={() => setFlyoutOpen(false)}
      />

      <main className={styles.main}>
        <div className={styles.dateBar}>
          <DateRangeSelector />
        </div>
        {children}
      </main>
    </div>
  )
}
