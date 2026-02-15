import { Link } from 'react-router-dom'
import { getReportsByGroup } from '../data/reports'
import styles from './Dashboard.module.css'

export function Dashboard() {
  const processCount = getReportsByGroup('process').length
  const businessCount = getReportsByGroup('business').length

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.title}>Loan Reporting Dashboard</h1>
        <p className={styles.subtitle}>
          View loan process and loan business reports. Choose a category below to navigate.
        </p>
      </header>

      <nav className={styles.navGrid}>
        <Link to="/reports?group=process" className={styles.card}>
          <span className={styles.cardIcon}>📋</span>
          <h2 className={styles.cardTitle}>Loan Process</h2>
          <p className={styles.cardDesc}>
            Origination, underwriting, disbursement, and documentation.
          </p>
          <span className={styles.cardMeta}>{processCount} reports</span>
          <span className={styles.cardArrow}>View →</span>
        </Link>
        <Link to="/reports?group=business" className={styles.card}>
          <span className={styles.cardIcon}>📊</span>
          <h2 className={styles.cardTitle}>Loan Business</h2>
          <p className={styles.cardDesc}>
            Portfolio, risk, revenue, compliance, and overview.
          </p>
          <span className={styles.cardMeta}>{businessCount} reports</span>
          <span className={styles.cardArrow}>View →</span>
        </Link>
      </nav>

      <div className={styles.footer}>
        <Link to="/reports" className={styles.allLink}>
          All reports
        </Link>
      </div>
    </div>
  )
}
