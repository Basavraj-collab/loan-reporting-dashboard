import { Link, useLocation } from 'react-router-dom'
import { getReports, getReportsByGroup, getCategories, type ReportGroup } from '../data/reports'
import styles from './ReportHub.module.css'

const GROUP_LABELS: Record<ReportGroup, string> = {
  process: 'Loan process',
  business: 'Loan business',
}

export function ReportHub() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const groupFilter = (searchParams.get('group') as ReportGroup) || null
  const reports = getReports()
  const processReports = reports.filter((r) => r.group === 'process')
  const businessReports = reports.filter((r) => r.group === 'business')

  const sections: { group: ReportGroup; reports: typeof reports }[] = groupFilter
    ? [{ group: groupFilter, reports: getReportsByGroup(groupFilter) }]
    : [
        { group: 'process', reports: processReports },
        { group: 'business', reports: businessReports },
      ]

  return (
    <div className={styles.hub}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {groupFilter ? GROUP_LABELS[groupFilter] : 'Reports'}
        </h1>
        <p className={styles.subtitle}>
          {groupFilter
            ? `Reports for ${GROUP_LABELS[groupFilter].toLowerCase()}. Select one to view details.`
            : 'Loan process and loan business reports. Select a report or use the sidebar to filter by category.'}
        </p>
        {groupFilter && (
          <Link to="/reports" className={styles.clearFilter}>
            Show all reports
          </Link>
        )}
      </header>
      {sections.map(({ group, reports: sectionReports }) => {
        const categories = getCategories(group)
        if (sectionReports.length === 0) return null
        return (
          <section key={group} className={styles.section}>
            <h2 className={styles.groupTitle}>{GROUP_LABELS[group]}</h2>
            {categories.map((category) => {
              const categoryReports = sectionReports.filter((r) => r.category === category)
              if (categoryReports.length === 0) return null
              return (
                <div key={category} className={styles.categoryBlock}>
                  <h3 className={styles.category}>{category}</h3>
                  <div className={styles.grid}>
                    {categoryReports.map((report) => (
                      <Link to={`/reports/${report.id}`} key={report.id} className={styles.card}>
                        <h3 className={styles.cardTitle}>{report.title}</h3>
                        <p className={styles.cardDesc}>{report.description}</p>
                        <span className={styles.cardArrow}>→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
