import { useContext, useState } from 'react'
import { getReportById } from '../data/reports-new'
import { PortalOptionContext } from '../App'
import styles from './PinnedReports.module.css'

const PINNED_REPORT_IDS = [
  'business-health-metrics',
  'lending-ratios',
  'highest-lowest-performers',
  'disbursement-metrics',
  'repayment-metrics',
  'npa-overview',
]

type PinnedSection = { id: string; name: string; reportIds: string[] }

const DEFAULT_SECTIONS: PinnedSection[] = [
  { id: 'sec1', name: 'Key metrics', reportIds: ['business-health-metrics', 'lending-ratios', 'highest-lowest-performers'] },
  { id: 'sec2', name: 'Disbursement & repayment', reportIds: ['disbursement-metrics', 'repayment-metrics', 'npa-overview'] },
]

export function PinnedReports() {
  const portalOption = useContext(PortalOptionContext)
  const isOption1 = portalOption === 1

  const [sections, setSections] = useState<PinnedSection[]>(() => DEFAULT_SECTIONS)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set(DEFAULT_SECTIONS.map((s) => s.id)))
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const toggleSection = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const startEdit = (section: PinnedSection) => {
    setEditingId(section.id)
    setEditValue(section.name)
  }

  const saveEdit = () => {
    if (editingId && editValue.trim()) {
      setSections((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, name: editValue.trim() } : s))
      )
    }
    setEditingId(null)
    setEditValue('')
  }

  const handleNameKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === 'Enter') saveEdit()
    if (e.key === 'Escape') {
      setEditingId(null)
      setEditValue('')
    }
  }

  const pinnedReports = PINNED_REPORT_IDS.map((id) => getReportById(id)).filter(Boolean)

  if (isOption1) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Pinned reports</h1>
          <p className={styles.subtitle}>
            Quick access to frequently used reports. Expand or collapse sections; click a section name to edit it.
          </p>
        </header>

        <div className={styles.sections}>
          {sections.map((section) => {
            const isExpanded = expandedIds.has(section.id)
            const isEditing = editingId === section.id
            const reports = section.reportIds
              .map((id) => getReportById(id))
              .filter(Boolean)

            return (
              <div key={section.id} className={styles.section}>
                <button
                  type="button"
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={isExpanded}
                >
                  <span className={styles.sectionArrow} aria-hidden>
                    {isExpanded ? '▼' : '▶'}
                  </span>
                  {isEditing ? (
                    <input
                      className={styles.sectionNameInput}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => handleNameKeyDown(e, section.id)}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      aria-label="Section name"
                    />
                  ) : (
                    <span
                      className={styles.sectionName}
                      onClick={(e) => {
                        e.stopPropagation()
                        startEdit(section)
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          startEdit(section)
                        }
                      }}
                    >
                      {section.name}
                    </span>
                  )}
                </button>
                {isExpanded && (
                  <div className={styles.sectionBody}>
                    <div className={styles.grid}>
                      {reports.map((report) => (
                        <div key={report!.id} className={styles.card}>
                          <h2 className={styles.cardTitle}>{report!.title}</h2>
                          {report!.metrics && report!.metrics.length > 0 && (
                            <div className={styles.cardMetrics}>
                              {report!.metrics.slice(0, 4).map((m, i) => (
                                <div key={i} className={styles.metric}>
                                  <span className={styles.metricLabel}>{m.label}</span>
                                  <span className={styles.metricValue}>{m.value}</span>
                                  {m.change != null && (
                                    <span className={styles.metricChange} data-trend={m.trend}>{m.change}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <p className={styles.cardDesc}>{report!.description}</p>
                          <span className={styles.cardMeta}>
                            Segment: {report!.segmentId} / {report!.subSegmentId}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  /* Option 2: flat grid with numeric metrics on each card */
  if (portalOption === 2) {
    return (
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Pinned reports</h1>
          <p className={styles.subtitle}>
            Quick access to frequently used reports. In a full implementation, these would be specific to each user.
          </p>
        </header>

        <div className={styles.grid}>
          {pinnedReports.map((report) => (
            <div key={report!.id} className={styles.card}>
              <h2 className={styles.cardTitle}>{report!.title}</h2>
              {report!.metrics && report!.metrics.length > 0 && (
                <div className={styles.cardMetrics}>
                  {report!.metrics.slice(0, 4).map((m, i) => (
                    <div key={i} className={styles.metric}>
                      <span className={styles.metricLabel}>{m.label}</span>
                      <span className={styles.metricValue}>{m.value}</span>
                      {m.change != null && (
                        <span className={styles.metricChange} data-trend={m.trend}>{m.change}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className={styles.cardDesc}>{report!.description}</p>
              <span className={styles.cardMeta}>
                Segment: {report!.segmentId} / {report!.subSegmentId}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* Option 3: simple cards (no metrics) */
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pinned reports</h1>
        <p className={styles.subtitle}>
          Quick access to frequently used reports. In a full implementation, these would be specific to each user.
        </p>
      </header>

      <div className={styles.grid}>
        {pinnedReports.map((report) => (
          <div key={report!.id} className={styles.card}>
            <h2 className={styles.cardTitle}>{report!.title}</h2>
            <p className={styles.cardDesc}>{report!.description}</p>
            <span className={styles.cardMeta}>
              Segment: {report!.segmentId} / {report!.subSegmentId}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

