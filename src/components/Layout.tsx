import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

const LOAN_PRODUCTS = ['Loan product 1', 'Loan product 2', 'Loan product 3']

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isDashboard = location.pathname === '/'
  const isReportsList = location.pathname === '/reports'
  const searchParams = new URLSearchParams(location.search)
  const reportGroup = searchParams.get('group')

  const [selectedLoanProduct, setSelectedLoanProduct] = useState(LOAN_PRODUCTS[0])

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span>Loan Reports</span>
        </div>
        <nav className={styles.nav}>
          <Link to="/" className={isDashboard ? styles.navActive : styles.navLink}>
            Dashboard
          </Link>
          <Link to="/reports" className={isReportsList && !reportGroup ? styles.navActive : styles.navLink}>
            All reports
          </Link>
          <Link to="/reports?group=process" className={reportGroup === 'process' ? styles.navActive : styles.navLink}>
            Loan process
          </Link>
          <Link to="/reports?group=business" className={reportGroup === 'business' ? styles.navActive : styles.navLink}>
            Loan business
          </Link>
        </nav>
      </aside>
      <main className={styles.main}>
        <div className={styles.topBar}>
          <div className={styles.topRow}>
            <span className={styles.topLabel}>Location</span>
            <span className={styles.topLabel}>Bank</span>
          </div>
          <div className={styles.loanProductRow}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Loan product</label>
              <select
                className={styles.select}
                value={selectedLoanProduct}
                onChange={(e) => setSelectedLoanProduct(e.target.value)}
              >
                {LOAN_PRODUCTS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
