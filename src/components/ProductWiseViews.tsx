import {
  getDisbursementProductData,
  getCollectionProductData,
  getRiskProductData,
} from '../data/productWiseReportData'
import { ProductWiseSection } from './ProductWiseSection'
import styles from './ProductWiseViews.module.css'

export function ProductWiseDisbursementView() {
  const sections = getDisbursementProductData()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Loan product wise analysis – Disbursement</h1>
      <p className={styles.subtitle}>
        For each product type: trend (count + amount), month-wise metrics, store-wise metrics, and dimensions × metrics.
      </p>
      {sections.map((section) => (
        <ProductWiseSection key={section.productType} data={section} variant="disbursement" />
      ))}
    </div>
  )
}

export function ProductWiseCollectionView() {
  const sections = getCollectionProductData()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Loan product wise analysis – Collection</h1>
      <p className={styles.subtitle}>
        For each product type: collection trend, month-wise and store-wise collection metrics, and dimensions × metrics.
      </p>
      {sections.map((section) => (
        <ProductWiseSection key={section.productType} data={section} variant="collection" />
      ))}
    </div>
  )
}

export function ProductWiseRiskView() {
  const sections = getRiskProductData()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Loan product wise analysis – Risk</h1>
      <p className={styles.subtitle}>
        For each product type: NPA trend, month-wise and store-wise risk metrics, and dimensions × metrics.
      </p>
      {sections.map((section) => (
        <ProductWiseSection key={section.productType} data={section} variant="risk" />
      ))}
    </div>
  )
}
