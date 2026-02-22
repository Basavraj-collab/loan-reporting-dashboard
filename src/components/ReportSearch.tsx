import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchReports, type ReportEntry } from '../data/reportDiscovery'
import styles from './ReportSearch.module.css'

const MAX_RESULTS = 8

interface ReportSearchProps {
  onOpenBrowse?: () => void
  onSelect?: () => void
  placeholder?: string
  className?: string
}

export function ReportSearch({
  onOpenBrowse,
  onSelect,
  placeholder = 'Search reports and insights',
  className = '',
}: ReportSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ReportEntry[]>([])
  const [focused, setFocused] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setResults(searchReports(query).slice(0, MAX_RESULTS))
    setHighlightIndex(-1)
  }, [query])

  useEffect(() => {
    if (highlightIndex >= 0 && highlightIndex < results.length && listRef.current) {
      const el = listRef.current.children[highlightIndex] as HTMLElement
      el?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIndex, results.length])

  const handleSelect = (entry: ReportEntry) => {
    navigate(`/segment/${entry.segmentId}/${entry.subSegmentId}`)
    onSelect?.()
    setQuery('')
    setFocused(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!focused || results.length === 0) {
      if (e.key === 'Escape') setFocused(false)
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => (i < results.length - 1 ? i + 1 : 0))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => (i <= 0 ? results.length - 1 : i - 1))
      return
    }
    if (e.key === 'Enter' && highlightIndex >= 0 && results[highlightIndex]) {
      e.preventDefault()
      handleSelect(results[highlightIndex])
      return
    }
    if (e.key === 'Escape') {
      setFocused(false)
      setHighlightIndex(-1)
      inputRef.current?.blur()
    }
  }

  const hasQuery = query.trim().length > 0
  const showDropdown = focused && hasQuery
  const hasResults = results.length > 0
  const emptySearch = hasQuery && !hasResults

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.inputWrap}>
        <span className={styles.searchIcon} aria-hidden>🔍</span>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={handleKeyDown}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          aria-controls="report-search-results"
          id="report-search-input"
        />
      </div>
      {showDropdown && (
        <div id="report-search-results" ref={listRef} className={styles.dropdown} role="listbox">
          {emptySearch ? (
            <div className={styles.empty}>
              <p className={styles.emptyMessage}>No reports match. Try another term or browse by topic.</p>
              {onOpenBrowse && (
                <button type="button" className={styles.browseAllBtn} onClick={onOpenBrowse}>
                  Browse all reports
                </button>
              )}
            </div>
          ) : (
            results.map((entry, i) => (
              <button
                key={`${entry.reportId}-${i}`}
                type="button"
                role="option"
                className={highlightIndex === i ? styles.resultActive : styles.result}
                onClick={() => handleSelect(entry)}
                onMouseEnter={() => setHighlightIndex(i)}
              >
                <span className={styles.resultTitle}>{entry.title}</span>
                <span className={styles.resultMeta}>{entry.topicLabel}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
