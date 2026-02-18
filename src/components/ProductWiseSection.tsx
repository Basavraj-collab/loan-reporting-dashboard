import { useState, useMemo, useRef, useEffect } from 'react'
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
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(() => [...dimensionHeaders])
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(() => [...metricHeaders])
  const [dimDropdownOpen, setDimDropdownOpen] = useState(false)
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false)
  const dropdownsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownsRef.current && !dropdownsRef.current.contains(e.target as Node)) {
        setDimDropdownOpen(false)
        setMetricDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const visibleHeaders = useMemo(
    () => [...selectedDimensions, ...selectedMetrics],
    [selectedDimensions, selectedMetrics]
  )

  const toggleDimension = (dim: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    )
  }
  const toggleMetric = (met: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(met) ? prev.filter((m) => m !== met) : [...prev, met]
    )
  }
  const selectAllDimensions = () => setSelectedDimensions([...dimensionHeaders])
  const deselectAllDimensions = () => setSelectedDimensions([])
  const selectAllMetrics = () => setSelectedMetrics([...metricHeaders])
  const deselectAllMetrics = () => setSelectedMetrics([])

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
                  {data.monthYearTable.headers.map((key) => {
                    const cellKey = key === 'Month-Year' ? 'monthYear' : key
                    const val = row[cellKey]
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

      {/* 4. Dimension × metrics table with dropdown filters */}
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>By dimensions & metrics</h3>
        <div className={styles.dimMetricDropdowns} ref={dropdownsRef}>
          <div className={styles.dropdownWrap}>
            <button
              type="button"
              className={styles.dropdownTrigger}
              onClick={(e) => { e.stopPropagation(); setDimDropdownOpen((o) => !o); setMetricDropdownOpen(false) }}
              aria-expanded={dimDropdownOpen}
            >
              Dimensions ({selectedDimensions.length}) ▼
            </button>
            {dimDropdownOpen && (
              <div className={styles.dropdownPanel} role="listbox">
                <div className={styles.dropdownActions}>
                  <button type="button" className={styles.dropdownActionBtn} onClick={selectAllDimensions}>Select all</button>
                  <button type="button" className={styles.dropdownActionBtn} onClick={deselectAllDimensions}>Deselect all</button>
                </div>
                {dimensionHeaders.map((dim) => (
                  <label key={dim} className={styles.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={selectedDimensions.includes(dim)}
                      onChange={() => toggleDimension(dim)}
                    />
                    <span>{dim}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className={styles.dropdownWrap}>
            <button
              type="button"
              className={styles.dropdownTrigger}
              onClick={(e) => { e.stopPropagation(); setMetricDropdownOpen((o) => !o); setDimDropdownOpen(false) }}
              aria-expanded={metricDropdownOpen}
            >
              Metrics ({selectedMetrics.length}) ▼
            </button>
            {metricDropdownOpen && (
              <div className={styles.dropdownPanel} role="listbox">
                <div className={styles.dropdownActions}>
                  <button type="button" className={styles.dropdownActionBtn} onClick={selectAllMetrics}>Select all</button>
                  <button type="button" className={styles.dropdownActionBtn} onClick={deselectAllMetrics}>Deselect all</button>
                </div>
                {metricHeaders.map((met) => (
                  <label key={met} className={styles.dropdownOption}>
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(met)}
                      onChange={() => toggleMetric(met)}
                    />
                    <span>{met}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        {visibleHeaders.length === 0 ? (
          <p className={styles.hint}>Select at least one dimension or metric above to show the table.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {visibleHeaders.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {visibleHeaders.map((key) => (
                      <td key={key}>
                        {typeof row[key] === 'number' ? (row[key] as number).toLocaleString() : String(row[key] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
