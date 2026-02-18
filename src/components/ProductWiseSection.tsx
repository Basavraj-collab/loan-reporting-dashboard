import { BarLineChart } from './BarLineChart'
import type { ProductWiseSectionData } from '../data/productWiseReportData'
import styles from './ProductWiseSection.module.css'

export type SectionVariant = 'disbursement' | 'collection' | 'risk'

const BAR_LABEL: Record<SectionVariant, string> = {
  disbursement: 'Loan count',
  collection: 'Collection count',
  risk: 'NPA count',
}

const LINE_LABEL: Record<SectionVariant, string> = {
  disbursement: 'Loan amount (₹ L)',
  collection: 'Collection amount (₹ L)',
  risk: 'NPA amount (₹ L)',
}

function formatAmountDisbursement(n: number): string {
  return `₹${(n / 100000).toFixed(1)} L`
}
function formatAmountRisk(n: number): string {
  if (n >= 1000000) return `₹${(n / 1000000).toFixed(2)} M`
  return `₹${(n / 100000).toFixed(2)} L`
}

export function ProductWiseSection({
  data,
  variant,
}: {
  data: ProductWiseSectionData
  variant: SectionVariant
}) {
  const formatAmount = variant === 'risk' ? formatAmountRisk : formatAmountDisbursement
  const { dimensionHeaders, metricHeaders, rows } = data.dimensionMetrics
  const allHeaders = [...dimensionHeaders, ...metricHeaders]

  return (
    <section className={styles.section}>
      <h2 className={styles.productTitle}>{data.productType}</h2>

      {/* 1. Bar + Line chart: month-year vs count (bar) and amount (line) */}
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>Trend: count & amount over time</h3>
        <BarLineChart
          data={data.barLineData}
          barLabel={BAR_LABEL[variant]}
          lineLabel={LINE_LABEL[variant]}
          formatAmount={formatAmount}
        />
      </div>

      {/* 2. Table by month-year with metrics */}
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>By month-year</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {data.monthYearTable.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.monthYearTable.rows.map((row, i) => (
                <tr key={i}>
                  {data.monthYearTable.headers.map((key) => (
                    <td key={key}>
                      {typeof row[key] === 'number' ? (row[key] as number).toLocaleString() : String(row[key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Table by store with same metrics */}
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>By store</h3>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {data.storeTable.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.storeTable.rows.map((row, i) => (
                <tr key={i}>
                  {data.storeTable.headers.map((key) => {
                    const cellKey = key === 'Store' ? 'storeName' : key
                    const val = cellKey === 'storeName' ? row.storeName : row[key]
                    return (
                      <td key={key}>
                        {typeof val === 'number' ? (val as number).toLocaleString() : String(val ?? '')}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Dimension × metrics table */}
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>By dimensions & metrics</h3>
        <p className={styles.hint}>
          Dimensions: {dimensionHeaders.join(', ')}. Metrics: {metricHeaders.join(', ')}.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {allHeaders.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {allHeaders.map((key) => (
                    <td key={key}>
                      {typeof row[key] === 'number' ? (row[key] as number).toLocaleString() : String(row[key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
