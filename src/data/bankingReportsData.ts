/**
 * Dummy banking reports data: Balance Sheet, P&L, Trial Balance, Ledgers, Journal entries.
 * Amounts in ₹ (INR). Date: as on 31-Jan-2025.
 */

const AS_ON_DATE = '31-Jan-2025'

export const reportDate = AS_ON_DATE

// ---------- Balance Sheet ----------
export interface BalanceSheetLine {
  label: string
  amount: number
  indent?: boolean
  clickableId?: string // e.g. 'pl' to scroll to P&L
}

export const balanceSheet = {
  asOn: AS_ON_DATE,
  assets: [
    { label: 'Cash and Bank', amount: 2_45_00_000, indent: true },
    { label: 'Loan Receivables', amount: 12_80_00_000, indent: true },
    { label: 'Interest Receivable', amount: 1_20_000, indent: true },
    { label: 'Other Assets', amount: 15_00_000, indent: true },
  ] as BalanceSheetLine[],
  liabilities: [
    { label: 'Borrowings', amount: 9_50_00_000, indent: true },
    { label: 'Other Liabilities', amount: 15_00_000, indent: true },
  ] as BalanceSheetLine[],
  equity: [
    { label: 'Share Capital', amount: 2_00_00_000, indent: true },
    { label: 'Reserves', amount: 1_33_00_000, indent: true },
    { label: 'Profit for the period', amount: 17_00_000, indent: true, clickableId: 'profit-and-loss' },
  ] as BalanceSheetLine[],
}

// ---------- Profit & Loss Statement ----------
export interface PLLine {
  label: string
  amount: number
  indent?: boolean
}

export const profitAndLoss = {
  asOn: AS_ON_DATE,
  income: [
    { label: 'Interest Income', amount: 42_00_000, indent: true },
    { label: 'Processing Fee Income', amount: 8_00_000, indent: true },
    { label: 'Other Income', amount: 2_00_000, indent: true },
  ] as PLLine[],
  expenses: [
    { label: 'Interest Expense', amount: 18_00_000, indent: true },
    { label: 'Operating Expenses', amount: 12_00_000, indent: true },
    { label: 'Provision for NPA', amount: 5_00_000, indent: true },
  ] as PLLine[],
  netProfit: 17_00_000,
}

// ---------- Trial Balance (account id used for ledger drill-down) ----------
export interface TrialBalanceRow {
  accountId: string
  accountName: string
  debit: number
  credit: number
}

export const trialBalance = {
  asOn: AS_ON_DATE,
  rows: [
    { accountId: 'cash-bank', accountName: 'Cash and Bank', debit: 2_45_00_000, credit: 0 },
    { accountId: 'loan-receivables', accountName: 'Loan Receivables', debit: 12_80_00_000, credit: 0 },
    { accountId: 'interest-receivable', accountName: 'Interest Receivable', debit: 1_20_000, credit: 0 },
    { accountId: 'other-assets', accountName: 'Other Assets', debit: 15_00_000, credit: 0 },
    { accountId: 'borrowings', accountName: 'Borrowings', debit: 0, credit: 9_50_00_000 },
    { accountId: 'other-liabilities', accountName: 'Other Liabilities', debit: 0, credit: 15_00_000 },
    { accountId: 'share-capital', accountName: 'Share Capital', debit: 0, credit: 2_00_00_000 },
    { accountId: 'reserves', accountName: 'Reserves', debit: 0, credit: 1_33_00_000 },
    { accountId: 'interest-income', accountName: 'Interest Income', debit: 0, credit: 42_00_000 },
    { accountId: 'fee-income', accountName: 'Processing Fee Income', debit: 0, credit: 8_00_000 },
    { accountId: 'interest-expense', accountName: 'Interest Expense', debit: 18_00_000, credit: 0 },
    { accountId: 'operating-expense', accountName: 'Operating Expenses', debit: 12_00_000, credit: 0 },
    { accountId: 'profit-pnl', accountName: 'Profit for the period', debit: 0, credit: 17_00_000 },
  ] as TrialBalanceRow[],
}

// ---------- Ledger entry (one line in a ledger; journalId links to journal) ----------
export interface LedgerEntry {
  date: string
  particulars: string
  debit: number
  credit: number
  balance: number
  journalId: string
}

