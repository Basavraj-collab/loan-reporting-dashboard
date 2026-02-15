import { useParams, Link } from 'react-router-dom'
import { getReportById } from '../data/reports-new'
import styles from './SegmentView.module.css'

export function SegmentView() {
  const { reportId } = useParams<{ reportId: string }>()
  const report = reportId ? getReportById(reportId) : null

  if (!report) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.error}>Report not found.</p>
        <Link to={`/segment/${report?.segmentId}/${report?.subSegmentId}`} className={styles.backLink}>
          ← Back
        </Link>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.breadcrumb}>
        <Link to={`/segment/${report.segmentId}/${report.subSegmentId}`}>Back</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span>{report.title}</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.title}>{report.title}</h1>
        <p className={styles.description}>{report.description}</p>
      </header>

      {report.metrics && report.metrics.length > 0 && (
        <div className={styles.metrics}>
          {report.metrics.map((m, i) => (
            <div key={i} className={styles.metricCard}>
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricValue}>
                {m.value}
                {m.change != null && (
                  <span className={styles.metricChange} data-trend={m.trend}>
                    {' '}{m.change}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {report.table && (
        <div className={styles.tableSection}>
          <table className={styles.table}>
            <thead>
              <tr>
                {report.table.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      {typeof cell === 'number'
                        ? cell >= 1000000
                          ? `$${(cell / 1000000).toFixed(1)}M`
                          : cell >= 1000
                            ? cell.toLocaleString()
                            : cell
                        : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
