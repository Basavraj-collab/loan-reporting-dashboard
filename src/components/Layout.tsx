import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SidebarNav } from './SidebarNav'
import { DateRangeSelector } from './DateRangeSelector'
import styles from './Layout.module.css'

const LOAN_PRODUCTS = ['Loan product 1', 'Loan product 2', 'Loan product 3']

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [selectedLoanProduct, setSelectedLoanProduct] = useState(LOAN_PRODUCTS[0])

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span>Loan Reports</span>
        </div>
        <SidebarNav />
      </aside>
      <main className={styles.main}>
        <div className={styles.headerRow}>
          <div className={styles.locationBank}>
            <span className={styles.topLabel}>Location</span>
            <span className={styles.topLabel}>Bank</span>
          </div>
          <div className={styles.loanProductWrap}>
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
        <div className={styles.dateRow}>
          <DateRangeSelector />
        </div>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
