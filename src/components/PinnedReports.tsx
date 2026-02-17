import { Link } from 'react-router-dom'
import { getReportById } from '../data/reports-new'
import styles from './PinnedReports.module.css'

// In a real app this would be user-specific and persisted.
// For now we keep a static list of pinned report IDs that map to existing reports-new.ts entries.
const PINNED_REPORT_IDS = [
  'business-health-metrics',
  'lending-ratios',
  'highest-lowest-performers',
  'disbursement-metrics',
  'repayment-metrics',
  'npa-overview',
]

export function PinnedReports() {
  const pinnedReports = PINNED_REPORT_IDS.map((id) => getReportById(id)).filter(Boolean)

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pinned reports</h1>
        <p className={styles.subtitle}>
          Quick access to frequently used reports. In a full implementation, these would be specific to each user.
        </p>
      </header>

      <div className={styles.grid}>
        {pinnedReports.map((report) => (
          <Link
            to={`/segment/${report!.segmentId}/${report!.subSegmentId}`}
            key={report!.id}
            className={styles.card}
          >
            <h2 className={styles.cardTitle}>{report!.title}</h2>
            <p className={styles.cardDesc}>{report!.description}</p>
            <span className={styles.cardMeta}>
              Segment: {report!.segmentId} / {report!.subSegmentId}
            </span>
            <span className={styles.cardArrow}>View →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

