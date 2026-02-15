import styles from './DataPopup.module.css'

interface DataPopupProps {
  title: string
  data: { headers: string[]; rows: (string | number)[][] }
  onClose: () => void
}

export function DataPopup({ title, data, onClose }: DataPopupProps) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button className={styles.closeButton} onClick={onClose} type="button">
            ×
          </button>
        </div>
        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                {data.headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>
                      {typeof cell === 'number'
                        ? cell >= 1000000
                          ? `$${(cell / 1000000).toFixed(1)}M`
                          : cell >= 1000
                            ? cell.toLocaleString()
                            : cell
                        : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
