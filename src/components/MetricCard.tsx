import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataPopup } from './DataPopup'
import styles from './MetricCard.module.css'

interface MetricCardProps {
  metric: {
    label: string
    value: string
    change?: string
    trend?: 'up' | 'down'
    clickable?: boolean
    linkTo?: string
  }
  report?: any
}

export function MetricCard({ metric, report }: MetricCardProps) {
  const navigate = useNavigate()
  const [showPopup, setShowPopup] = useState(false)

  const handleClick = () => {
    if (!metric.clickable || !metric.linkTo) return

    if (metric.linkTo.startsWith('popup:')) {
      setShowPopup(true)
    } else {
      navigate(metric.linkTo)
    }
  }

  return (
    <>
      <div
        className={`${styles.metricCard} ${metric.clickable ? styles.clickable : ''}`}
        onClick={handleClick}
      >
        <div className={styles.metricLabel}>{metric.label}</div>
        <div className={styles.metricValue}>
          {metric.value}
          {metric.change != null && (
            <span className={styles.metricChange} data-trend={metric.trend}>
              {' '}{metric.change}
            </span>
          )}
        </div>
      </div>
      {showPopup && report?.rawData && (
        <DataPopup
          title={metric.label}
          data={report.rawData}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  )
}