export interface LedgerAccount {
  accountId: string
  accountName: string
  entries: LedgerEntry[]
}

// ---------- Journal entry ----------
export interface JournalLine {
  accountName: string
  debit: number
  credit: number
}

export interface JournalEntry {
  id: string
  date: string
  narration: string
  lines: JournalLine[]
}

// Ledger data: how trial balance balances are derived (sample entries per account)
export const ledgers: Record<string, LedgerAccount> = {
  'cash-bank': {
    accountId: 'cash-bank',
    accountName: 'Cash and Bank',
    entries: [
      { date: '02-Jan-2025', particulars: 'Processing fee received - Loan LN-001', debit: 2000, credit: 0, balance: 2000, journalId: 'j-fee-1' },
      { date: '05-Jan-2025', particulars: 'Loan disbursement - LN-001', debit: 0, credit: 100000, balance: -98000, journalId: 'j-disb-1' },
      { date: '05-Feb-2025', particulars: 'EMI received - LN-001 (Interest ₹1,000, Principal ₹8,000)', debit: 9000, credit: 0, balance: -89000, journalId: 'j-emi-1' },
      { date: '10-Jan-2025', particulars: 'EMI received - LN-002', debit: 12000, credit: 0, balance: -77000, journalId: 'j-emi-2' },
      { date: '15-Jan-2025', particulars: 'Borrowings received', debit: 5000000, credit: 0, balance: 4923000, journalId: 'j-borrow-1' },
      { date: '20-Jan-2025', particulars: 'Loan disbursements (batch)', debit: 0, credit: 2450000, balance: 2473000, journalId: 'j-disb-batch' },
    ],
  },
  'loan-receivables': {
    accountId: 'loan-receivables',
    accountName: 'Loan Receivables',
    entries: [
      { date: '05-Jan-2025', particulars: 'Disbursement - LN-001 (Customer A, ₹1,00,000)', debit: 100000, credit: 0, balance: 100000, journalId: 'j-disb-1' },
      { date: '05-Feb-2025', particulars: 'Principal portion of EMI - LN-001', debit: 0, credit: 8000, balance: 92000, journalId: 'j-emi-1' },
      { date: '08-Jan-2025', particulars: 'Disbursement - LN-002 (Customer B, ₹1,50,000)', debit: 150000, credit: 0, balance: 250000, journalId: 'j-disb-2' },
      { date: '10-Jan-2025', particulars: 'Principal portion of EMI - LN-002', debit: 0, credit: 11000, balance: 239000, journalId: 'j-emi-2' },
      { date: '20-Jan-2025', particulars: 'Disbursements - Batch (multiple loans)', debit: 2450000, credit: 0, balance: 2689000, journalId: 'j-disb-batch' },
    ],
  },
  'interest-income': {
    accountId: 'interest-income',
    accountName: 'Interest Income',
    entries: [
      { date: '05-Feb-2025', particulars: 'Interest on EMI - LN-001 (12% p.a., ₹1,000)', debit: 0, credit: 1000, balance: -1000, journalId: 'j-emi-1' },
      { date: '10-Jan-2025', particulars: 'Interest on EMI - LN-002', debit: 0, credit: 1500, balance: -2500, journalId: 'j-emi-2' },
      { date: '31-Jan-2025', particulars: 'Interest accrued for the month', debit: 0, credit: 42000, balance: -44500, journalId: 'j-accrued' },
    ],
  },
  'fee-income': {
    accountId: 'fee-income',
    accountName: 'Processing Fee Income',
    entries: [
      { date: '02-Jan-2025', particulars: 'Processing fee - LN-001 (₹2,000)', debit: 0, credit: 2000, balance: -2000, journalId: 'j-fee-1' },
      { date: '08-Jan-2025', particulars: 'Processing fee - LN-002 (₹2,500)', debit: 0, credit: 2500, balance: -4500, journalId: 'j-fee-2' },
    ],
  },
  'interest-receivable': {
    accountId: 'interest-receivable',
    accountName: 'Interest Receivable',
    entries: [
      { date: '31-Jan-2025', particulars: 'Interest accrued on loan book', debit: 120000, credit: 0, balance: 120000, journalId: 'j-accrued' },
    ],
  },
  'borrowings': {
    accountId: 'borrowings',
    accountName: 'Borrowings',
    entries: [
      { date: '15-Jan-2025', particulars: 'Funding received - Term facility', debit: 0, credit: 5000000, balance: -5000000, journalId: 'j-borrow-1' },
    ],
  },
  'interest-expense': {
    accountId: 'interest-expense',
    accountName: 'Interest Expense',
    entries: [
      { date: '31-Jan-2025', particulars: 'Interest on borrowings for the month', debit: 18000, credit: 0, balance: 18000, journalId: 'j-int-exp' },
    ],
  },
  'operating-expense': {
    accountId: 'operating-expense',
    accountName: 'Operating Expenses',
    entries: [
      { date: '25-Jan-2025', particulars: 'Salaries and admin', debit: 12000, credit: 0, balance: 12000, journalId: 'j-opex' },
    ],
  },
  'other-assets': {
    accountId: 'other-assets',
    accountName: 'Other Assets',
    entries: [
      { date: '01-Jan-2025', particulars: 'Opening balance', debit: 1500000, credit: 0, balance: 1500000, journalId: 'j-opening' },
    ],
  },
  'other-liabilities': {
    accountId: 'other-liabilities',
    accountName: 'Other Liabilities',
    entries: [
      { date: '01-Jan-2025', particulars: 'Opening balance', debit: 0, credit: 150000, balance: -150000, journalId: 'j-opening' },
    ],
  },
  'share-capital': {
    accountId: 'share-capital',
    accountName: 'Share Capital',
    entries: [
      { date: '01-Jan-2025', particulars: 'Opening balance', debit: 0, credit: 2000000, balance: -2000000, journalId: 'j-opening' },
    ],
  },
  'reserves': {
    accountId: 'reserves',
    accountName: 'Reserves',
    entries: [
      { date: '01-Jan-2025', particulars: 'Opening balance', debit: 0, credit: 1330000, balance: -1330000, journalId: 'j-opening' },
    ],
  },
  'profit-pnl': {
    accountId: 'profit-pnl',
    accountName: 'Profit for the period',
    entries: [
      { date: '31-Jan-2025', particulars: 'Transfer from P&L', debit: 0, credit: 170000, balance: -170000, journalId: 'j-pl-transfer' },
    ],
  },
}

