import { useState, useRef, useEffect } from 'react'
import styles from './DateRangeSelector.module.css'

export const PERIOD_OPTIONS = [
  'Last week',
  'This month',
  'This quarter',
  'Last quarter',
  'This year to date',
  'Last year',
  'Custom period',
] as const

export const COMPARE_OPTIONS = ['Last month', 'Quarter', 'Custom period'] as const

export type PeriodOption = (typeof PERIOD_OPTIONS)[number]
export type CompareOption = (typeof COMPARE_OPTIONS)[number]

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function getDefaultRange(period: PeriodOption): { start: string; end: string } {
  const now = new Date()
  const end = new Date(now)
  let start = new Date(now)
  switch (period) {
    case 'Last week':
      start.setDate(now.getDate() - 7)
      break
    case 'This month':
      start.setDate(1)
      break
    case 'This quarter':
      start.setMonth(Math.floor(now.getMonth() / 3) * 3, 1)
      break
    case 'Last quarter':
      const q = Math.floor(now.getMonth() / 3)
      start.setMonth((q === 0 ? 3 : q) * 3 - 3, 1)
      end.setMonth(q * 3, 0)
      break
    case 'This year to date':
      start.setMonth(0, 1)
      break
    case 'Last year':
      start.setFullYear(now.getFullYear() - 1)
      start.setMonth(0, 1)
      end.setFullYear(now.getFullYear() - 1)
      end.setMonth(11, 31)
      break
    default:
      start.setMonth(now.getMonth() - 1)
  }
  return { start: toDateStr(start), end: toDateStr(end) }
}

export function DateRangeSelector() {
  const [period, setPeriod] = useState<PeriodOption>('This month')
  const [compareEnabled, setCompareEnabled] = useState(false)
  const [comparePeriod, setComparePeriod] = useState<CompareOption>('Last month')
  const [customStart, setCustomStart] = useState(toDateStr(new Date()))
  const [customEnd, setCustomEnd] = useState(toDateStr(new Date()))
  const [compareCustomStart, setCompareCustomStart] = useState(toDateStr(new Date()))
  const [compareCustomEnd, setCompareCustomEnd] = useState(toDateStr(new Date()))
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const displayLabel = period === 'Custom period' ? `${customStart} – ${customEnd}` : period

  return (
    <div className={styles.wrapper} ref={panelRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className={styles.triggerIcon}>📅</span>
        <span className={styles.triggerLabel}>{displayLabel}</span>
        <span className={styles.triggerCaret}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className={styles.panel} role="dialog" aria-label="Select date range">
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Period</span>
            <div className={styles.periodList}>
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={period === opt ? styles.periodBtnActive : styles.periodBtn}
                  onClick={() => {
                    setPeriod(opt)
                    if (opt !== 'Custom period') setOpen(false)
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            {period === 'Custom period' && (
              <div className={styles.customRange}>
                <label className={styles.dateLabel}>
                  From
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className={styles.dateInput}
                  />
                </label>
                <label className={styles.dateLabel}>
                  To
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className={styles.dateInput}
                  />
                </label>
              </div>
            )}
          </div>

          <div className={styles.divider} />

          <div className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={compareEnabled}
                onChange={(e) => setCompareEnabled(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Compare to period</span>
            </label>
            {compareEnabled && (
              <>
                <div className={styles.compareSelectWrap}>
                  <select
                    className={styles.select}
                    value={comparePeriod}
                    onChange={(e) => setComparePeriod(e.target.value as CompareOption)}
                  >
                    {COMPARE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                {comparePeriod === 'Custom period' && (
                  <div className={styles.customRange}>
                    <label className={styles.dateLabel}>
                      From
                      <input
                        type="date"
                        value={compareCustomStart}
                        onChange={(e) => setCompareCustomStart(e.target.value)}
                        className={styles.dateInput}
                      />
                    </label>
                    <label className={styles.dateLabel}>
                      To
                      <input
                        type="date"
                        value={compareCustomEnd}
                        onChange={(e) => setCompareCustomEnd(e.target.value)}
                        className={styles.dateInput}
                      />
                    </label>
                  </div>
                )}
              </>
            )}
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.applyBtn} onClick={() => setOpen(false)}>
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
