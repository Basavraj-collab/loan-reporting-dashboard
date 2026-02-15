import { Link, useParams } from 'react-router-dom'
import { getReportsBySubSegment, getReportById } from '../data/reports-new'
import { NavigationBar } from './NavigationBar'
import { MetricCard } from './MetricCard'
import { DataPopup } from './DataPopup'
import styles from './BusinessDashboard.module.css'

export function BusinessDashboard() {
  const { segmentId, subSegmentId } = useParams<{ segmentId: string; subSegmentId: string }>()
  const reports = segmentId && subSegmentId ? getReportsBySubSegment(segmentId, subSegmentId) : []

  if (segmentId === 'business-dashboard' && subSegmentId === 'business-health') {
    return <BusinessHealthView reports={reports} />
  }

  return (
    <div className={styles.wrapper}>
      <NavigationBar segmentId={segmentId || ''} subSegmentId={subSegmentId || ''} />
      <div className={styles.reportsGrid}>
        {reports.map((report) => (
          <div key={report.id} className={styles.reportCard}>
            <h3 className={styles.reportTitle}>{report.title}</h3>
            <p className={styles.reportDesc}>{report.description}</p>
            <div className={styles.metrics}>
              {report.metrics.map((metric, i) => (
                <MetricCard key={i} metric={metric} report={report} />
              ))}
            </div>
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
        ))}
      </div>
    </div>
  )
}

function BusinessHealthView({ reports }: { reports: any[] }) {
  const businessHealthReport = reports.find((r) => r.id === 'business-health-metrics')
  const lendingRatiosReport = reports.find((r) => r.id === 'lending-ratios')
  const performersReport = reports.find((r) => r.id === 'highest-lowest-performers')

  return (
    <div className={styles.wrapper}>
      <NavigationBar segmentId="business-dashboard" subSegmentId="business-health" />
      
      <div className={styles.businessHealth}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Key Metrics</h2>
          <div className={styles.metricsGrid}>
            {businessHealthReport?.metrics.map((metric: any, i: number) => (
              <MetricCard key={i} metric={metric} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Lending Ratios</h2>
          <div className={styles.metricsGrid}>
            {lendingRatiosReport?.metrics.map((metric: any, i: number) => (
              <MetricCard key={i} metric={metric} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Highest & Lowest Performers</h2>
          <div className={styles.metricsGrid}>
            {performersReport?.metrics.map((metric: any, i: number) => (
              <MetricCard key={i} metric={metric} report={performersReport} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