// Journal entries (referenced by journalId in ledger entries)
export const journalEntries: Record<string, JournalEntry> = {
  'j-fee-1': {
    id: 'j-fee-1',
    date: '02-Jan-2025',
    narration: 'Processing fee received for Loan LN-001. Customer A, Loan amount ₹1,00,000, Tenure 1 year, Rate 12% p.a.',
    lines: [
      { accountName: 'Cash and Bank', debit: 2000, credit: 0 },
      { accountName: 'Processing Fee Income', debit: 0, credit: 2000 },
    ],
  },
  'j-disb-1': {
    id: 'j-disb-1',
    date: '05-Jan-2025',
    narration: 'Loan disbursement LN-001. Customer A - ₹1,00,000, 12% p.a., 1 year. Processing fee ₹2,000 already received.',
    lines: [
      { accountName: 'Loan Receivables', debit: 100000, credit: 0 },
      { accountName: 'Cash and Bank', debit: 0, credit: 100000 },
    ],
  },
  'j-emi-1': {
    id: 'j-emi-1',
    date: '05-Feb-2025',
    narration: 'EMI received for LN-001. Total ₹9,000 = Interest ₹1,000 + Principal ₹8,000.',
    lines: [
      { accountName: 'Cash and Bank', debit: 9000, credit: 0 },
      { accountName: 'Interest Income', debit: 0, credit: 1000 },
      { accountName: 'Loan Receivables', debit: 0, credit: 8000 },
    ],
  },
  'j-disb-2': {
    id: 'j-disb-2',
    date: '08-Jan-2025',
    narration: 'Loan disbursement LN-002. Customer B - ₹1,50,000, 12% p.a., 18 months. Processing fee ₹2,500.',
    lines: [
      { accountName: 'Loan Receivables', debit: 150000, credit: 0 },
      { accountName: 'Cash and Bank', debit: 0, credit: 150000 },
    ],
  },
  'j-fee-2': {
    id: 'j-fee-2',
    date: '08-Jan-2025',
    narration: 'Processing fee received for Loan LN-002 - ₹2,500.',
    lines: [
      { accountName: 'Cash and Bank', debit: 2500, credit: 0 },
      { accountName: 'Processing Fee Income', debit: 0, credit: 2500 },
    ],
  },
  'j-emi-2': {
    id: 'j-emi-2',
    date: '10-Jan-2025',
    narration: 'EMI received for LN-002. Total ₹12,000 = Interest ₹1,500 + Principal ₹11,000.',
    lines: [
      { accountName: 'Cash and Bank', debit: 12000, credit: 0 },
      { accountName: 'Interest Income', debit: 0, credit: 1500 },
      { accountName: 'Loan Receivables', debit: 0, credit: 11000 },
    ],
  },
  'j-borrow-1': {
    id: 'j-borrow-1',
    date: '15-Jan-2025',
    narration: 'Term funding received from bank - ₹50,00,000.',
    lines: [
      { accountName: 'Cash and Bank', debit: 5000000, credit: 0 },
      { accountName: 'Borrowings', debit: 0, credit: 5000000 },
    ],
  },
  'j-disb-batch': {
    id: 'j-disb-batch',
    date: '20-Jan-2025',
    narration: 'Batch disbursement of multiple loans - Total ₹24,50,000.',
    lines: [
      { accountName: 'Loan Receivables', debit: 2450000, credit: 0 },
      { accountName: 'Cash and Bank', debit: 0, credit: 2450000 },
    ],
  },
  'j-accrued': {
    id: 'j-accrued',
    date: '31-Jan-2025',
    narration: 'Interest income accrued on loan book for the month.',
    lines: [
      { accountName: 'Interest Receivable', debit: 120000, credit: 0 },
      { accountName: 'Interest Income', debit: 0, credit: 42000 },
    ],
  },
  'j-int-exp': {
    id: 'j-int-exp',
    date: '31-Jan-2025',
    narration: 'Interest expense on borrowings for the month - ₹18,000.',
    lines: [
      { accountName: 'Interest Expense', debit: 18000, credit: 0 },
      { accountName: 'Other Liabilities', debit: 0, credit: 18000 },
    ],
  },
  'j-opex': {
    id: 'j-opex',
    date: '25-Jan-2025',
    narration: 'Operating expenses - Salaries and admin - ₹12,000.',
    lines: [
      { accountName: 'Operating Expenses', debit: 12000, credit: 0 },
      { accountName: 'Cash and Bank', debit: 0, credit: 12000 },
    ],
  },
  'j-opening': {
    id: 'j-opening',
    date: '01-Jan-2025',
    narration: 'Opening balance brought forward.',
    lines: [
      { accountName: 'Other Assets', debit: 1500000, credit: 0 },
      { accountName: 'Other Liabilities', debit: 0, credit: 150000 },
      { accountName: 'Share Capital', debit: 0, credit: 2000000 },
      { accountName: 'Reserves', debit: 0, credit: 1330000 },
    ],
  },
  'j-pl-transfer': {
    id: 'j-pl-transfer',
    date: '31-Jan-2025',
    narration: 'Transfer of net profit for the period to Retained earnings.',
    lines: [
      { accountName: 'Interest Income', debit: 4200000, credit: 0 },
      { accountName: 'Processing Fee Income', debit: 800000, credit: 0 },
      { accountName: 'Interest Expense', debit: 0, credit: 1800000 },
      { accountName: 'Operating Expenses', debit: 0, credit: 1200000 },
      { accountName: 'Provision for NPA', debit: 0, credit: 500000 },
      { accountName: 'Profit for the period', debit: 0, credit: 1700000 },
    ],
  },
}

export function getLedger(accountId: string): LedgerAccount | undefined {
  return ledgers[accountId]
}

export function getJournal(journalId: string): JournalEntry | undefined {
  return journalEntries[journalId]
}

function formatINR(n: number): string {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)} K`
  return `₹${n}`
}

export function formatAmount(n: number): string {
  return formatINR(Math.abs(n))
}
