import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getDisbursementProductSection } from '../data/productWiseReportData'
import { ProductWiseSection } from './ProductWiseSection'
import styles from './DisbursementProductVariantPanel.module.css'

export function DisbursementProductVariantPanel({
  productType,
  onClose,
}: {
  productType: string | null
  onClose: () => void
}) {
  const section = productType ? getDisbursementProductSection(productType) : undefined

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

  if (!productType || !section) return null

  const node = (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden />
      <aside
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="disb-variant-panel-title"
      >
        <header className={styles.panelHeader}>
          <h2 id="disb-variant-panel-title" className={styles.panelTitle}>
            Variant-wise reports — {productType}
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
            ×
          </button>
        </header>
        <div className={styles.panelBody}>
          <p className={styles.panelSubtitle}>
            Same report blocks as Loan product wise analysis → Disbursement for this tenor (trend, month-year, store,
            dimensions × metrics).
          </p>
          <ProductWiseSection data={section} variant="disbursement" showProductHeading={false} />
        </div>
      </aside>
    </>
  )

  return createPortal(node, document.body)
}
