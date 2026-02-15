/** Loan Process = origination, underwriting, disbursement. Loan Business = portfolio, risk, revenue, compliance. */
export type ReportGroup = 'process' | 'business'

export interface Report {
  id: string
  title: string
  description: string
  category: string
  group: ReportGroup
  metrics: { label: string; value: string; change?: string; trend?: 'up' | 'down' }[]
  table?: { headers: string[]; rows: (string | number)[][] }
}

export const reports: Report[] = [
  // Loan Process – Origination
  {
    id: 'origination-volume',
    title: 'Origination Volume',
    description: 'Loan applications and approval volume by month.',
    category: 'Origination',
    group: 'process',
    metrics: [
      { label: 'Applications', value: '12,450', change: '+5%', trend: 'up' },
      { label: 'Approved', value: '8,920', change: '+7%', trend: 'up' },
      { label: 'Approval Rate', value: '71.6%', change: '+1.2%', trend: 'up' },
    ],
    table: {
      headers: ['Month', 'Applications', 'Approved', 'Approval Rate'],
      rows: [
        ['Jan 2025', 3840, 2720, '70.8%'],
        ['Feb 2025', 4120, 2980, '72.3%'],
        ['Mar 2025', 4490, 3220, '71.7%'],
      ],
    },
  },
  {
    id: 'acquisition-funnel',
    title: 'Acquisition Funnel',
    description: 'Lead-to-application conversion by source.',
    category: 'Origination',
    group: 'process',
    metrics: [
      { label: 'Leads', value: '45,200', change: '+8%', trend: 'up' },
      { label: 'Applications', value: '12,450', change: '+5%', trend: 'up' },
      { label: 'Conversion', value: '27.5%', change: '-0.8%', trend: 'down' },
    ],
    table: {
      headers: ['Source', 'Leads', 'Applications', 'Conversion'],
      rows: [
        ['Digital', 18200, 5120, '28.1%'],
        ['Branch', 12500, 3840, '30.7%'],
        ['Referral', 9800, 2450, '25.0%'],
      ],
    },
  },
  // Loan Process – Underwriting
  {
    id: 'underwriting-backlog',
    title: 'Underwriting Backlog',
    description: 'Pending applications and average turnaround time.',
    category: 'Underwriting',
    group: 'process',
    metrics: [
      { label: 'Pending', value: '1,240', change: '-12%', trend: 'up' },
      { label: 'Avg Turnaround', value: '2.3 days', change: '-0.2', trend: 'up' },
      { label: 'SLA Met', value: '96%', change: '+1%', trend: 'up' },
    ],
    table: {
      headers: ['Queue', 'Count', 'Avg Days', 'SLA Met'],
      rows: [
        ['New', 420, 1.8, '98%'],
        ['In Review', 580, 2.5, '95%'],
        ['Pending Docs', 240, 3.1, '92%'],
      ],
    },
  },
  {
    id: 'approval-decline',
    title: 'Approval & Decline Summary',
    description: 'Approval and decline rates by product and segment.',
    category: 'Underwriting',
    group: 'process',
    metrics: [
      { label: 'Approved', value: '8,920', change: '+7%', trend: 'up' },
      { label: 'Declined', value: '3,530', change: '-2%', trend: 'up' },
      { label: 'Decline Rate', value: '28.4%', change: '-1.5%', trend: 'up' },
    ],
  },
  // Loan Process – Disbursement
  {
    id: 'disbursements',
    title: 'Disbursements',
    description: 'Loan disbursement volume and timing.',
    category: 'Disbursement',
    group: 'process',
    metrics: [
      { label: 'MTD Disbursed', value: '$24.2M', change: '+9%', trend: 'up' },
      { label: 'Loans Count', value: '1,180', change: '+6%', trend: 'up' },
      { label: 'Avg Ticket', value: '$20,500', change: '+3%', trend: 'up' },
    ],
    table: {
      headers: ['Week', 'Amount', 'Count', 'Avg Ticket'],
      rows: [
        ['Week 1', 5800000, 285, 20350],
        ['Week 2', 6200000, 302, 20530],
        ['Week 3', 6100000, 298, 20470],
      ],
    },
  },
  {
    id: 'documentation',
    title: 'Documentation Status',
    description: 'Document completeness and exceptions.',
    category: 'Documentation',
    group: 'process',
    metrics: [
      { label: 'Complete', value: '94%', change: '+2%', trend: 'up' },
      { label: 'Exceptions', value: '86', change: '-14', trend: 'up' },
      { label: 'Avg Days to Complete', value: '4.2', change: '-0.3', trend: 'up' },
    ],
  },
  // Loan Business – Portfolio
  {
    id: 'portfolio-overview',
    title: 'Portfolio Overview',
    description: 'Total loan book size, mix, and growth.',
    category: 'Portfolio',
    group: 'business',
    metrics: [
      { label: 'Total Book', value: '$128M', change: '+9%', trend: 'up' },
      { label: 'Avg Loan Size', value: '$24,500', change: '+2%', trend: 'up' },
      { label: 'Active Loans', value: '5,220', change: '+7%', trend: 'up' },
    ],
    table: {
      headers: ['Product', 'Balance', 'Count', 'Share'],
      rows: [
        ['Personal', 52000000, 2120, '40.6%'],
        ['Mortgage', 48000000, 1850, '37.5%'],
        ['Auto', 28000000, 1250, '21.9%'],
      ],
    },
  },
  // Loan Business – Risk
  {
    id: 'delinquency-npl',
    title: 'Delinquency & NPL',
    description: 'Days past due and non-performing loans.',
    category: 'Risk',
    group: 'business',
    metrics: [
      { label: '30+ DPD', value: '2.1%', change: '-0.3%', trend: 'up' },
      { label: '90+ DPD', value: '0.8%', change: '-0.1%', trend: 'up' },
      { label: 'NPL Ratio', value: '1.2%', change: '-0.1%', trend: 'up' },
    ],
    table: {
      headers: ['Bucket', 'Count', 'Balance', '% of Book'],
      rows: [
        ['Current', 5100, 126400000, '98.8%'],
        ['30-59 DPD', 85, 1340000, '1.0%'],
        ['60-89 DPD', 25, 420000, '0.3%'],
        ['90+ DPD', 10, 200000, '0.2%'],
      ],
    },
  },
  {
    id: 'concentration',
    title: 'Portfolio Concentration',
    description: 'Exposure by segment, product, and geography.',
    category: 'Risk',
    group: 'business',
    metrics: [
      { label: 'Top Product Share', value: '40.6%', change: '-0.5%', trend: 'up' },
      { label: 'Top Region Share', value: '35%', change: '0%', trend: undefined },
      { label: 'Max Single Borrower', value: '0.8%', change: '0%', trend: undefined },
    ],
  },
  // Loan Business – Revenue
  {
    id: 'revenue-margins',
    title: 'Revenue & Margins',
    description: 'Interest income, fees, and net margins.',
    category: 'Revenue',
    group: 'business',
    metrics: [
      { label: 'Interest Income', value: '$4.2M', change: '+7%', trend: 'up' },
      { label: 'Fees', value: '$0.8M', change: '+4%', trend: 'up' },
      { label: 'Net Margin', value: '34%', change: '+2%', trend: 'up' },
    ],
    table: {
      headers: ['Product', 'Interest', 'Fees', 'Margin'],
      rows: [
        ['Personal', 1680000, 320000, '36%'],
        ['Mortgage', 1920000, 280000, '32%'],
        ['Auto', 600000, 200000, '34%'],
      ],
    },
  },
  // Loan Business – Compliance
  {
    id: 'compliance-status',
    title: 'Compliance Status',
    description: 'Regulatory and policy compliance overview.',
    category: 'Compliance',
    group: 'business',
    metrics: [
      { label: 'Open Items', value: '3', change: '-2', trend: 'up' },
      { label: 'Audit Ready', value: 'Yes', change: undefined, trend: undefined },
      { label: 'Last Review', value: 'Jan 2025', change: undefined, trend: undefined },
    ],
  },
  // Loan Business – Overview
  {
    id: 'executive-summary',
    title: 'Executive Summary',
    description: 'Key loan business and process metrics at a glance.',
    category: 'Overview',
    group: 'business',
    metrics: [
      { label: 'Portfolio Size', value: '$128M', change: '+9%', trend: 'up' },
      { label: 'Delinquency', value: '2.1%', change: '-0.3%', trend: 'up' },
      { label: 'NPL Ratio', value: '1.2%', change: '-0.1%', trend: 'up' },
      { label: 'Revenue YTD', value: '$5.0M', change: '+6%', trend: 'up' },
    ],
  },
]

export function getReports(): Report[] {
  return reports
}

export function getReportsByGroup(group: ReportGroup): Report[] {
  return reports.filter((r) => r.group === group)
}

export function getReportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id)
}

export function getCategories(group?: ReportGroup): string[] {
  const list = group ? reports.filter((r) => r.group === group) : reports
  const cats = [...new Set(list.map((r) => r.category))]
  return cats.sort()
}
