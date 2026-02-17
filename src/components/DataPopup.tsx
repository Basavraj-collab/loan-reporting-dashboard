import { useMemo, useState } from 'react'
import styles from './DataPopup.module.css'

interface DataPopupProps {
  title: string
  data: { headers: string[]; rows: (string | number)[][] }
  onClose: () => void
}

export function DataPopup({ title, data, onClose }: DataPopupProps) {
  const [selectedColumns, setSelectedColumns] = useState<boolean[]>(
    () => data.headers.map(() => true),
  )

  const visibleColumnIndexes = useMemo(
    () => selectedColumns.flatMap((selected, index) => (selected ? index : [])),
    [selectedColumns],
  )

  const toggleColumn = (index: number) => {
    setSelectedColumns((prev) => {
      const next = [...prev]
      next[index] = !next[index]
      // Ensure at least one column stays visible
      if (!next.some(Boolean)) {
        return prev
      }
      return next
    })
  }

  const handleDownload = () => {
    const headers = visibleColumnIndexes.map((i) => data.headers[i])
    const rows = data.rows.map((row) =>
      visibleColumnIndexes.map((i) => String(row[i] ?? '')),
    )

    const csvLines = [
      headers.map((h) => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ]

    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${title.replace(/\s+/g, '-').toLowerCase()}-raw-data.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.controls}>
            <div className={styles.columnsSelector}>
              <span className={styles.columnsLabel}>Columns:</span>
              <div className={styles.columnsList}>
                {data.headers.map((h, index) => (
                  <label key={h} className={styles.columnItem}>
                    <input
                      type="checkbox"
                      checked={selectedColumns[index]}
                      onChange={() => toggleColumn(index)}
                    />
                    <span>{h}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              className={styles.downloadButton}
              type="button"
              onClick={handleDownload}
            >
              Download
            </button>
            <button className={styles.closeButton} onClick={onClose} type="button">
              ×
            </button>
          </div>
        </div>
        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                {visibleColumnIndexes.map((index) => (
                  <th key={data.headers[index]}>{data.headers[index]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i}>
                  {visibleColumnIndexes.map((index) => {
                    const cell = row[index]
                    return (
                      <td key={index}>
                        {typeof cell === 'number'
                          ? cell >= 1000000
                            ? `$${(cell / 1000000).toFixed(1)}M`
                            : cell >= 1000
                              ? cell.toLocaleString()
                              : cell
                          : String(cell)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
