import { useParams, Link } from 'react-router-dom'
import { getReportById, getReports } from '../data/reports'
import styles from './ReportView.module.css'

export function ReportView() {
  const { reportId } = useParams<{ reportId: string }>()
  const report = reportId ? getReportById(reportId) : null
  const allReports = getReports()
  const currentIndex = report ? allReports.findIndex((r) => r.id === report.id) : -1
  const prevReport = currentIndex > 0 ? allReports[currentIndex - 1] : null
  const nextReport = currentIndex >= 0 && currentIndex < allReports.length - 1 ? allReports[currentIndex + 1] : null

  if (!report) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.error}>Report not found.</p>
        <Link to="/reports" className={styles.backLink}>← Back to reports</Link>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <nav className={styles.breadcrumb}>
        <Link to="/reports">Reports</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span>{report.title}</span>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.title}>{report.title}</h1>
        <p className={styles.description}>{report.description}</p>
        <span className={styles.category}>{report.category}</span>
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
          <h3 className={styles.tableTitle}>Details</h3>
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

      <footer className={styles.navFooter}>
        {prevReport ? (
          <Link to={`/reports/${prevReport.id}`} className={styles.navButton}>
            ← {prevReport.title}
          </Link>
        ) : (
          <span />
        )}
        <Link to="/reports" className={styles.backLink}>All reports</Link>
        {nextReport ? (
          <Link to={`/reports/${nextReport.id}`} className={styles.navButton}>
            {nextReport.title} →
          </Link>
        ) : (
          <span />
        )}
      </footer>
    </div>
  )
}
