import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { segments } from '../data/navigation'
import styles from './SidebarNav.module.css'

export function SidebarNav() {
  const location = useLocation()

  const [isReportsExpanded, setIsReportsExpanded] = useState(true)
  const [expandedSegments, setExpandedSegments] = useState<Set<string>>(new Set(['business-dashboard']))

  const toggleReports = () => {
    setIsReportsExpanded((prev) => !prev)
  }

  const toggleSegment = (segmentId: string) => {
    const newExpanded = new Set(expandedSegments)
    if (newExpanded.has(segmentId)) {
      newExpanded.delete(segmentId)
    } else {
      newExpanded.add(segmentId)
    }
    setExpandedSegments(newExpanded)
  }

  const isSegmentActive = (segmentId: string, subSegmentId: string) => {
    const path = location.pathname
    return path.includes(`/segment/${segmentId}/${subSegmentId}`)
  }

  const isPinnedActive = location.pathname === '/pinned'

  return (
    <nav className={styles.nav}>
      <Link to="/pinned" className={isPinnedActive ? styles.pinnedActive : styles.pinned}>
        Pinned reports
      </Link>

      <div className={styles.segmentGroup}>
        <button
          className={styles.segmentHeader}
          onClick={toggleReports}
          type="button"
        >
          <span className={styles.segmentName}>Reports</span>
          <span className={styles.expandIcon}>{isReportsExpanded ? '▼' : '▶'}</span>
        </button>

        {isReportsExpanded && (
          <div className={styles.groupBody}>
            {segments.map((segment) => {
              const isExpanded = expandedSegments.has(segment.id)
              return (
                <div key={segment.id} className={styles.segment}>
                  <button
                    className={styles.segmentHeader}
                    onClick={() => toggleSegment(segment.id)}
                    type="button"
                  >
                    <span className={styles.segmentName}>{segment.name}</span>
                    <span className={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</span>
                  </button>
                  {isExpanded && (
                    <div className={styles.subSegments}>
                      {segment.subSegments.map((subSegment) => {
                        const isActive = isSegmentActive(segment.id, subSegment.id)
                        return (
                          <Link
                            key={subSegment.id}
                            to={`/segment/${segment.id}/${subSegment.id}`}
                            className={isActive ? styles.subSegmentActive : styles.subSegment}
                          >
                            {subSegment.name}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
