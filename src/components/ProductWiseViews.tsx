import { useState } from 'react'
import {
  getDisbursementProductData,
  getCollectionProductData,
  getRiskProductData,
} from '../data/productWiseReportData'
import { ProductWiseSection } from './ProductWiseSection'
import type { SectionVariant } from './ProductWiseSection'
import type { ProductWiseSectionData } from '../data/productWiseReportData'
import styles from './ProductWiseViews.module.css'

function ProductAccordion({
  sections,
  variant,
  defaultOpen,
}: {
  sections: ProductWiseSectionData[]
  variant: SectionVariant
  defaultOpen?: string
}) {
  const [openKey, setOpenKey] = useState<string | null>(defaultOpen ?? sections[0]?.productType ?? null)

  return (
    <div className={styles.accordionList}>
      {sections.map((section) => {
        const isOpen = openKey === section.productType
        return (
          <div key={section.productType} className={styles.accordionItem}>
            <button
              type="button"
              className={styles.accordionHeader + (isOpen ? ` ${styles.accordionHeaderOpen}` : '')}
              onClick={() => setOpenKey(isOpen ? null : section.productType)}
              aria-expanded={isOpen}
              aria-controls={`panel-${section.productType.replace(/\s/g, '-')}`}
              id={`accordion-${section.productType.replace(/\s/g, '-')}`}
            >
              <span className={styles.accordionArrow} aria-hidden>
                ▼
              </span>
              <span className={styles.accordionTitle}>{section.productType}</span>
              <span className={styles.accordionHint}>{isOpen ? 'Collapse' : 'View reports'}</span>
            </button>
            <div
              id={`panel-${section.productType.replace(/\s/g, '-')}`}
              role="region"
              aria-labelledby={`accordion-${section.productType.replace(/\s/g, '-')}`}
              className={styles.accordionBody + (isOpen ? ` ${styles.accordionBodyOpen}` : '')}
              hidden={!isOpen}
            >
              {isOpen && <ProductWiseSection data={section} variant={variant} />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ProductWiseDisbursementView() {
  const sections = getDisbursementProductData()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Loan product wise analysis – Disbursement</h1>
      <p className={styles.subtitle}>
        Click a product type to expand or collapse its reports. Trend, month-wise, store-wise, and dimension × metrics.
      </p>
      <ProductAccordion sections={sections} variant="disbursement" />
    </div>
  )
}

export function ProductWiseCollectionView() {
  const sections = getCollectionProductData()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Loan product wise analysis – Collection</h1>
      <p className={styles.subtitle}>
        Click a product type to expand or collapse its reports. Collection trend and metrics by month, store, and dimensions.
      </p>
      <ProductAccordion sections={sections} variant="collection" />
    </div>
  )
}

export function ProductWiseRiskView() {
  const sections = getRiskProductData()
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Loan product wise analysis – Risk</h1>
      <p className={styles.subtitle}>
        Click a product type to expand or collapse its reports. NPA trend and risk metrics by month, store, and dimensions.
      </p>
      <ProductAccordion sections={sections} variant="risk" />
    </div>
  )
}
