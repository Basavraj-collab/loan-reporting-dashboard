import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getReportsBySubSegment } from '../data/reports-new'
import { MetricCard } from './MetricCard'
import styles from './BusinessDashboard.module.css'

export function BusinessDashboard() {
  const { segmentId, subSegmentId } = useParams<{ segmentId: string; subSegmentId: string }>()
  const reports = segmentId && subSegmentId ? getReportsBySubSegment(segmentId, subSegmentId) : []

  if (segmentId === 'business-dashboard') {
    if (subSegmentId === 'business-health') {
      return <BusinessHealthView reports={reports} />
    }
    if (subSegmentId === 'audience-overview') {
      return <AudienceOverviewView reports={reports} />
    }
    if (subSegmentId === 'disbursement-overview') {
      return <DisbursementOverviewView reports={reports} />
    }
    if (subSegmentId === 'repayment-overview') {
      return <RepaymentOverviewView reports={reports} />
    }
  }

  return (
    <div className={styles.wrapper}>
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

type AnyReport = {
  id: string
  title: string
  description: string
  metrics: any[]
  table?: { headers: string[]; rows: (string | number)[][] }
  rawData?: { headers: string[]; rows: (string | number)[][] }
}

function BusinessHealthView({ reports }: { reports: AnyReport[] }) {
  const businessHealthReport = reports.find((r) => r.id === 'business-health-metrics')
  const lendingRatiosReport = reports.find((r) => r.id === 'lending-ratios')
  const performersReport = reports.find((r) => r.id === 'highest-lowest-performers')

  const [activeTab, setActiveTab] = useState<'kpi' | 'ratios' | 'performance'>('kpi')

  const renderTabContent = () => {
    if (activeTab === 'kpi') {
      return (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Key KPI</h2>
            <div className={styles.sectionActions}>
              <Link
                to="/segment/banking-hygiene/banking-reports"
                className={styles.navLink}
              >
                <span>View accounting detail and loan transaction hygiene</span>
                <span>→</span>
              </Link>
            </div>
          </div>
          <div className={styles.metricsGrid}>
            {businessHealthReport?.metrics.map((metric, i) => (
              <MetricCard key={i} metric={metric} report={businessHealthReport} />
            ))}
          </div>
        </section>
      )
    }

    if (activeTab === 'ratios') {
      return (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Ratios</h2>
          </div>
          <div className={styles.metricsGrid}>
            {lendingRatiosReport?.metrics.map((metric, i) => (
              <MetricCard key={i} metric={metric} report={lendingRatiosReport} />
            ))}
          </div>
        </section>
      )
    }

    return (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Performance distribution</h2>
        </div>
        <div className={styles.metricsGrid}>
          {performersReport?.metrics.map((metric, i) => (
            <MetricCard key={i} metric={metric} report={performersReport} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.businessHealth}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={activeTab === 'kpi' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('kpi')}
          >
            Key KPI
          </button>
          <button
            type="button"
            className={activeTab === 'ratios' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('ratios')}
          >
            Ratios
          </button>
          <button
            type="button"
            className={activeTab === 'performance' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('performance')}
          >
            Performance distribution
          </button>
        </div>

        {renderTabContent()}
      </div>
    </div>
  )
}

function AudienceOverviewView({ reports }: { reports: AnyReport[] }) {
  const activeCustomers = reports.find((r) => r.id === 'active-customers')
  const customerDistribution = reports.find((r) => r.id === 'customer-distribution')

  return (
    <div className={styles.wrapper}>
      <div className={styles.businessHealth}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Active users overview</h2>
          </div>
          <div className={styles.metricsGrid}>
            {activeCustomers?.metrics.map((metric, i) => (
              <MetricCard key={i} metric={metric} report={activeCustomers} />
            ))}
          </div>
          {activeCustomers?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {activeCustomers.table.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {activeCustomers.table.rows.map((row, i) => (
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
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Customer & geography breakdown</h2>
          </div>
          {customerDistribution?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {customerDistribution.table.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customerDistribution.table.rows.map((row, i) => (
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

          <div className={styles.sectionActions}>
            <Link
              to="/segment/marketing-audience/audience-intelligence"
              className={styles.navLink}
            >
              <span>View detailed customer-attributes analysis</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function DisbursementOverviewView({ reports }: { reports: AnyReport[] }) {
  const disbursementMetrics = reports.find((r) => r.id === 'disbursement-metrics')
  const eligibilityBands = reports.find((r) => r.id === 'eligibility-band-distribution')
  const loanLimitBands = reports.find((r) => r.id === 'loan-limit-distribution')

  return (
    <div className={styles.wrapper}>
      <div className={styles.businessHealth}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Disbursement overview</h2>
          </div>
          <div className={styles.metricsGrid}>
            {disbursementMetrics?.metrics.map((metric, i) => (
              <MetricCard key={i} metric={metric} report={disbursementMetrics} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Product-wise split</h2>
          </div>
          {disbursementMetrics?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {disbursementMetrics.table.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {disbursementMetrics.table.rows.map((row, i) => (
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
          <div className={styles.sectionActions}>
            <Link
              to="/segment/disbursement/loan-product-analysis"
              className={styles.navLink}
            >
              <span>View detailed product-wise analysis</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Eligibility and limit band usage</h2>
          </div>
          {eligibilityBands?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {eligibilityBands.table.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {eligibilityBands.table.rows.map((row, i) => (
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

          {loanLimitBands?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {loanLimitBands.table.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loanLimitBands.table.rows.map((row, i) => (
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
        </section>
      </div>
    </div>
  )
}

function RepaymentOverviewView({ reports }: { reports: AnyReport[] }) {
  const repaymentMetrics = reports.find((r) => r.id === 'repayment-metrics')
  const collectionMetrics = reports.find((r) => r.id === 'collection-metrics')
  const npaOverview = reports.find((r) => r.id === 'npa-overview')
  const byStatus = reports.find((r) => r.id === 'repayment-by-status')
  const byDueBands = reports.find((r) => r.id === 'repayment-by-due-bands')
  
  // Get product-wise reports from repayment segment
  const collectionByProduct = getReportsBySubSegment('repayment', 'collection-analysis').find((r) => r.id === 'collection-by-product')
  const riskByProduct = getReportsBySubSegment('repayment', 'risk-analysis').find((r) => r.id === 'risk-by-product')
  const writeOffReport = getReportsBySubSegment('repayment', 'risk-analysis').find((r) => r.id === 'write-off-analysis')

  return (
    <div className={styles.wrapper}>
      <div className={styles.businessHealth}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Repayment KPIs</h2>
          </div>
          <div className={styles.metricsGrid}>
            {repaymentMetrics?.metrics.filter((m) => m.label === 'Repayment Rate').map((metric, i) => (
              <MetricCard key={i} metric={metric} report={repaymentMetrics} />
            ))}
            {collectionMetrics?.metrics.filter((m) => m.label === 'Collection Efficiency').map((metric, i) => (
              <MetricCard key={`collection-${i}`} metric={metric} report={collectionMetrics} />
            ))}
            {npaOverview?.metrics.map((metric, i) => (
              <MetricCard key={`npa-${i}`} metric={metric} report={npaOverview} />
            ))}
            {writeOffReport?.metrics.filter((m) => m.label === 'Write-off Rate').map((metric, i) => (
              <MetricCard key={`writeoff-${i}`} metric={metric} report={writeOffReport} />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Product-wise metrics</h2>
          </div>
          {collectionByProduct && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Collection by Product</h3>
              <div className={styles.metricsGrid}>
                {collectionByProduct.metrics.map((metric, i) => (
                  <MetricCard key={`col-prod-${i}`} metric={metric} report={collectionByProduct} />
                ))}
              </div>
            </div>
          )}
          {riskByProduct && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>NPA by Product</h3>
              <div className={styles.metricsGrid}>
                {riskByProduct.metrics.map((metric, i) => (
                  <MetricCard key={`risk-prod-${i}`} metric={metric} report={riskByProduct} />
                ))}
              </div>
            </div>
          )}
          <div className={styles.sectionActions}>
            <Link
              to="/segment/repayment/collection-analysis"
              className={styles.navLink}
            >
              <span>View detailed product-wise analysis</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>By loan status (open / closed)</h2>
          </div>
          {byStatus?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {byStatus.table.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {byStatus.table.rows.map((row, i) => (
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
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>By due bands</h2>
          </div>
          {byDueBands?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {byDueBands.table.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {byDueBands.table.rows.map((row, i) => (
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

          <div className={styles.sectionActions}>
            <Link
              to="/segment/repayment/collection-analysis"
              className={styles.navLink}
            >
              <span>View detailed product-wise analysis</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
