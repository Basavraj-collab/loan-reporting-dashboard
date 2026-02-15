import { Link } from 'react-router-dom'
import styles from './NavigationBar.module.css'

interface NavigationBarProps {
  segmentId: string
  subSegmentId: string
}

export function NavigationBar({ segmentId, subSegmentId }: NavigationBarProps) {
  if (segmentId !== 'business-dashboard' || subSegmentId !== 'business-health') {
    return null
  }

  return (
    <div className={styles.navBar}>
      <Link to="/segment/business-dashboard/audience-overview" className={styles.navLink}>
        → Audience Overview
      </Link>
      <Link to="/segment/disbursement/loan-product-analysis" className={styles.navLink}>
        → Disbursement Overview
      </Link>
      <Link to="/segment/repayment/collection-analysis" className={styles.navLink}>
        → Repayment Overview
      </Link>
    </div>
  )
}
