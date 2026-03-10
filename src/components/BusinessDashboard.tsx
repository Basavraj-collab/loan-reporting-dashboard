import { useState, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PortalOptionContext } from '../App'
import { getReportsBySubSegment } from '../data/reports-new'
import { MetricCard } from './MetricCard'
import { DataPopup } from './DataPopup'
import { BankingReportsView } from './BankingReportsView'
import {
  ProductWiseDisbursementView,
  ProductWiseCollectionView,
  ProductWiseRiskView,
} from './ProductWiseViews'
import styles from './BusinessDashboard.module.css'

function formatCell(cell: string | number): string {
  if (typeof cell === 'number') {
    if (cell >= 1000000) return `$${(cell / 1000000).toFixed(1)}M`
    if (cell >= 1000) return cell.toLocaleString()
    return String(cell)
  }
  return String(cell)
}

export function BusinessDashboard() {
  const { segmentId, subSegmentId } = useParams<{ segmentId: string; subSegmentId: string }>()
  const portalOption = useContext(PortalOptionContext)
  const reports = segmentId && subSegmentId ? getReportsBySubSegment(segmentId, subSegmentId) : []

  if (segmentId === 'banking-hygiene' && subSegmentId === 'banking-reports') {
    return <BankingReportsView />
  }

  if (segmentId === 'disbursement' && subSegmentId === 'loan-product-analysis') {
    return <ProductWiseDisbursementView />
  }
  if (segmentId === 'disbursement' && subSegmentId === 'impact-analysis') {
    return <ImpactAnalysisView />
  }
  if (segmentId === 'repayment' && subSegmentId === 'collection-analysis') {
    return <ProductWiseCollectionView />
  }
  if (segmentId === 'repayment' && subSegmentId === 'risk-analysis') {
    return <ProductWiseRiskView />
  }

  if (segmentId === 'business-dashboard') {
    if (subSegmentId === 'business-health') {
      if (portalOption === 2 || portalOption === 3) {
        return <BusinessHealthOption3View />
      }
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
  performanceWidgets?: {
    metricCohort: string
    highestPerformer: string
    lowestPerformer: string
    highestContributionPct: string
    lowestContributionPct: string
  }[]
}

function BusinessHealthView({ reports }: { reports: AnyReport[] }) {
  const businessHealthReport = reports.find((r) => r.id === 'business-health-metrics')
  const lendingRatiosReport = reports.find((r) => r.id === 'lending-ratios')
  const performersReport = reports.find((r) => r.id === 'highest-lowest-performers')

  const [activeTab, setActiveTab] = useState<'kpi' | 'ratios' | 'performance'>('kpi')
  const [performancePopup, setPerformancePopup] = useState<{
    widgetIndex: number
    row: 'highest' | 'lowest'
  } | null>(null)

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

    const widgets = performersReport?.performanceWidgets ?? []
    return (
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Performance distribution</h2>
        </div>
        <div className={styles.performanceWidgetsGrid}>
          {widgets.map((w, i) => (
            <div key={i} className={styles.performanceWidget}>
              <h3 className={styles.performanceWidgetTitle}>{w.metricCohort}</h3>
              <table className={styles.performanceMatrix} aria-label={`${w.metricCohort} – highest and lowest performer`}>
                <thead>
                  <tr>
                    <th className={styles.performanceMatrixTh} scope="col" />
                    <th className={styles.performanceMatrixTh} scope="col">Value</th>
                    <th className={styles.performanceMatrixTh} scope="col">% contribution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className={styles.performanceMatrixLabel}>Highest performer</td>
                    <td className={styles.performanceMatrixValue}>
                      <button
                        type="button"
                        className={styles.performanceMatrixValueBtn}
                        onClick={() => setPerformancePopup({ widgetIndex: i, row: 'highest' })}
                      >
                        {w.highestPerformer}
                      </button>
                    </td>
                    <td className={styles.performanceMatrixPct}>{w.highestContributionPct}</td>
                  </tr>
                  <tr>
                    <td className={styles.performanceMatrixLabel}>Lowest performer</td>
                    <td className={styles.performanceMatrixValue}>
                      <button
                        type="button"
                        className={styles.performanceMatrixValueBtn}
                        onClick={() => setPerformancePopup({ widgetIndex: i, row: 'lowest' })}
                      >
                        {w.lowestPerformer}
                      </button>
                    </td>
                    <td className={styles.performanceMatrixPct}>{w.lowestContributionPct}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
        {performancePopup !== null && performersReport?.rawData && (
          <DataPopup
            title={`${widgets[performancePopup.widgetIndex].metricCohort} – ${performancePopup.row === 'highest' ? 'Highest performer' : 'Lowest performer'}`}
            data={performersReport.rawData}
            onClose={() => setPerformancePopup(null)}
          />
        )}
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

/** Option 3 only: Business Health with Key KPI & Performance distribution as two tabs (same as Option 1), then Audience / Disbursement / Repayment Overview as sections below */
function BusinessHealthOption3View() {
  const healthReports = getReportsBySubSegment('business-dashboard', 'business-health')
  const audienceReports = getReportsBySubSegment('business-dashboard', 'audience-overview')
  const disbursementReports = getReportsBySubSegment('business-dashboard', 'disbursement-overview')
  const repaymentReports = getReportsBySubSegment('business-dashboard', 'repayment-overview')

  const businessHealthReport = healthReports.find((r: AnyReport) => r.id === 'business-health-metrics')
  const lendingRatiosReport = healthReports.find((r: AnyReport) => r.id === 'lending-ratios')
  const performersReport = healthReports.find((r: AnyReport) => r.id === 'highest-lowest-performers')
  const [activeTab, setActiveTab] = useState<'kpi' | 'performance'>('kpi')
  const [performancePopup, setPerformancePopup] = useState<{ widgetIndex: number; row: 'highest' | 'lowest' } | null>(null)
  const [expandedOverviews, setExpandedOverviews] = useState<Set<string>>(new Set(['audience', 'disbursement', 'repayment']))
  const toggleOverview = (id: string) => {
    setExpandedOverviews((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const activeCustomers = audienceReports.find((r: AnyReport) => r.id === 'active-customers')
  const customerDistribution = audienceReports.find((r: AnyReport) => r.id === 'customer-distribution')
  const disbursementMetrics = disbursementReports.find((r: AnyReport) => r.id === 'disbursement-metrics')
  const eligibilityBands = disbursementReports.find((r: AnyReport) => r.id === 'eligibility-band-distribution')
  const loanLimitBands = disbursementReports.find((r: AnyReport) => r.id === 'loan-limit-distribution')
  const repaymentMetrics = repaymentReports.find((r: AnyReport) => r.id === 'repayment-metrics')
  const collectionMetrics = repaymentReports.find((r: AnyReport) => r.id === 'collection-metrics')
  const npaOverview = repaymentReports.find((r: AnyReport) => r.id === 'npa-overview')
  const byStatus = repaymentReports.find((r: AnyReport) => r.id === 'repayment-by-status')
  const byDueBands = repaymentReports.find((r: AnyReport) => r.id === 'repayment-by-due-bands')
  const collectionByProduct = getReportsBySubSegment('repayment', 'collection-analysis').find((r: AnyReport) => r.id === 'collection-by-product')
  const riskByProduct = getReportsBySubSegment('repayment', 'risk-analysis').find((r: AnyReport) => r.id === 'risk-by-product')
  const writeOffReport = getReportsBySubSegment('repayment', 'risk-analysis').find((r: AnyReport) => r.id === 'write-off-analysis')

  const widgets = performersReport?.performanceWidgets ?? []

  return (
    <div className={styles.wrapper}>
      <div className={styles.businessHealth}>
        {/* Two side-by-side tabs same as Option 1: Key KPI | Performance distribution */}
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
            className={activeTab === 'performance' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('performance')}
          >
            Performance distribution
          </button>
        </div>

        {activeTab === 'kpi' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Key KPI</h2>
              <div className={styles.sectionActions}>
                <Link to="/segment/banking-hygiene/banking-reports" className={styles.navLink}>
                  <span>View accounting detail and loan transaction hygiene</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
            {/* First layer: initial KPIs only, in their own box */}
            <div className={styles.kpiOption3Layer1Box}>
              <div className={styles.kpiOption3Layer1}>
                {businessHealthReport?.metrics
                  .filter((m: any) => ['Yield', 'Disbursement', 'Collection', 'NPA', 'Default rate'].includes(m.label))
                  .map((metric: any, i: number) => (
                    <MetricCard key={`kpi1-${i}`} metric={{ ...metric, label: metric.label === 'NPA' ? 'NPA %' : metric.label }} report={businessHealthReport} />
                  ))}
                {lendingRatiosReport?.metrics
                  .filter((m: any) => m.label === 'Collection efficiency')
                  .map((metric: any, i: number) => (
                    <MetricCard key={`kpi1-ce-${i}`} metric={metric} report={lendingRatiosReport} />
                  ))}
              </div>
            </div>
            {/* Second layer: separate box below first layer; left/right KPI structure preserved */}
            <div className={styles.kpiOption3Layer2Box}>
              <div className={styles.kpiOption3Layer2}>
                <div className={styles.kpiOption3Col}>
                  <div className={styles.kpiOption3MetricRow}>
                    <span className={styles.kpiOption3Label}>Eligible customers</span>
                    <span className={styles.kpiOption3Value}>12,450</span>
                  </div>
                  <div className={styles.kpiOption3MetricRow}>
                    <span className={styles.kpiOption3Label}>Opted-in %</span>
                    <span className={styles.kpiOption3Value}>8,964 (72%)</span>
                  </div>
                  <div className={styles.kpiOption3MetricRow}>
                    <span className={styles.kpiOption3Label}>Uptake % - ATS</span>
                    <span className={styles.kpiOption3Value}>8,466 (68%) - $2.4</span>
                  </div>
                </div>
                <div className={styles.kpiOption3Col}>
                  <div className={styles.kpiOption3MetricRow}>
                    <span className={styles.kpiOption3Label}>Total failed transactions</span>
                    <span className={styles.kpiOption3Value}>1,120</span>
                  </div>
                  <div className={styles.kpiOption3MetricRow}>
                    <span className={styles.kpiOption3Label}>Total failed eligible transactions</span>
                    <span className={styles.kpiOption3Value}>420 (37%)</span>
                  </div>
                  <div className={styles.kpiOption3MetricRow}>
                    <span className={styles.kpiOption3Label}>Total eligible shown interest transactions</span>
                    <span className={styles.kpiOption3Value}>860 (69%)</span>
                  </div>
                  <div className={styles.kpiOption3MetricRow}>
                    <span className={styles.kpiOption3Label}>Transaction conversion</span>
                    <span className={styles.kpiOption3Value}>640 (52%)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'performance' && (
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Performance distribution</h2>
            </div>
            <div className={styles.performanceWidgetsGrid}>
              {widgets.map((w: any, i: number) => (
                <div key={i} className={styles.performanceWidget}>
                  <h3 className={styles.performanceWidgetTitle}>{w.metricCohort}</h3>
                  <table className={styles.performanceMatrix} aria-label={`${w.metricCohort} – highest and lowest performer`}>
                    <thead>
                      <tr>
                        <th className={styles.performanceMatrixTh} scope="col" />
                        <th className={styles.performanceMatrixTh} scope="col">Value</th>
                        <th className={styles.performanceMatrixTh} scope="col">% contribution</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className={styles.performanceMatrixLabel}>Highest performer</td>
                        <td className={styles.performanceMatrixValue}>
                          <button type="button" className={styles.performanceMatrixValueBtn} onClick={() => setPerformancePopup({ widgetIndex: i, row: 'highest' })}>{w.highestPerformer}</button>
                        </td>
                        <td className={styles.performanceMatrixPct}>{w.highestContributionPct}</td>
                      </tr>
                      <tr>
                        <td className={styles.performanceMatrixLabel}>Lowest performer</td>
                        <td className={styles.performanceMatrixValue}>
                          <button type="button" className={styles.performanceMatrixValueBtn} onClick={() => setPerformancePopup({ widgetIndex: i, row: 'lowest' })}>{w.lowestPerformer}</button>
                        </td>
                        <td className={styles.performanceMatrixPct}>{w.lowestContributionPct}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            {performancePopup !== null && performersReport?.rawData && (
              <DataPopup
                title={`${widgets[performancePopup.widgetIndex].metricCohort} – ${performancePopup.row === 'highest' ? 'Highest performer' : 'Lowest performer'}`}
                data={performersReport.rawData}
                onClose={() => setPerformancePopup(null)}
              />
            )}
          </section>
        )}

        {/* Audience Overview section (below tabs) – collapsible */}
        <section className={styles.section}>
          <button
            type="button"
            className={styles.collapsibleOverviewHeader}
            onClick={() => toggleOverview('audience')}
            aria-expanded={expandedOverviews.has('audience')}
          >
            <span className={styles.collapsibleOverviewArrow} aria-hidden>
              {expandedOverviews.has('audience') ? '▼' : '▶'}
            </span>
            <h2 className={styles.sectionTitle}>Audience Overview</h2>
          </button>
          {expandedOverviews.has('audience') && (
          <div className={styles.collapsibleOverviewBody}>
          <div className={styles.metricsGrid}>
            {activeCustomers?.metrics.map((metric: any, i: number) => (
              <MetricCard key={i} metric={metric} report={activeCustomers} />
            ))}
          </div>
          {activeCustomers?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead><tr>{activeCustomers.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                <tbody>
                  {activeCustomers.table.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j}>{formatCell(cell)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {customerDistribution?.table && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginTop: '1rem', fontSize: '1rem' }}>Customer & geography breakdown</h3>
              <div className={styles.tableSection}>
                <table className={styles.table}>
                  <thead><tr>{customerDistribution.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                  <tbody>
                    {customerDistribution.table.rows.map((row, i) => (
                      <tr key={i}>{row.map((cell, j) => <td key={j}>{formatCell(cell)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.sectionActions}>
                <Link to="/segment/marketing-audience/audience-intelligence" className={styles.navLink}>
                  <span>View detailed customer-attributes analysis</span><span>→</span>
                </Link>
              </div>
            </>
          )}
          </div>
          )}
        </section>

        {/* 4. Disbursement Overview – collapsible */}
        <section className={styles.section}>
          <button
            type="button"
            className={styles.collapsibleOverviewHeader}
            onClick={() => toggleOverview('disbursement')}
            aria-expanded={expandedOverviews.has('disbursement')}
          >
            <span className={styles.collapsibleOverviewArrow} aria-hidden>
              {expandedOverviews.has('disbursement') ? '▼' : '▶'}
            </span>
            <h2 className={styles.sectionTitle}>Disbursement Overview</h2>
          </button>
          {expandedOverviews.has('disbursement') && (
          <div className={styles.collapsibleOverviewBody}>
          <div className={styles.metricsGrid}>
            {disbursementMetrics?.metrics.map((metric: any, i: number) => (
              <MetricCard key={i} metric={metric} report={disbursementMetrics} />
            ))}
          </div>
          {disbursementMetrics?.table && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginTop: '1rem', fontSize: '1rem' }}>Product-wise split</h3>
              <div className={styles.tableSection}>
                <table className={styles.table}>
                  <thead><tr>{disbursementMetrics.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                  <tbody>
                    {disbursementMetrics.table.rows.map((row, i) => (
                      <tr key={i}>{row.map((cell, j) => <td key={j}>{formatCell(cell)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.sectionActions}>
                <Link to="/segment/disbursement/loan-product-analysis" className={styles.navLink}>
                  <span>View detailed product-wise analysis</span><span>→</span>
                </Link>
              </div>
            </>
          )}
          {eligibilityBands?.table && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginTop: '1rem', fontSize: '1rem' }}>Eligibility and limit band usage</h3>
              <div className={styles.tableSection}>
                <table className={styles.table}>
                  <thead><tr>{eligibilityBands.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                  <tbody>
                    {eligibilityBands.table.rows.map((row, i) => (
                      <tr key={i}>{row.map((cell, j) => <td key={j}>{formatCell(cell)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {loanLimitBands?.table && (
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead><tr>{loanLimitBands.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                <tbody>
                  {loanLimitBands.table.rows.map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j}>{formatCell(cell)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          </div>
          )}
        </section>

        {/* 5. Repayment Overview – collapsible */}
        <section className={styles.section}>
          <button
            type="button"
            className={styles.collapsibleOverviewHeader}
            onClick={() => toggleOverview('repayment')}
            aria-expanded={expandedOverviews.has('repayment')}
          >
            <span className={styles.collapsibleOverviewArrow} aria-hidden>
              {expandedOverviews.has('repayment') ? '▼' : '▶'}
            </span>
            <h2 className={styles.sectionTitle}>Repayment Overview</h2>
          </button>
          {expandedOverviews.has('repayment') && (
          <div className={styles.collapsibleOverviewBody}>
          <div className={styles.metricsGrid}>
            {repaymentMetrics?.metrics.filter((m: any) => m.label === 'Repayment Rate').map((metric: any, i: number) => (
              <MetricCard key={`rr-${i}`} metric={metric} report={repaymentMetrics} />
            ))}
            {collectionMetrics?.metrics.filter((m: any) => m.label === 'Collection Efficiency').map((metric: any, i: number) => (
              <MetricCard key={`ce-${i}`} metric={metric} report={collectionMetrics} />
            ))}
            {npaOverview?.metrics.map((metric: any, i: number) => (
              <MetricCard key={`npa-${i}`} metric={metric} report={npaOverview} />
            ))}
            {writeOffReport?.metrics.filter((m: any) => m.label === 'Write-off Rate').map((metric: any, i: number) => (
              <MetricCard key={`wo-${i}`} metric={metric} report={writeOffReport} />
            ))}
          </div>
          {collectionByProduct && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Collection by Product</h3>
              <div className={styles.metricsGrid}>
                {collectionByProduct.metrics.map((metric: any, i: number) => (
                  <MetricCard key={i} metric={metric} report={collectionByProduct} />
                ))}
              </div>
            </div>
          )}
          {riskByProduct && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>NPA by Product</h3>
              <div className={styles.metricsGrid}>
                {riskByProduct.metrics.map((metric: any, i: number) => (
                  <MetricCard key={i} metric={metric} report={riskByProduct} />
                ))}
              </div>
            </div>
          )}
          <div className={styles.sectionActions}>
            <Link to="/segment/repayment/collection-analysis" className={styles.navLink}>
              <span>View detailed product-wise analysis</span><span>→</span>
            </Link>
          </div>
          {byStatus?.table && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginTop: '1rem', fontSize: '1rem' }}>By loan status (open / closed)</h3>
              <div className={styles.tableSection}>
                <table className={styles.table}>
                  <thead><tr>{byStatus.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                  <tbody>
                    {byStatus.table.rows.map((row, i) => (
                      <tr key={i}>{row.map((cell, j) => <td key={j}>{formatCell(cell)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {byDueBands?.table && (
            <>
              <h3 className={styles.sectionTitle} style={{ marginTop: '1rem', fontSize: '1rem' }}>By due bands</h3>
              <div className={styles.tableSection}>
                <table className={styles.table}>
                  <thead><tr>{byDueBands.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
                  <tbody>
                    {byDueBands.table.rows.map((row, i) => (
                      <tr key={i}>{row.map((cell, j) => <td key={j}>{formatCell(cell)}</td>)}</tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          </div>
          )}
        </section>
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

/** Raw data for Impact Analysis popup (columns, download, close) */
const IMPACT_ANALYSIS_RAW_DATA: { headers: string[]; rows: (string | number)[][] } = {
  headers: [
    'Loan ID',
    'Product',
    'Region',
    'Age',
    'Occupation',
    'Repeat user',
    'Disbursement amount',
    'Disbursement date',
    'Resurrected',
  ],
  rows: [
    ['IA-10001', '3 Month', 'North', '28', 'Salaried', 'Yes', 221000, '2025-01-05', 'No'],
    ['IA-10002', '6 Month', 'South', '35', 'Self Employed', 'Yes', 254000, '2025-01-08', 'No'],
    ['IA-10003', '9 Month', 'East', '42', 'Business', 'Yes', 261000, '2025-01-12', 'Yes'],
    ['IA-10004', '3 Month', 'West', '31', 'Salaried', 'No', 198000, '2025-01-15', 'No'],
    ['IA-10005', '6 Month', 'North', '39', 'Salaried', 'Yes', 248000, '2025-01-18', 'No'],
    ['IA-10006', '9 Month', 'South', '45', 'Business', 'Yes', 272000, '2025-01-22', 'No'],
  ],
}

type ImpactSectionRow = { dimensionValue: string; repeatUsers: string; numLoans: string; avgLoanSize: string }

const IMPACT_SECTIONS: { title: string; dimensionHeader: string; rows: ImpactSectionRow[] }[] = [
  {
    title: 'Product type',
    dimensionHeader: 'Product',
    rows: [
      { dimensionValue: '3 Month', repeatUsers: '520', numLoans: '1,240', avgLoanSize: '$22,100' },
      { dimensionValue: '6 Month', repeatUsers: '680', numLoans: '1,580', avgLoanSize: '$25,400' },
      { dimensionValue: '9 Month', repeatUsers: '650', numLoans: '1,520', avgLoanSize: '$26,100' },
    ],
  },
  {
    title: 'Region',
    dimensionHeader: 'Region',
    rows: [
      { dimensionValue: 'North', repeatUsers: '680', numLoans: '1,620', avgLoanSize: '$24,200' },
      { dimensionValue: 'South', repeatUsers: '520', numLoans: '1,380', avgLoanSize: '$23,800' },
      { dimensionValue: 'East', repeatUsers: '420', numLoans: '1,100', avgLoanSize: '$24,900' },
      { dimensionValue: 'West', repeatUsers: '230', numLoans: '640', avgLoanSize: '$23,100' },
    ],
  },
  {
    title: 'Age',
    dimensionHeader: 'Age',
    rows: [
      { dimensionValue: '20–30', repeatUsers: '320', numLoans: '880', avgLoanSize: '$21,500' },
      { dimensionValue: '30–40', repeatUsers: '580', numLoans: '1,420', avgLoanSize: '$24,800' },
      { dimensionValue: '40–50', repeatUsers: '480', numLoans: '1,180', avgLoanSize: '$25,200' },
      { dimensionValue: '50+', repeatUsers: '470', numLoans: '1,120', avgLoanSize: '$26,400' },
    ],
  },
  {
    title: 'Occupation',
    dimensionHeader: 'Occupation',
    rows: [
      { dimensionValue: 'Salaried', repeatUsers: '720', numLoans: '1,840', avgLoanSize: '$24,100' },
      { dimensionValue: 'Self Employed', repeatUsers: '380', numLoans: '920', avgLoanSize: '$25,600' },
      { dimensionValue: 'Business', repeatUsers: '420', numLoans: '980', avgLoanSize: '$26,200' },
      { dimensionValue: 'Student', repeatUsers: '330', numLoans: '760', avgLoanSize: '$20,800' },
    ],
  },
]

function ImpactAnalysisView() {
  const [popup, setPopup] = useState<{ title: string } | null>(null)

  const openPopup = (title: string) => setPopup({ title })
  const closePopup = () => setPopup(null)

  return (
    <div className={styles.wrapper}>
      <div className={styles.impactAnalysis}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Impact analysis – overview</h2>
          </div>
          <div className={styles.impactOverallMetrics}>
            <div className={styles.impactMetricCard}>
              <span className={styles.impactMetricLabel}>Repeat users</span>
              <span className={styles.impactMetricValue}>1,850</span>
            </div>
            <div className={styles.impactMetricCard}>
              <span className={styles.impactMetricLabel}>Avg loan size</span>
              <span className={styles.impactMetricValue}>$24,500</span>
            </div>
            <div className={styles.impactMetricCard}>
              <span className={styles.impactMetricLabel}>Resurrected users</span>
              <span className={styles.impactMetricValue}>312</span>
            </div>
          </div>
        </section>

        {IMPACT_SECTIONS.map((section, sectionIdx) => (
          <section key={sectionIdx} className={styles.section}>
            <h3 className={styles.impactSectionHeading}>{section.title}</h3>
            <div className={styles.tableSection}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>{section.dimensionHeader}</th>
                    <th>Repeat users</th>
                    <th># of loans taken</th>
                    <th>Avg loan size</th>
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      <td className={styles.impactDimensionCell}>{row.dimensionValue}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.impactValueBtn}
                          onClick={() => openPopup(`${section.title} – Repeat users – ${row.dimensionValue}`)}
                        >
                          {row.repeatUsers}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.impactValueBtn}
                          onClick={() => openPopup(`${section.title} – # of loans taken – ${row.dimensionValue}`)}
                        >
                          {row.numLoans}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className={styles.impactValueBtn}
                          onClick={() => openPopup(`${section.title} – Avg loan size – ${row.dimensionValue}`)}
                        >
                          {row.avgLoanSize}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}

        {popup && (
          <DataPopup
            title={popup.title}
            data={IMPACT_ANALYSIS_RAW_DATA}
            onClose={closePopup}
          />
        )}
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
