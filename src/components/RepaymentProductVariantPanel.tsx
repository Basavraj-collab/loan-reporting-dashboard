import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getCollectionProductSection, getRiskProductSection } from '../data/productWiseReportData'
import { ProductWiseSection } from './ProductWiseSection'
import styles from './DisbursementProductVariantPanel.module.css'

export function RepaymentProductVariantPanel({
  productType,
  onClose,
}: {
  productType: string | null
  onClose: () => void
}) {
  const collection = productType ? getCollectionProductSection(productType) : undefined
  const risk = productType ? getRiskProductSection(productType) : undefined

  useEffect(() => {
    if (!productType) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [productType, onClose])

  if (!productType || !collection || !risk) return null

  const node = (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden />
      <aside
        className={`${styles.panel} ${styles.panelWide}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="repay-variant-panel-title"
      >
        <header className={styles.panelHeader}>
          <h2 id="repay-variant-panel-title" className={styles.panelTitle}>
            Repayment — variant-wise reports — {productType}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
            ×
          </button>
        </header>
        <div className={styles.panelBody}>
          <p className={styles.panelSubtitle}>
            Same report blocks as <strong>Loan product wise analysis</strong> for this variant:{' '}
            <strong>Collection</strong> and <strong>Risk</strong> (trend, month-year, store, dimensions × metrics).
          </p>
          <h3 className={styles.panelBlockTitle}>Collection</h3>
          <ProductWiseSection data={collection} variant="collection" showProductHeading={false} />
          <h3 className={styles.panelBlockTitle}>Risk</h3>
          <ProductWiseSection data={risk} variant="risk" showProductHeading={false} />
        </div>
      </aside>
    </>
  )

  return createPortal(node, document.body)
}
