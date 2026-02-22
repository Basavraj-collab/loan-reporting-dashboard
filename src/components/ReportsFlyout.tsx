import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopicGroups, getReportById, type RecentItem } from '../data/reportDiscovery'
import styles from './ReportsFlyout.module.css'

const PINNED_REPORT_IDS = [
  'business-health-metrics',
  'lending-ratios',
  'highest-lowest-performers',
  'disbursement-metrics',
  'repayment-metrics',
  'npa-overview',
]

interface ReportsFlyoutProps {
  open: boolean
  onClose: () => void
  recent: RecentItem[]
  onNavigate?: () => void
  /** When true, defer adding click-outside listener so the opening click does not close the flyout */
  deferClickOutside?: boolean
}

export function ReportsFlyout({ open, onClose, recent, onNavigate, deferClickOutside }: ReportsFlyoutProps) {
  const [filter, setFilter] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleEscape)
      setFilter('')
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    if (!open) return
    if (deferClickOutside) {
      const id = setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
      return () => {
        clearTimeout(id)
        document.removeEventListener('click', handleClickOutside)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [open, onClose, deferClickOutside])

  const goTo = (segmentId: string, subSegmentId: string) => {
    navigate(`/segment/${segmentId}/${subSegmentId}`)
    onNavigate?.()
    onClose()
  }

  const pinnedEntries = PINNED_REPORT_IDS.map((id) => getReportById(id)).filter(Boolean)
  const topicGroups = getTopicGroups()
  const filterLower = filter.trim().toLowerCase()
  const filteredGroups = filterLower
    ? topicGroups
        .map((g) => ({
          ...g,
          reports: g.reports.filter(
            (r) =>
              r.title.toLowerCase().includes(filterLower) ||
              r.description.toLowerCase().includes(filterLower)
          ),
        }))
        .filter((g) => g.reports.length > 0)
    : topicGroups

  if (!open) return null

  return (
    <div className={styles.overlay} role="dialog" aria-label="Browse reports">
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Reports</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className={styles.filterWrap}>
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Filter reports"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            aria-label="Filter reports in list"
          />
        </div>
        <div className={styles.scroll}>
          {recent.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Recently viewed</h3>
              <div className={styles.linkList}>
                {recent.map((r, i) => (
                  <button
                    key={`${r.segmentId}-${r.subSegmentId}-${i}`}
                    type="button"
                    className={styles.link}
                    onClick={() => goTo(r.segmentId, r.subSegmentId)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </section>
          )}
          {pinnedEntries.length > 0 && (
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Pinned</h3>
              <div className={styles.linkList}>
                {pinnedEntries.map((p) => (
                  <button
                    key={p!.id}
                    type="button"
                    className={styles.link}
                    onClick={() => goTo(p!.segmentId, p!.subSegmentId)}
                  >
                    {p!.title}
                  </button>
                ))}
              </div>
            </section>
          )}
          {filteredGroups.map((g) => (
            <section key={g.topicId} className={styles.section}>
              <h3 className={styles.sectionTitle}>{g.topicLabel}</h3>
              <div className={styles.linkList}>
                {g.reports.map((r) => (
                  <button
                    key={r.reportId}
                    type="button"
                    className={styles.link}
                    onClick={() => goTo(r.segmentId, r.subSegmentId)}
                  >
                    {r.title}
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
