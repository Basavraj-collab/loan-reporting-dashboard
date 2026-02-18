import { useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { segments } from '../data/navigation'
import styles from './Option3Layout.module.css'

interface Option3LayoutProps {
  children: React.ReactNode
}

export function Option3Layout({ children }: Option3LayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const { segmentId, subSegmentId } = useMemo(() => {
    const m = location.pathname.match(/^\/segment\/([^/]+)\/([^/]+)/)
    if (m) return { segmentId: m[1], subSegmentId: m[2] }
    const seg = segments[0]
    const sub = seg?.subSegments[0]
    return { segmentId: seg?.id ?? '', subSegmentId: sub?.id ?? '' }
  }, [location.pathname])

  const segment = useMemo(() => segments.find((s) => s.id === segmentId), [segmentId])
  const subSegments = segment?.subSegments ?? []

  const onSegmentChange = (segId: string) => {
    const seg = segments.find((s) => s.id === segId)
    const first = seg?.subSegments[0]
    if (first) navigate('/segment/' + segId + '/' + first.id)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span>Loan Reports</span>
        </div>
        <nav className={styles.breadcrumbNav}>
          <button type="button" className={styles.pinnedBtn} onClick={() => navigate('/pinned')}>
            Pinned
          </button>
          <span className={styles.sep}>|</span>
          <span className={styles.breadcrumbLabel}>Segment:</span>
          <select className={styles.breadcrumbSelect} value={segmentId} onChange={(e) => onSegmentChange(e.target.value)}>
            {segments.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {segment ? (
            <>
              <span className={styles.breadcrumbSep}>›</span>
              <span className={styles.breadcrumbSub}>{segment.name}</span>
            </>
          ) : null}
        </nav>
      </header>
      <div className={styles.body}>
        <aside className={styles.subNav}>
          <h3 className={styles.subNavTitle}>{segment ? segment.name : 'Segment'}</h3>
          <div className={styles.subNavLinks}>
            {subSegments.map((sub) => (
              <Link
                key={sub.id}
                to={`/segment/${segmentId}/${sub.id}`}
                className={subSegmentId === sub.id ? styles.subNavActive : styles.subNavLink}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </aside>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
