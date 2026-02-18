import { useState } from 'react'
import {
  balanceSheet,
  profitAndLoss,
  trialBalance,
  getLedger,
  getJournal,
  formatAmount,
  type LedgerAccount,
  type JournalEntry,
} from '../data/bankingReportsData'
import styles from './BankingReportsView.module.css'

type ReportStep = 'balance-sheet' | 'profit-loss' | 'trial-balance'

export function BankingReportsView() {
  const [step, setStep] = useState<ReportStep>('balance-sheet')
  const [ledgerPopup, setLedgerPopup] = useState<LedgerAccount | null>(null)
  const [journalEntry, setJournalEntry] = useState<JournalEntry | null>(null)

  const goToProfitLoss = () => setStep('profit-loss')
  const goToTrialBalance = () => setStep('trial-balance')

  const handleTrialBalanceAccountClick = (accountId: string) => {
    const ledger = getLedger(accountId)
    setLedgerPopup(ledger ?? null)
    setJournalEntry(null)
  }

  const handleLedgerRowClick = (journalId: string) => {
    const journal = getJournal(journalId)
    setJournalEntry(journal ?? null)
  }

  const downloadLedgerCSV = (account: LedgerAccount) => {
    const headers = ['Date', 'Particulars', 'Debit (₹)', 'Credit (₹)', 'Balance (₹)']
    const rows = account.entries.map((e) => [
      e.date,
      e.particulars,
      e.debit > 0 ? formatAmount(e.debit) : '',
      e.credit > 0 ? formatAmount(e.credit) : '',
      formatAmount(e.balance),
    ])
    const csvLines = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')),
    ]
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ledger-${account.accountName.replace(/\s+/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalAssets = balanceSheet.assets.reduce((s, l) => s + l.amount, 0)
  const totalLiabilities = balanceSheet.liabilities.reduce((s, l) => s + l.amount, 0)
  const totalEquity = balanceSheet.equity.reduce((s, l) => s + l.amount, 0)
  const totalIncome = profitAndLoss.income.reduce((s, l) => s + l.amount, 0)
  const totalExpenses = profitAndLoss.expenses.reduce((s, l) => s + l.amount, 0)
  const tbTotalDebit = trialBalance.rows.reduce((s, r) => s + r.debit, 0)
  const tbTotalCredit = trialBalance.rows.reduce((s, r) => s + r.credit, 0)

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.pageTitle}>Reports and insights</h1>

      {/* ---------- Top navigation: Balance Sheet > Profit & Loss > Trial Balance ---------- */}
      <nav className={styles.breadcrumb} aria-label="Report navigation">
        <button
          type="button"
          className={step === 'balance-sheet' ? styles.breadcrumbActive : styles.breadcrumbLink}
          onClick={() => setStep('balance-sheet')}
        >
          Balance Sheet
        </button>
        <span className={styles.breadcrumbSep} aria-hidden>›</span>
        <button
          type="button"
          className={step === 'profit-loss' ? styles.breadcrumbActive : styles.breadcrumbLink}
          onClick={() => setStep('profit-loss')}
        >
          Profit & Loss
        </button>
        <span className={styles.breadcrumbSep} aria-hidden>›</span>
        <button
          type="button"
          className={step === 'trial-balance' ? styles.breadcrumbActive : styles.breadcrumbLink}
          onClick={() => setStep('trial-balance')}
        >
          Trial Balance
        </button>
      </nav>

      {/* ---------- Balance Sheet (only when this step is selected) ---------- */}
      {step === 'balance-sheet' && (
        <section className={styles.section}>
          <h2 className={styles.reportHeading}>Balance Sheet as on {balanceSheet.asOn}</h2>
          <p className={styles.hint}>
            Click <strong>Profit for the period</strong> to see how it is derived (Profit & Loss statement).
          </p>
          <div className={styles.bsGrid}>
            <div className={styles.bsColumn}>
              <h3 className={styles.bsSubHead}>Assets</h3>
              <table className={styles.table}>
                <tbody>
                  {balanceSheet.assets.map((line, i) => (
                    <tr key={i}>
                      <td className={line.indent ? styles.indent : ''}>{line.label}</td>
                      <td className={styles.amount}>{formatAmount(line.amount)}</td>
                    </tr>
                  ))}
                  <tr className={styles.totalRow}>
                    <td>Total Assets</td>
                    <td className={styles.amount}>{formatAmount(totalAssets)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={styles.bsColumn}>
              <h3 className={styles.bsSubHead}>Liabilities & Equity</h3>
              <table className={styles.table}>
                <tbody>
                  {balanceSheet.liabilities.map((line, i) => (
                    <tr key={i}>
                      <td className={line.indent ? styles.indent : ''}>{line.label}</td>
                      <td className={styles.amount}>{formatAmount(line.amount)}</td>
                    </tr>
                  ))}
                  {balanceSheet.equity.map((line, i) => (
                    <tr key={i}>
                      <td className={line.indent ? styles.indent : ''}>
                        {line.clickableId ? (
                          <button type="button" className={styles.linkLike} onClick={goToProfitLoss}>
                            {line.label}
                          </button>
                        ) : (
                          line.label
                        )}
                      </td>
                      <td className={styles.amount}>{formatAmount(line.amount)}</td>
                    </tr>
                  ))}
                  <tr className={styles.totalRow}>
                    <td>Total Liabilities & Equity</td>
                    <td className={styles.amount}>{formatAmount(totalLiabilities + totalEquity)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Profit & Loss (only when this step is selected) ---------- */}
      {step === 'profit-loss' && (
        <section className={styles.section}>
          <h2 className={styles.reportHeading}>Profit and Loss Statement as on {profitAndLoss.asOn}</h2>
          <p className={styles.hint}>
            This statement explains the <strong>Profit for the period</strong> shown on the Balance Sheet.
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Particulars</th>
                <th className={styles.amount}>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={2} className={styles.plGroup}>Income</td>
              </tr>
              {profitAndLoss.income.map((line, i) => (
                <tr key={i}>
                  <td className={line.indent ? styles.indent : ''}>{line.label}</td>
                  <td className={styles.amount}>{formatAmount(line.amount)}</td>
                </tr>
              ))}
              <tr className={styles.subTotal}>
                <td>Total Income</td>
                <td className={styles.amount}>{formatAmount(totalIncome)}</td>
              </tr>
              <tr>
                <td colSpan={2} className={styles.plGroup}>Expenses</td>
              </tr>
              {profitAndLoss.expenses.map((line, i) => (
                <tr key={i}>
                  <td className={line.indent ? styles.indent : ''}>{line.label}</td>
                  <td className={styles.amount}>{formatAmount(line.amount)}</td>
                </tr>
              ))}
              <tr className={styles.subTotal}>
                <td>Total Expenses</td>
                <td className={styles.amount}>{formatAmount(totalExpenses)}</td>
              </tr>
              <tr className={styles.totalRow}>
                <td>Net Profit</td>
                <td className={styles.amount}>{formatAmount(profitAndLoss.netProfit)}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.nextSection}>
            <button type="button" className={styles.nextButton} onClick={goToTrialBalance}>
              Next: Trial Balance →
            </button>
          </div>
        </section>
      )}

      {/* ---------- Trial Balance (only when this step is selected) ---------- */}
      {step === 'trial-balance' && (
        <section className={styles.section}>
          <h2 className={styles.reportHeading}>Trial Balance as on {trialBalance.asOn}</h2>
          <p className={styles.hint}>
            Click an account name to view its ledger entries in a popup (with download).
          </p>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Account</th>
                  <th className={styles.amount}>Debit (₹)</th>
                  <th className={styles.amount}>Credit (₹)</th>
                </tr>
              </thead>
              <tbody>
                {trialBalance.rows.map((row, i) => (
                  <tr key={i}>
                    <td>
                      <button
                        type="button"
                        className={styles.linkLike}
                        onClick={() => handleTrialBalanceAccountClick(row.accountId)}
                      >
                        {row.accountName}
                      </button>
                    </td>
                    <td className={styles.amount}>{row.debit > 0 ? formatAmount(row.debit) : '–'}</td>
                    <td className={styles.amount}>{row.credit > 0 ? formatAmount(row.credit) : '–'}</td>
                  </tr>
                ))}
                <tr className={styles.totalRow}>
                  <td>Total</td>
                  <td className={styles.amount}>{formatAmount(tbTotalDebit)}</td>
                  <td className={styles.amount}>{formatAmount(tbTotalCredit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ---------- Ledger popup (raw data: all rows/columns, download, close) ---------- */}
      {ledgerPopup && (
        <div className={styles.overlay} onClick={() => { setLedgerPopup(null); setJournalEntry(null) }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Ledger – {ledgerPopup.accountName}</h3>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.downloadBtn}
                  onClick={() => downloadLedgerCSV(ledgerPopup)}
                  title="Download as CSV"
                >
                  ⬇ Download
                </button>
                <button type="button" className={styles.closeBtn} onClick={() => { setLedgerPopup(null); setJournalEntry(null) }}>
                  × Close
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              <p className={styles.hint}>Click a row to see the journal entry below. Use Download to export this ledger as CSV.</p>
              <div className={styles.popupTableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Particulars</th>
                      <th className={styles.amount}>Debit (₹)</th>
                      <th className={styles.amount}>Credit (₹)</th>
                      <th className={styles.amount}>Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerPopup.entries.map((entry, i) => (
                      <tr
                        key={i}
                        className={styles.clickableRow}
                        onClick={() => handleLedgerRowClick(entry.journalId)}
                      >
                        <td>{entry.date}</td>
                        <td>{entry.particulars}</td>
                        <td className={styles.amount}>{entry.debit > 0 ? formatAmount(entry.debit) : '–'}</td>
                        <td className={styles.amount}>{entry.credit > 0 ? formatAmount(entry.credit) : '–'}</td>
                        <td className={styles.amount}>{formatAmount(entry.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {journalEntry && (
                <div className={styles.journalInPopup}>
                  <h4 className={styles.journalHeading}>Journal entry</h4>
                  <p><strong>Date:</strong> {journalEntry.date}</p>
                  <p className={styles.narration}>{journalEntry.narration}</p>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Account</th>
                        <th className={styles.amount}>Debit (₹)</th>
                        <th className={styles.amount}>Credit (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {journalEntry.lines.map((line, i) => (
                        <tr key={i}>
                          <td>{line.accountName}</td>
                          <td className={styles.amount}>{line.debit > 0 ? formatAmount(line.debit) : '–'}</td>
                          <td className={styles.amount}>{line.credit > 0 ? formatAmount(line.credit) : '–'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
