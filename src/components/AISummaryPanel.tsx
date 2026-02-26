import { useState, useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { PortalOptionContext } from '../App'
import type { Report } from '../data/reports-new'
import styles from './AISummaryPanel.module.css'

type ReportLike = Pick<Report, 'id' | 'title' | 'description'> & {
  metrics?: { label: string; value: string; change?: string; trend?: 'up' | 'down' }[]
}

function getAISummary(report: ReportLike): { summary: string; positives: string[]; negatives: string[] } {
  const summary = report.description || `${report.title} – key metrics and trends.`
  const positives: string[] = []
  const negatives: string[] = []
  if (report.metrics?.length) {
    for (const m of report.metrics) {
      const line = `${m.label}: ${m.value}${m.change != null ? ` (${m.change})` : ''}`
      if (m.trend === 'up') positives.push(line)
      else if (m.trend === 'down') negatives.push(line)
    }
  }
  if (positives.length === 0 && report.description) {
    positives.push('Report provides structured view of key metrics.')
  }
  if (negatives.length === 0 && (report.metrics?.length ?? 0) > 0) {
    negatives.push('Review segments with lower contribution for improvement opportunities.')
  }
  return { summary, positives, negatives }
}

interface AISummaryPanelProps {
  report: ReportLike
}

export function AISummaryPanel({ report }: AISummaryPanelProps) {
  const portalOption = useContext(PortalOptionContext)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [open])

  if (portalOption !== 1) return null

  const { summary, positives, negatives } = getAISummary(report)

  const panel = (
    <div className={styles.overlay} role="dialog" aria-label="AI Summary" onClick={() => setOpen(false)}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>AI Summary</h2>
          <button
            type="button"
            className={styles.panelClose}
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            &#215;
          </button>
        </div>
        <h3 className={styles.reportTitle}>{report.title}</h3>
        <p className={styles.summaryText}>{summary}</p>
        {positives.length > 0 && (
          <div className={styles.block}>
            <h4 className={styles.positiveHeading}>Positive</h4>
            <ul className={styles.list}>
              {positives.map((p, i) => (
                <li key={i} className={styles.positiveItem}>{p}</li>
              ))}
            </ul>
          </div>
        )}
        {negatives.length > 0 && (
          <div className={styles.block}>
            <h4 className={styles.negativeHeading}>Negative / Watch</h4>
            <ul className={styles.list}>
              {negatives.map((n, i) => (
                <li key={i} className={styles.negativeItem}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <span className={styles.iconWrap}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setOpen(true)}
          aria-label="View AI summary"
          title="AI summary"
        >
          &#9734;
        </button>
      </span>
      {open && createPortal(panel, document.body)}
    </>
  )
}
