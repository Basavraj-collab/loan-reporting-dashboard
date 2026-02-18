import styles from './PortalTabBar.module.css'

export type PortalOption = 1 | 2 | 3

interface PortalTabBarProps {
  selected: PortalOption
  onSelect: (option: PortalOption) => void
}

export function PortalTabBar({ selected, onSelect }: PortalTabBarProps) {
  return (
    <div className={styles.bar}>
      <div className={styles.tabs}>
        <button
          type="button"
          className={selected === 1 ? styles.tabActive : styles.tab}
          onClick={() => onSelect(1)}
        >
          Option 1
        </button>
        <button
          type="button"
          className={selected === 2 ? styles.tabActive : styles.tab}
          onClick={() => onSelect(2)}
        >
          Option 2
        </button>
        <button
          type="button"
          className={selected === 3 ? styles.tabActive : styles.tab}
          onClick={() => onSelect(3)}
        >
          Option 3
        </button>
      </div>
      <span className={styles.badge}>
        {selected === 1 && 'Sidebar navigation'}
        {selected === 2 && 'Top dropdown navigation'}
        {selected === 3 && 'Breadcrumb + sub-nav'}
      </span>
    </div>
  )
}
