import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTopicGroups, type TopicGroup } from '../data/reportDiscovery'
import styles from './ReportHub.module.css'

interface TopicReportsFlyoutProps {
  topic: TopicGroup
  onClose: () => void
}

function TopicReportsFlyout({ topic, onClose }: TopicReportsFlyoutProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) onClose()
    }
    // Defer so the click that opened the flyout doesn't immediately trigger close
    const id = setTimeout(() => document.addEventListener('click', handleClickOutside), 0)
    return () => {
      clearTimeout(id)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [onClose])

  return (
    <div className={styles.flyoutOverlay} role="dialog" aria-label={`Reports: ${topic.topicLabel}`}>
      <div ref={panelRef} className={styles.flyoutPanel}>
        <div className={styles.flyoutHeader}>
          <h3 className={styles.flyoutTitle}>{topic.topicLabel}</h3>
          <button type="button" className={styles.flyoutClose} onClick={onClose} aria-label="Close">×</button>
        </div>
        <p className={styles.flyoutDesc}>{topic.topicDescription}</p>
        <div className={styles.flyoutList}>
          {topic.reports.map((r) => (
            <Link
              key={r.reportId}
              to={`/segment/${r.segmentId}/${r.subSegmentId}`}
              className={styles.flyoutLink}
              onClick={onClose}
            >
              {r.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReportHub() {
  const [topicFlyout, setTopicFlyout] = useState<TopicGroup | null>(null)
  const groups = getTopicGroups()

  const openTopic = (topic: TopicGroup) => setTopicFlyout(topic)
  const closeTopic = () => setTopicFlyout(null)

  return (
    <div className={styles.wrapper}>
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Report Hub</h1>
        <p className={styles.pageSubtitle}>
          Choose a topic to see reports, or use search and Browse all in the header above.
        </p>
      </header>

      <div className={styles.grid}>
        {groups.map((topic) => (
          <article key={topic.topicId} className={styles.card}>
            <h2 className={styles.cardTitle}>{topic.topicLabel}</h2>
            <p className={styles.cardDesc}>{topic.topicDescription}</p>
            <p className={styles.cardCount}>{topic.reports.length} reports</p>
            <button type="button" className={styles.cardBtn} onClick={() => openTopic(topic)}>
              View reports
            </button>
          </article>
        ))}
      </div>

      {topicFlyout && (
        <TopicReportsFlyout topic={topicFlyout} onClose={closeTopic} />
      )}
    </div>
  )
}
