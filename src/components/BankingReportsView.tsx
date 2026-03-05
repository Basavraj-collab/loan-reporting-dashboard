import React, { useContext, useState } from 'react'
import {
  balanceSheet,
  profitAndLoss,
  trialBalance,
  getLedger,
  getJournal,
  formatAmount,
  type LedgerAccount,
} from '../data/bankingReportsData'
import { PortalOptionContext } from '../App'
import styles from './BankingReportsView.module.css'

type ReportStep = 'balance-sheet' | 'profit-loss' | 'trial-balance'

export function BankingReportsView() {
  const portalOption = useContext(PortalOptionContext)
  const [step, setStep] = useState<ReportStep>('balance-sheet')
  const [expandedLedgerAccountId, setExpandedLedgerAccountId] = useState<string | null>(null)
  const [expandedJournalKey, setExpandedJournalKey] = useState<{ accountId: string; journalId: string } | null>(null)
  const [ledgerPopupAccountId, setLedgerPopupAccountId] = useState<string | null>(null)
  const isOption1 = portalOption === 1
  const ledgerPopup = !isOption1 && ledgerPopupAccountId ? getLedger(ledgerPopupAccountId) : null

  const goToProfitLoss = () => setStep('profit-loss')
  const goToTrialBalance = () => setStep('trial-balance')

  const toggleLedger = (accountId: string) => {
    setExpandedLedgerAccountId((prev) => (prev === accountId ? null : accountId))
    setExpandedJournalKey(null)
  }

  const toggleJournal = (accountId: string, journalId: string) => {
    setExpandedJournalKey((prev) =>
      prev?.accountId === accountId && prev?.journalId === journalId ? null : { accountId, journalId }
    )
  }

  const downloadTrialBalanceCSV = () => {
    const headers = ['Date', 'Account number', 'Account name', 'Vision GL', 'Debit (₹)', 'Credit (₹)']
    const rows = trialBalance.rows.map((r) => [
      r.date,
      r.accountNumber,
      r.accountName,
      r.visionGL,
      r.debit > 0 ? formatAmount(r.debit) : '',
      r.credit > 0 ? formatAmount(r.credit) : '',
    ])
    const totalDebit = trialBalance.rows.reduce((s, r) => s + r.debit, 0)
    const totalCredit = trialBalance.rows.reduce((s, r) => s + r.credit, 0)
    rows.push(['', '', '', 'Total', formatAmount(totalDebit), formatAmount(totalCredit)])
    const csvLines = [
      headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(','),
      ...rows.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')),
    ]
    const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trial-balance-${trialBalance.asOn.replace(/\s+/g, '-')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadLedgerCSV = (account: LedgerAccount) => {
    const headers = ['Date', 'Particulars', 'Voucher no', 'Debit (₹)', 'Credit (₹)', 'Balance (₹)']
    const rows = account.entries.map((e) => [
      e.date,
      e.particulars,
      e.voucherNo,
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
          {isOption1 ? (
            <>
              <div className={styles.tbSectionHeader}>
                <div>
                  <h2 className={styles.reportHeading}>Trial Balance as on {trialBalance.asOn}</h2>
                </div>
                <button
                  type="button"
                  className={styles.downloadReportBtn}
                  onClick={downloadTrialBalanceCSV}
                  title="Download report"
                >
                  ⬇ Download
                </button>
              </div>
              <p className={styles.hint}>
                Click the dropdown icon (▼) to the left of a row to expand the Ledger Account below. Then click the icon on a ledger row to view the Journal entry.
              </p>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.tbExpandCol} aria-label="Expand" />
                      <th>Date</th>
                      <th>Account number</th>
                      <th>Account name</th>
                      <th>Vision GL</th>
                      <th className={styles.amount}>Debit (₹)</th>
                      <th className={styles.amount}>Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialBalance.rows.map((row, i) => (
                      <React.Fragment key={i}>
                        <tr>
                          <td className={styles.tbExpandCol}>
                            <button
                              type="button"
                              className={styles.expandBtn}
                              onClick={() => toggleLedger(row.accountId)}
                              aria-expanded={expandedLedgerAccountId === row.accountId}
                              aria-label={expandedLedgerAccountId === row.accountId ? 'Collapse ledger' : 'Expand ledger'}
                            >
                              {expandedLedgerAccountId === row.accountId ? '▲' : '▼'}
                            </button>
                          </td>
                          <td>{row.date}</td>
                          <td>{row.accountNumber}</td>
                          <td>{row.accountName}</td>
                          <td>{row.visionGL}</td>
                          <td className={styles.amount}>{row.debit > 0 ? formatAmount(row.debit) : '–'}</td>
                          <td className={styles.amount}>{row.credit > 0 ? formatAmount(row.credit) : '–'}</td>
                        </tr>
                        {expandedLedgerAccountId === row.accountId && getLedger(row.accountId) && (
                          <tr key={`ledger-${i}`}>
                            <td colSpan={7} className={styles.ledgerCell}>
                              <div className={styles.ledgerBlock}>
                                <h4 className={styles.ledgerHeading}>
                                  Ledger Account : {getLedger(row.accountId)!.accountName}
                                </h4>
                                <div className={styles.ledgerTableWrap}>
                                  <table className={styles.table}>
                                    <thead>
                                      <tr>
                                        <th className={styles.ledgerExpandCol} aria-label="Expand" />
                                        <th>Date</th>
                                        <th>Particulars</th>
                                        <th>Voucher no</th>
                                        <th className={styles.amount}>Debit (₹)</th>
                                        <th className={styles.amount}>Credit (₹)</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {getLedger(row.accountId)!.entries.map((entry, ei) => (
                                        <React.Fragment key={ei}>
                                          <tr>
                                            <td className={styles.ledgerExpandCol}>
                                              <button
                                                type="button"
                                                className={styles.expandBtn}
                                                onClick={() => toggleJournal(row.accountId, entry.journalId)}
                                                aria-expanded={
                                                  expandedJournalKey?.accountId === row.accountId &&
                                                  expandedJournalKey?.journalId === entry.journalId
                                                }
                                                aria-label="View journal entry"
                                              >
                                                {expandedJournalKey?.accountId === row.accountId &&
                                                expandedJournalKey?.journalId === entry.journalId
                                                  ? '▲'
                                                  : '▼'}
                                              </button>
                                            </td>
                                            <td>{entry.date}</td>
                                            <td>{entry.particulars}</td>
                                            <td>{entry.voucherNo}</td>
                                            <td className={styles.amount}>{entry.debit > 0 ? formatAmount(entry.debit) : '–'}</td>
                                            <td className={styles.amount}>{entry.credit > 0 ? formatAmount(entry.credit) : '–'}</td>
                                          </tr>
                                          {expandedJournalKey?.accountId === row.accountId &&
                                            expandedJournalKey?.journalId === entry.journalId &&
                                            getJournal(entry.journalId) && (
                                              <tr key={`journal-${ei}`}>
                                                <td colSpan={6} className={styles.journalCell}>
                                                  <div className={styles.journalBlock}>
                                                    <h5 className={styles.journalBlockHeadingGreen}>
                                                      Journal Entry : {entry.voucherNo}
                                                    </h5>
                                                    <table className={styles.table}>
                                                      <thead>
                                                        <tr>
                                                          <th>Account name</th>
                                                          <th className={styles.amount}>Debit (₹)</th>
                                                          <th className={styles.amount}>Credit (₹)</th>
                                                          <th>Narration</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {getJournal(entry.journalId)!.lines.map((line, li) => (
                                                          <tr key={li}>
                                                            <td>{line.accountName}</td>
                                                            <td className={styles.amount}>{line.debit > 0 ? formatAmount(line.debit) : '–'}</td>
                                                            <td className={styles.amount}>{line.credit > 0 ? formatAmount(line.credit) : '–'}</td>
                                                            <td className={styles.narrationCell}>
                                                              {li === 0 ? getJournal(entry.journalId)!.narration : ''}
                                                            </td>
                                                          </tr>
                                                        ))}
                                                      </tbody>
                                                    </table>
                                                  </div>
                                                </td>
                                              </tr>
                                            )}
                                        </React.Fragment>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                    <tr className={styles.totalRow}>
                      <td className={styles.tbExpandCol} />
                      <td colSpan={4}>Total</td>
                      <td className={styles.amount}>{formatAmount(tbTotalDebit)}</td>
                      <td className={styles.amount}>{formatAmount(tbTotalCredit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Option 2 and 3: simple trial balance table only – no dropdown, no ledger, no journal */
            <>
              <h2 className={styles.reportHeading}>Trial Balance as on {trialBalance.asOn}</h2>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Account number</th>
                      <th>Account name</th>
                      <th>Vision GL</th>
                      <th className={styles.amount}>Debit (₹)</th>
                      <th className={styles.amount}>Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trialBalance.rows.map((row, i) => (
                      <tr key={i}>
                        <td>{row.date}</td>
                        <td>{row.accountNumber}</td>
                        <td>
                          <button
                            type="button"
                            className={styles.linkLike}
                            onClick={() => setLedgerPopupAccountId(row.accountId)}
                          >
                            {row.accountName}
                          </button>
                        </td>
                        <td>{row.visionGL}</td>
                        <td className={styles.amount}>{row.debit > 0 ? formatAmount(row.debit) : '–'}</td>
                        <td className={styles.amount}>{row.credit > 0 ? formatAmount(row.credit) : '–'}</td>
                      </tr>
                    ))}
                    <tr className={styles.totalRow}>
                      <td colSpan={4}>Total</td>
                      <td className={styles.amount}>{formatAmount(tbTotalDebit)}</td>
                      <td className={styles.amount}>{formatAmount(tbTotalCredit)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}

      {/* Ledger raw-data popup for Option 2 and 3 only – open on account name click in Trial Balance */}
      {ledgerPopup && (
        <div className={styles.overlay} onClick={() => setLedgerPopupAccountId(null)}>
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
                <button type="button" className={styles.closeBtn} onClick={() => setLedgerPopupAccountId(null)}>
                  × Close
                </button>
              </div>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.popupTableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Particulars</th>
                      <th>Voucher no</th>
                      <th className={styles.amount}>Debit (₹)</th>
                      <th className={styles.amount}>Credit (₹)</th>
                      <th className={styles.amount}>Balance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerPopup.entries.map((entry, i) => (
                      <tr key={i}>
                        <td>{entry.date}</td>
                        <td>{entry.particulars}</td>
                        <td>{entry.voucherNo}</td>
                        <td className={styles.amount}>{entry.debit > 0 ? formatAmount(entry.debit) : '–'}</td>
                        <td className={styles.amount}>{entry.credit > 0 ? formatAmount(entry.credit) : '–'}</td>
                        <td className={styles.amount}>{formatAmount(entry.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
