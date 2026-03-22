import { useState, useContext, useMemo, useRef, useEffect } from 'react'
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
import { DisbursementProductVariantPanel } from './DisbursementProductVariantPanel'
import { RepaymentProductVariantPanel } from './RepaymentProductVariantPanel'
import {
  isDisbursementVariantProductLabel,
  isRepaymentVariantProductLabel,
  REPAYMENT_OVERVIEW_PRODUCT_KPI_ROWS,
  REPAYMENT_OVERVIEW_DUE_STATUS_ROWS,
} from '../data/productWiseReportData'
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
      // Option 2 & 3: layered Key KPI, Disbursement target, Amount to be collected (never NPA %), funnel + dimension dropdown
      if (portalOption === 2 || portalOption === 3) {
        return <BusinessHealthOption23BusinessHealthView />
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

/** First-layer KPI cards for Option 2 & 3 Business Health (explicit order; no NPA / NPA % label). */
function buildOption23BusinessHealthFirstLayer(
  businessHealthReport: AnyReport | undefined,
  lendingRatiosReport: AnyReport | undefined
): { metric: any; target?: string; report: AnyReport }[] {
  const metrics = businessHealthReport?.metrics ?? []
  const pick = (label: string) => metrics.find((x: any) => x.label === label)
  const ce = lendingRatiosReport?.metrics.find((x: any) => x.label === 'Collection efficiency')

  const yieldM = pick('Yield')
  const disbM = pick('Disbursement')
  const collM = pick('Collection')
  const defM = pick('Default rate')

  const amountToCollect: any = {
    label: 'Amount to be collected',
    value: '$28.5M',
    change: '+2.1%',
    trend: 'up' as const,
  }
  const fromData = pick('Amount to be collected') || pick('NPA') || pick('NPA %')
  if (fromData?.label === 'Amount to be collected' && fromData.value) {
    amountToCollect.value = fromData.value
    if (fromData.change != null) amountToCollect.change = fromData.change
    if (fromData.trend != null) amountToCollect.trend = fromData.trend
  }

  const out: { metric: any; target?: string; report: AnyReport }[] = []
  if (yieldM && businessHealthReport) out.push({ metric: yieldM, report: businessHealthReport })
  if (disbM && businessHealthReport)
    out.push({ metric: disbM, target: '$26.0M', report: businessHealthReport })
  if (collM && businessHealthReport) out.push({ metric: collM, report: businessHealthReport })
  if (businessHealthReport) out.push({ metric: amountToCollect, report: businessHealthReport })
  if (defM && businessHealthReport) out.push({ metric: defM, report: businessHealthReport })
  if (ce && lendingRatiosReport) out.push({ metric: ce, report: lendingRatiosReport })
  return out
}

/**
 * Option 2 & 3 — single multi-select (dimensions + KPIs). Ids for KPIs match FUNNEL_TABLE_COLUMN_DEFS (except month, always shown).
 */
const FUNNEL_MULTI_DIMENSION_CHOICES: { id: string; label: string }[] = [
  { id: 'dim-age', label: 'Age' },
  { id: 'dim-user-type', label: 'User type' },
  { id: 'dim-region', label: 'Region' },
  { id: 'dim-occupation', label: 'Occupation' },
]

const FUNNEL_MULTI_KPI_CHOICES: { id: string; label: string }[] = [
  { id: 'eligible', label: 'Eligible base' },
  { id: 'uptake', label: 'Cx Uptake %' },
  { id: 'borrowers', label: '# of borrowers' },
  { id: 'ats', label: 'Average ticket size (TSH)' },
  { id: 'disbursals', label: 'Disbursals' },
  { id: 'principal-overall', label: 'Principal repayment — overall' },
  { id: 'principal-7', label: 'Principal repayment — 7-day' },
  { id: 'principal-14', label: 'Principal repayment — 14-day' },
  { id: 'gross-yield', label: 'Gross yield %' },
  { id: 'interest-accrued', label: 'Interest accrued' },
]

const FUNNEL_MULTI_DEFAULT_SELECTION: string[] = FUNNEL_MULTI_KPI_CHOICES.map((o) => o.id)

/** Title uses dimensions only; KPI/metric picks are not listed in the heading. */
function buildFunnelProjectionHeaderFromMultiSelect(selectedIds: string[]): string {
  const base = 'Disbursal funnel projection'
  const fy = 'FY 2025–26'
  const dimLabels = FUNNEL_MULTI_DIMENSION_CHOICES.filter((o) => selectedIds.includes(o.id)).map((o) => o.label)
  if (dimLabels.length === 0) return `${base} – ${fy}`
  return `${base} – ${dimLabels.join(', ')} – ${fy}`
}

/** Row-major data for disbursal funnel projection (13 rows); columns built in FUNNEL_TABLE_COLUMN_DEFS */
const FUNNEL_TABLE_ROW_DATA: string[][] = [
  ['M1 (Aug-25)', '500 K', '10.00%', '50 K', '11,500', '0.6 Bn', '90.50%', '91.50%', '90.00%'],
  ['M2 (Sep-25)', '500 K', '15.00%', '75 K', '11,500', '0.9 Bn', '90.50%', '91.50%', '90.00%'],
  ['M3 (Oct-25)', '1.0 Mn', '20.00%', '201 K', '11,500', '2.3 Bn', '90.50%', '91.50%', '90.00%'],
  ['M4 (Nov-25)', '1.0 Mn', '20.20%', '204 K', '11,750', '2.4 Bn', '90.50%', '91.50%', '90.00%'],
  ['M5 (Dec-25)', '2.0 Mn', '20.40%', '418 K', '12,750', '5.3 Bn', '90.50%', '91.50%', '90.00%'],
  ['M6 (Jan-25)', '2.1 Mn', '20.60%', '426 K', '12,679', '5.4 Bn', '90.50%', '91.50%', '90.00%'],
  ['M7 (Feb-25)', '2.1 Mn', '20.80%', '439 K', '13,178', '5.8 Bn', '90.50%', '91.50%', '90.00%'],
  ['M8 (Mar-25)', '2.2 Mn', '21.00%', '452 K', '13,978', '6.3 Bn', '90.50%', '91.50%', '90.00%'],
  ['M9 (Apr-25)', '2.2 Mn', '21.20%', '466 K', '15,417', '7.1 Bn', '90.50%', '91.50%', '90.00%'],
  ['M10 (May-25)', '2.2 Mn', '21.40%', '480 K', '16,091', '7.7 Bn', '90.50%', '91.50%', '90.00%'],
  ['M11 (Jun-25)', '2.3 Mn', '21.70%', '495 K', '16,481', '8.0 Bn', '90.50%', '91.50%', '90.00%'],
  ['M12 (Jul-25)', '2.3 Mn', '21.90%', '510 K', '16,991', '8.4 Bn', '90.50%', '91.50%', '90.00%'],
  ['FY 2025–26', '-', '-', '-', '-', '59.6 Bn', '90.50%', '91.50%', '90.00%'],
]

const FUNNEL_BASE_COLUMN_META: { id: string; label: string }[] = [
  { id: 'month', label: 'Disbursal Month' },
  { id: 'eligible', label: 'Eligible Base (split 50% across 7-day & 14-day)' },
  { id: 'uptake', label: 'Cx Uptake' },
  { id: 'borrowers', label: '# of borrowers (7-day & 14-day combined)' },
  { id: 'ats', label: 'Average Ticket Size (TSH)' },
  { id: 'disbursals', label: 'Disbursals (TSH) – combined' },
  { id: 'principal-overall', label: 'Principal Repayment (Maturity) – Overall' },
  { id: 'principal-7', label: 'Principal Repayment (Maturity) – 7-day' },
  { id: 'principal-14', label: 'Principal Repayment (Maturity) – 14-day' },
]

const FUNNEL_TABLE_COLUMN_DEFS: { id: string; label: string; optional?: boolean; cells: string[] }[] = [
  ...FUNNEL_BASE_COLUMN_META.map((meta, colIdx) => ({
    ...meta,
    cells: FUNNEL_TABLE_ROW_DATA.map((row) => row[colIdx]),
  })),
  {
    id: 'gross-yield',
    label: 'Gross yield %',
    optional: true,
    cells: [
      '12.40%',
      '12.45%',
      '12.52%',
      '12.55%',
      '12.60%',
      '12.62%',
      '12.65%',
      '12.70%',
      '12.75%',
      '12.78%',
      '12.82%',
      '12.85%',
      '12.80%',
    ],
  },
  {
    id: 'interest-accrued',
    label: 'Interest accrued (TSH)',
    optional: true,
    cells: [
      '4.2 Mn',
      '6.4 Mn',
      '15.8 Mn',
      '16.5 Mn',
      '36.2 Mn',
      '37.1 Mn',
      '39.8 Mn',
      '43.2 Mn',
      '48.6 Mn',
      '52.4 Mn',
      '54.8 Mn',
      '57.2 Mn',
      '214.0 Mn',
    ],
  },
]

const FUNNEL_DEFAULT_VISIBLE_COLUMN_IDS = FUNNEL_TABLE_COLUMN_DEFS.filter((c) => !c.optional).map((c) => c.id)

const FUNNEL_FY_ROW_BOLD_COLS = new Set([
  'month',
  'disbursals',
  'principal-overall',
  'principal-7',
  'principal-14',
  'gross-yield',
  'interest-accrued',
])

/** Shared: Option 2 & 3 repayment product-variant tables + click to open side panel */
function RepaymentProductWiseVariantTables({ onOpenVariant }: { onOpenVariant: (variant: string) => void }) {
  return (
    <>
      <h3 className={styles.sectionTitle} style={{ marginTop: '1.25rem', fontSize: '1rem' }}>
        Product-wise metrics
      </h3>
      <p className={styles.productVariantHint}>
        Click a <strong>product variant</strong> in the first column to open collection + risk variant-wise reports in a
        side panel.
      </p>
      <div className={styles.tableSection}>
        <table className={styles.table} aria-label="Repayment product-wise KPIs by variant">
          <thead>
            <tr>
              <th scope="col">Product variant</th>
              <th scope="col">Collection</th>
              <th scope="col">Default rate</th>
              <th scope="col">Write-off loans</th>
              <th scope="col">Closed loans</th>
              <th scope="col">Open loans</th>
              <th scope="col">Amount to be collected</th>
            </tr>
          </thead>
          <tbody>
            {REPAYMENT_OVERVIEW_PRODUCT_KPI_ROWS.map((row) => (
              <tr key={row.variant}>
                <td>
                  {isRepaymentVariantProductLabel(row.variant) ? (
                    <button
                      type="button"
                      className={styles.productVariantCellBtn}
                      onClick={() => onOpenVariant(row.variant)}
                    >
                      {row.variant}
                    </button>
                  ) : (
                    row.variant
                  )}
                </td>
                <td>{row.collection}</td>
                <td>{row.defaultRate}</td>
                <td>{row.writeOffLoans.toLocaleString()}</td>
                <td>{row.closedLoans.toLocaleString()}</td>
                <td>{row.openLoans.toLocaleString()}</td>
                <td>{row.amountToBeCollected}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className={styles.sectionTitle} style={{ marginTop: '1.5rem', fontSize: '1rem' }}>
        Loan status &amp; due buckets by product
      </h3>
      <p className={styles.productVariantHint}>
        Open / closed loan counts and overdue buckets (no dues through &gt;4 dues). Click variant to open the same side
        panel with full collection and risk reports.
      </p>
      <div className={styles.tableSection}>
        <table className={styles.table} aria-label="Loan status and due bands by product variant">
          <thead>
            <tr>
              <th scope="col">Product variant</th>
              <th scope="col">Open loans</th>
              <th scope="col">Closed loans</th>
              <th scope="col">No dues</th>
              <th scope="col">1 due</th>
              <th scope="col">2–4 dues</th>
              <th scope="col">More than 4 dues</th>
            </tr>
          </thead>
          <tbody>
            {REPAYMENT_OVERVIEW_DUE_STATUS_ROWS.map((row) => (
              <tr key={row.variant}>
                <td>
                  {isRepaymentVariantProductLabel(row.variant) ? (
                    <button
                      type="button"
                      className={styles.productVariantCellBtn}
                      onClick={() => onOpenVariant(row.variant)}
                    >
                      {row.variant}
                    </button>
                  ) : (
                    row.variant
                  )}
                </td>
                <td>{row.openLoans.toLocaleString()}</td>
                <td>{row.closedLoans.toLocaleString()}</td>
                <td>{row.noDues.toLocaleString()}</td>
                <td>{row.oneDue.toLocaleString()}</td>
                <td>{row.twoToFourDues.toLocaleString()}</td>
                <td>{row.moreThanFourDues.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/** Option 2 & 3: Business Health — layered KPIs, funnel projection + dimensions & metrics multi-select (between title and table); never shows “NPA %” in the initial layer. */
function BusinessHealthOption23BusinessHealthView() {
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
  /** Dimensions + KPI/metrics; drives table columns (KPI ids) and title (dims + KPIs). Option 2 & 3 only. */
  const [funnelMultiSelection, setFunnelMultiSelection] = useState<string[]>(() => [...FUNNEL_MULTI_DEFAULT_SELECTION])
  const [funnelMultiDropdownOpen, setFunnelMultiDropdownOpen] = useState(false)
  const funnelMultiDropdownRef = useRef<HTMLDivElement>(null)
  const [disbursementVariantPanelProduct, setDisbursementVariantPanelProduct] = useState<string | null>(null)
  const [repaymentVariantPanelProduct, setRepaymentVariantPanelProduct] = useState<string | null>(null)

  useEffect(() => {
    if (!funnelMultiDropdownOpen) return
    const onDoc = (e: MouseEvent) => {
      if (funnelMultiDropdownRef.current?.contains(e.target as Node)) return
      setFunnelMultiDropdownOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [funnelMultiDropdownOpen])

  const funnelMultiSummary = useMemo(() => {
    const labels = [
      ...FUNNEL_MULTI_DIMENSION_CHOICES.filter((o) => funnelMultiSelection.includes(o.id)).map((o) => o.label),
      ...FUNNEL_MULTI_KPI_CHOICES.filter((o) => funnelMultiSelection.includes(o.id)).map((o) => o.label),
    ]
    if (labels.length === 0) return 'Choose dimensions & metrics…'
    if (labels.length <= 2) return labels.join(', ')
    return `${labels.slice(0, 2).join(', ')} +${labels.length - 2} more`
  }, [funnelMultiSelection])

  const toggleFunnelMultiId = (id: string) => {
    setFunnelMultiSelection((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const funnelColById = useMemo(() => {
    return Object.fromEntries(FUNNEL_TABLE_COLUMN_DEFS.map((c) => [c.id, c])) as Record<
      string,
      (typeof FUNNEL_TABLE_COLUMN_DEFS)[number]
    >
  }, [])

  const funnelVisibleColumnOrder = useMemo(() => {
    const kpiIds = FUNNEL_TABLE_COLUMN_DEFS.map((c) => c.id).filter((id) => id !== 'month')
    const picked = kpiIds.filter((id) => funnelMultiSelection.includes(id))
    if (picked.length === 0) return [...FUNNEL_DEFAULT_VISIBLE_COLUMN_IDS]
    return ['month', ...picked]
  }, [funnelMultiSelection])

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
  const writeOffReport = getReportsBySubSegment('repayment', 'risk-analysis').find((r: AnyReport) => r.id === 'write-off-analysis')

  const widgets = performersReport?.performanceWidgets ?? []

  const funnelProjectionHeader = buildFunnelProjectionHeaderFromMultiSelect(funnelMultiSelection)

  const firstLayerCards = buildOption23BusinessHealthFirstLayer(businessHealthReport, lendingRatiosReport)

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
                {firstLayerCards.map((item, i) => (
                  <MetricCard
                    key={`kpi23-${i}-${item.metric.label}`}
                    metric={{
                      ...item.metric,
                      target: item.target,
                    }}
                    report={item.report}
                  />
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
                  <div className={styles.kpiOption3ColHeading}>Transaction level</div>
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

            {/* Disbursal funnel projection table (static example, following the provided sheet) */}
            <div className={styles.funnelProjectionBox}>
              <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                {funnelProjectionHeader}
              </h3>

              {/* Compact dropdown row (like original single-select); panel uses checkboxes for multi-select */}
              <div
                ref={funnelMultiDropdownRef}
                className={`${styles.funnelDimensionRow} ${styles.funnelDimensionRowBeforeTable}`}
              >
                <span className={styles.funnelDimensionLabel} id="funnel-multi-label">
                  Dimensions &amp; metrics
                </span>
                <div className={styles.funnelMultiDropdown}>
                  <button
                    type="button"
                    className={styles.funnelMultiDropdownTrigger}
                    aria-expanded={funnelMultiDropdownOpen}
                    aria-haspopup="listbox"
                    aria-labelledby="funnel-multi-label"
                    onClick={() => setFunnelMultiDropdownOpen((o) => !o)}
                  >
                    <span className={styles.funnelMultiDropdownTriggerText}>{funnelMultiSummary}</span>
                    <span className={styles.funnelMultiDropdownChevron} aria-hidden>
                      ▾
                    </span>
                  </button>
                  {funnelMultiDropdownOpen ? (
                    <div className={styles.funnelMultiDropdownPanel} role="listbox" aria-multiselectable>
                      <div className={styles.funnelMultiDropdownGroupLabel}>Dimensions</div>
                      {FUNNEL_MULTI_DIMENSION_CHOICES.map((opt) => {
                        const on = funnelMultiSelection.includes(opt.id)
                        return (
                          <label
                            key={opt.id}
                            className={`${styles.funnelMultiDropdownItem} ${on ? styles.funnelMultiDropdownItemSelected : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => toggleFunnelMultiId(opt.id)}
                            />
                            <span>{opt.label}</span>
                          </label>
                        )
                      })}
                      <div className={styles.funnelMultiDropdownGroupLabel}>Metrics (table columns)</div>
                      {FUNNEL_MULTI_KPI_CHOICES.map((opt) => {
                        const on = funnelMultiSelection.includes(opt.id)
                        return (
                          <label
                            key={opt.id}
                            className={`${styles.funnelMultiDropdownItem} ${on ? styles.funnelMultiDropdownItemSelected : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => toggleFunnelMultiId(opt.id)}
                            />
                            <span>{opt.label}</span>
                          </label>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className={styles.tableSection}>
                <table className={styles.table} aria-label="Disbursal funnel projection">
                  <thead>
                    <tr>
                      {funnelVisibleColumnOrder.map((colId) => (
                        <th key={colId}>{funnelColById[colId]?.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FUNNEL_TABLE_ROW_DATA.map((_, rowIdx) => (
                      <tr key={rowIdx}>
                        {funnelVisibleColumnOrder.map((colId) => {
                          const def = funnelColById[colId]
                          const cell = def?.cells[rowIdx] ?? '–'
                          const bold = rowIdx === 12 && FUNNEL_FY_ROW_BOLD_COLS.has(colId)
                          return <td key={colId}>{bold ? <strong>{cell}</strong> : cell}</td>
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <p className={styles.productVariantHint}>
                Click <strong>3 Month</strong>, <strong>6 Month</strong>, or <strong>9 Month</strong> to open variant-wise
                reports (trend, month-year, store, dimensions) in a side panel.
              </p>
              <div className={styles.tableSection}>
                <table className={styles.table}>
                  <thead>
                    <tr>{disbursementMetrics.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {disbursementMetrics.table.rows.map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td key={j}>
                            {j === 0 && isDisbursementVariantProductLabel(cell) ? (
                              <button
                                type="button"
                                className={styles.productVariantCellBtn}
                                onClick={() => setDisbursementVariantPanelProduct(cell)}
                              >
                                {String(cell)}
                              </button>
                            ) : typeof cell === 'number' ? (
                              formatCell(cell)
                            ) : (
                              String(cell)
                            )}
                          </td>
                        ))}
                      </tr>
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

          <RepaymentProductWiseVariantTables onOpenVariant={setRepaymentVariantPanelProduct} />

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
      <DisbursementProductVariantPanel
        productType={disbursementVariantPanelProduct}
        onClose={() => setDisbursementVariantPanelProduct(null)}
      />
      <RepaymentProductVariantPanel
        productType={repaymentVariantPanelProduct}
        onClose={() => setRepaymentVariantPanelProduct(null)}
      />
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
  const portalOption = useContext(PortalOptionContext)
  const showDisbursementVariantPanel = portalOption === 2 || portalOption === 3
  const [disbursementVariantPanelProduct, setDisbursementVariantPanelProduct] = useState<string | null>(null)

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
          {showDisbursementVariantPanel ? (
            <p className={styles.productVariantHint}>
              Click <strong>3 Month</strong>, <strong>6 Month</strong>, or <strong>9 Month</strong> in the first column to
              open variant-wise reports in a side panel.
            </p>
          ) : null}
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
                          {showDisbursementVariantPanel &&
                          j === 0 &&
                          isDisbursementVariantProductLabel(cell) ? (
                            <button
                              type="button"
                              className={styles.productVariantCellBtn}
                              onClick={() => setDisbursementVariantPanelProduct(cell)}
                            >
                              {String(cell)}
                            </button>
                          ) : typeof cell === 'number' ? (
                            cell >= 1000000 ? (
                              `$${(cell / 1000000).toFixed(1)}M`
                            ) : cell >= 1000 ? (
                              cell.toLocaleString()
                            ) : (
                              cell
                            )
                          ) : (
                            String(cell)
                          )}
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
      {showDisbursementVariantPanel ? (
        <DisbursementProductVariantPanel
          productType={disbursementVariantPanelProduct}
          onClose={() => setDisbursementVariantPanelProduct(null)}
        />
      ) : null}
    </div>
  )
}

function RepaymentOverviewView({ reports }: { reports: AnyReport[] }) {
  const portalOption = useContext(PortalOptionContext)
  const option23RepaymentTables = portalOption === 2 || portalOption === 3
  const [repaymentVariantPanelProduct, setRepaymentVariantPanelProduct] = useState<string | null>(null)

  const repaymentMetrics = reports.find((r) => r.id === 'repayment-metrics')
  const collectionMetrics = reports.find((r) => r.id === 'collection-metrics')
  const npaOverview = reports.find((r) => r.id === 'npa-overview')
  const byStatus = reports.find((r) => r.id === 'repayment-by-status')
  const byDueBands = reports.find((r) => r.id === 'repayment-by-due-bands')

  // Get product-wise reports from repayment segment (Option 1 only — Option 2/3 use tabular variant view)
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
          {option23RepaymentTables ? (
            <>
              <p className={styles.productVariantHint} style={{ marginTop: 0 }}>
                <strong>Option {portalOption}</strong> — tabular variant view. Click <strong>3 / 6 / 9 Month</strong> to open
                the collection + risk side panel.
              </p>
              <RepaymentProductWiseVariantTables onOpenVariant={setRepaymentVariantPanelProduct} />
            </>
          ) : (
            <>
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
            </>
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
      {option23RepaymentTables ? (
        <RepaymentProductVariantPanel
          productType={repaymentVariantPanelProduct}
          onClose={() => setRepaymentVariantPanelProduct(null)}
        />
      ) : null}
    </div>
  )
}
