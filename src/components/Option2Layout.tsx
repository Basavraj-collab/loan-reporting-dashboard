import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { segments, getSegmentById, getSubSegmentById } from '../data/navigation'
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
  const [globalSwitcherOpen, setGlobalSwitcherOpen] = useState(false)
  const globalSwitcherRef = useRef<HTMLDivElement>(null)

  const isSegmentRoute = useMemo(() => {
    const m = location.pathname.match(/^\/segment\/([^/]+)\/([^/]+)/)
    return m ? { segmentId: m[1], subSegmentId: m[2] } : null
  }, [location.pathname])

  const currentSegment = isSegmentRoute ? getSegmentById(isSegmentRoute.segmentId) : null

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (globalSwitcherRef.current && !globalSwitcherRef.current.contains(e.target as Node)) {
        setGlobalSwitcherOpen(false)
      }
    }
    if (globalSwitcherOpen) {
      const id = setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
      return () => {
        clearTimeout(id)
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [globalSwitcherOpen])

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
            <Link to="/hub" className={styles.hubBtn}>
              HUB
            </Link>
          )}
          <button type="button" className={styles.pinnedBtn} onClick={() => navigate('/pinned')}>
            Pinned
          </button>
          <div className={styles.globalSwitcherWrap} ref={globalSwitcherRef}>
            <button
              type="button"
              className={styles.globalSwitcherBtn}
              onClick={() => setGlobalSwitcherOpen((o) => !o)}
              aria-expanded={globalSwitcherOpen}
              aria-label="Switch segment"
            >
              <span className={styles.globalSwitcherIcon} aria-hidden>⊞</span>
            </button>
            {globalSwitcherOpen && (
              <div className={styles.globalSwitcherDropdown}>
                {segments.map((seg) => {
                  const firstSubId = seg.subSegments[0]?.id
                  const href = firstSubId ? `/segment/${seg.id}/${firstSubId}` : '/hub'
                  return (
                    <Link
                      key={seg.id}
                      to={href}
                      className={styles.globalSwitcherItem}
                      onClick={() => setGlobalSwitcherOpen(false)}
                    >
                      {seg.name}
                      <span className={styles.globalSwitcherItemMeta}>View reports</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
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
        {currentSegment && isSegmentRoute && (
          <div className={styles.subSegmentTabs}>
            {currentSegment.subSegments.map((sub) => (
              <Link
                key={sub.id}
                to={`/segment/${isSegmentRoute.segmentId}/${sub.id}`}
                className={
                  sub.id === isSegmentRoute.subSegmentId
                    ? `${styles.subSegmentTab} ${styles.subSegmentTabActive}`
                    : styles.subSegmentTab
                }
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
