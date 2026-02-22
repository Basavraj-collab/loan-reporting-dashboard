import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { segments, getSegmentById, getSubSegmentById } from '../data/navigation'
import { loadRecent, saveRecentItem, type RecentItem } from '../data/reportDiscovery'
import { DateRangeSelector } from './DateRangeSelector'
import { ReportSearch } from './ReportSearch'
import { ReportsFlyout } from './ReportsFlyout'
import styles from './Option3Layout.module.css'

const defaultSegment = segments[0]
const defaultSubSegment = defaultSegment?.subSegments[0]
const OPTION3_DEFAULT_PATH =
  defaultSegment && defaultSubSegment
    ? `/segment/${defaultSegment.id}/${defaultSubSegment.id}`
    : '/segment/business-dashboard/business-health'

interface Option3LayoutProps {
  children: React.ReactNode
}

export function Option3Layout({ children }: Option3LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [flyoutOpen, setFlyoutOpen] = useState(false)
  const [recent, setRecent] = useState<RecentItem[]>(() => loadRecent())

  const isSegmentRoute = useMemo(
    () => /^\/segment\/[^/]+\/[^/]+$/.test(location.pathname),
    [location.pathname]
  )

  const { segmentId, subSegmentId } = useMemo(() => {
    const m = location.pathname.match(/^\/segment\/([^/]+)\/([^/]+)/)
    if (m) return { segmentId: m[1], subSegmentId: m[2] }
    return {
      segmentId: defaultSegment?.id ?? '',
      subSegmentId: defaultSubSegment?.id ?? '',
    }
  }, [location.pathname])

  const segment = useMemo(() => segments.find((s) => s.id === segmentId), [segmentId])
  const currentSubSegment = useMemo(
    () => segment?.subSegments.find((s) => s.id === subSegmentId),
    [segment, subSegmentId]
  )
  const subSegments = segment?.subSegments ?? []

  useEffect(() => {
    if (!isSegmentRoute) return
    const segmentMeta = getSegmentById(segmentId)
    const subMeta = getSubSegmentById(segmentId, subSegmentId)
    const label =
      segmentMeta && subMeta ? `${segmentMeta.name} › ${subMeta.name}` : subSegmentId
    saveRecentItem({ segmentId, subSegmentId, label })
    setRecent(loadRecent())
  }, [isSegmentRoute, segmentId, subSegmentId])

  const onSegmentChange = (segId: string) => {
    const seg = segments.find((s) => s.id === segId)
    const first = seg?.subSegments[0]
    if (first) navigate('/segment/' + segId + '/' + first.id)
  }

  const openBrowse = () => setFlyoutOpen(true)

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div
          className={styles.logo}
          onClick={() => navigate(OPTION3_DEFAULT_PATH)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate(OPTION3_DEFAULT_PATH)
            }
          }}
          aria-label="Go to default report"
        >
          <span className={styles.logoIcon}>◈</span>
          <span>Loan Reports</span>
        </div>
        <div className={styles.searchWrap}>
          <ReportSearch
            placeholder="Search reports and insights"
            onOpenBrowse={openBrowse}
            onSelect={() => setFlyoutOpen(false)}
          />
        </div>
        <button type="button" className={styles.browseBtn} onClick={openBrowse}>
          Browse all
        </button>
        <button type="button" className={styles.pinnedBtn} onClick={() => navigate('/pinned')}>
          Pinned
        </button>
        <span className={styles.sep}>|</span>
        <nav className={styles.breadcrumbNav} aria-label="Segment navigation">
          <span className={styles.breadcrumbLabel} id="option3-segment-label">
            Segment:
          </span>
          <select
            className={styles.breadcrumbSelect}
            value={segmentId}
            onChange={(e) => onSegmentChange(e.target.value)}
            aria-labelledby="option3-segment-label"
          >
            {segments.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {segment && (
            <>
              <span className={styles.breadcrumbSep}>›</span>
              <span className={styles.breadcrumbSub}>
                {currentSubSegment?.name ?? subSegmentId}
              </span>
            </>
          )}
        </nav>
      </header>

      <ReportsFlyout
        open={flyoutOpen}
        onClose={() => setFlyoutOpen(false)}
        recent={recent}
        onNavigate={() => setFlyoutOpen(false)}
        deferClickOutside
      />

      <div className={styles.body}>
        <aside className={styles.subNav}>
          <h3 className={styles.subNavTitle}>{segment ? segment.name : 'Segment'}</h3>
          <div className={styles.subNavLinks}>
            {subSegments.map((sub) => (
              <Link
                key={sub.id}
                to={`/segment/${segmentId}/${sub.id}`}
                className={
                  isSegmentRoute && subSegmentId === sub.id
                    ? styles.subNavActive
                    : styles.subNavLink
                }
              >
                {sub.name}
              </Link>
            ))}
          </div>
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
