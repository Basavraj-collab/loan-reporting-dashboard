import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { segments } from '../data/navigation'
import styles from './Option2Layout.module.css'

interface Option2LayoutProps {
  children: React.ReactNode
}

export function Option2Layout({ children }: Option2LayoutProps) {
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

  const onSubSegmentChange = (subId: string) => {
    navigate('/segment/' + segmentId + '/' + subId)
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span>Loan Reports</span>
        </div>
        <nav className={styles.nav}>
          <button type="button" className={styles.pinnedBtn} onClick={() => navigate('/pinned')}>
            Pinned reports
          </button>
          <div className={styles.dropdownGroup}>
            <label className={styles.dropdownLabel}>Segment</label>
            <select className={styles.select} value={segmentId} onChange={(e) => onSegmentChange(e.target.value)}>
              {segments.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.dropdownGroup}>
            <label className={styles.dropdownLabel}>Sub-segment</label>
            <select className={styles.select} value={subSegmentId} onChange={(e) => onSubSegmentChange(e.target.value)}>
              {subSegments.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </nav>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}
