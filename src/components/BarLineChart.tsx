import type { BarLinePoint } from '../data/productWiseReportData'
import styles from './BarLineChart.module.css'

interface BarLineChartProps {
  data: BarLinePoint[]
  /** Label for bar (e.g. "Loan count") */
  barLabel: string
  /** Label for line (e.g. "Loan amount (₹ L)") */
  lineLabel: string
  /** Format amount for display (e.g. to Lakhs) */
  formatAmount?: (n: number) => string
}

export function BarLineChart({ data, barLabel, lineLabel, formatAmount = (n) => `₹${(n / 100000).toFixed(1)} L` }: BarLineChartProps) {
  if (!data.length) return null

  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const maxAmount = Math.max(...data.map((d) => d.amount), 1)

  const points = data
    .map((d, i) => {
      const x = (i + 0.5) * (100 / data.length)
      const y = 100 - (d.amount / maxAmount) * 100
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className={styles.wrapper}>
      <div className={styles.legend}>
        <span className={styles.legendBar}>{barLabel}</span>
        <span className={styles.legendLine}>{lineLabel}</span>
      </div>
      <div className={styles.chartArea}>
        <div className={styles.bars}>
          {data.map((d) => (
            <div key={d.monthYear} className={styles.barGroup}>
              <div
                className={styles.bar}
                style={{ height: `${(d.count / maxCount) * 100}%` }}
                title={`${d.monthYear}: ${d.count}`}
              />
            </div>
          ))}
        </div>
        <svg className={styles.lineChart} viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline className={styles.line} points={points} />
          {data.map((d, i) => {
            const x = (i + 0.5) * (100 / data.length)
            const y = 100 - (d.amount / maxAmount) * 100
            return <circle key={d.monthYear} className={styles.linePoint} cx={x} cy={y} r="2" />
          })}
        </svg>
      </div>
      <div className={styles.xAxis}>
        {data.map((d) => (
          <span key={d.monthYear} className={styles.tick}>
            {d.monthYear}
          </span>
        ))}
      </div>
      <div className={styles.yAxisLabels}>
        <span>Count: 0</span>
        <span>Count: {maxCount}</span>
      </div>
      <div className={styles.yAxisLabelsRight}>
        <span>{formatAmount(0)}</span>
        <span>{formatAmount(maxAmount)}</span>
      </div>
    </div>
  )
}
