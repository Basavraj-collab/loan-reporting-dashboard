export interface Report {
  id: string
  title: string
  description: string
  segmentId: string
  subSegmentId: string
  metrics: { label: string; value: string; change?: string; trend?: 'up' | 'down'; clickable?: boolean; linkTo?: string }[]
  table?: { headers: string[]; rows: (string | number)[][] }
  rawData?: { headers: string[]; rows: (string | number)[][] } // For popup data
}

export const reports: Report[] = [
  // Business Dashboard - Business Health
  {
    id: 'business-health-metrics',
    title: 'Business Health Metrics',
    description: 'Key business health indicators including yield, revenue, NPA, and credit loss.',
    segmentId: 'business-dashboard',
    subSegmentId: 'business-health',
    metrics: [
      { label: 'Avg Disbursement', value: '$20,500', change: '+3%', trend: 'up', clickable: true, linkTo: '/segment/banking-hygiene/banking-reports' },
      { label: 'Yield', value: '12.5%', change: '+0.3%', trend: 'up', clickable: true, linkTo: '/segment/banking-hygiene/banking-reports' },
      { label: 'Revenue', value: '$5.0M', change: '+6%', trend: 'up', clickable: true, linkTo: '/segment/banking-hygiene/banking-reports' },
      { label: 'NPA', value: '1.2%', change: '-0.1%', trend: 'up', clickable: true, linkTo: '/segment/banking-hygiene/banking-reports' },
      { label: 'Credit Loss', value: '$1.2M', change: '-5%', trend: 'up', clickable: true, linkTo: '/segment/banking-hygiene/banking-reports' },
    ],
  },
  {
    id: 'lending-ratios',
    title: 'Lending Ratios',
    description: 'Key lending ratios including CASA, disbursal to fund ratio, and funds pending.',
    segmentId: 'business-dashboard',
    subSegmentId: 'business-health',
    metrics: [
      { label: 'CASA Ratio', value: '42%', change: '+2%', trend: 'up' },
      { label: 'Disbursal to Fund', value: '1.15x', change: '+0.05', trend: 'up' },
      { label: 'Funds Pending', value: '$8.5M', change: '-12%', trend: 'up' },
      { label: 'Utilization Rate', value: '87%', change: '+3%', trend: 'up' },
    ],
  },
  {
    id: 'highest-lowest-performers',
    title: 'Highest & Lowest Performers',
    description: 'Top and bottom performers by age group, region, and product.',
    segmentId: 'business-dashboard',
    subSegmentId: 'business-health',
    metrics: [
      { label: 'Highest Region', value: 'North', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:highest-region' },
      { label: 'Lowest Region', value: 'South', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:lowest-region' },
      { label: 'Highest Age Group', value: '30-40', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:highest-age' },
      { label: 'Lowest Age Group', value: '50+', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:lowest-age' },
      { label: 'Highest Product', value: 'Personal', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:highest-product' },
    ],
    rawData: {
      headers: ['Region', 'Disbursement', 'Revenue', 'NPA', 'Performance Score'],
      rows: [
        ['North', 52000000, 2100000, '0.8%', 92],
        ['South', 38000000, 1500000, '1.5%', 78],
        ['East', 28000000, 1100000, '1.2%', 85],
        ['West', 10000000, 400000, '2.1%', 65],
      ],
    },
  },
  // Business Dashboard - Audience Overview
  {
    id: 'active-customers',
    title: 'Active Customers',
    description: 'Number and distribution of active customers who have taken loans.',
    segmentId: 'business-dashboard',
    subSegmentId: 'audience-overview',
    metrics: [
      { label: 'Total Active', value: '5,220', change: '+7%', trend: 'up' },
      { label: 'New This Month', value: '420', change: '+12%', trend: 'up' },
      { label: 'Repeat Customers', value: '1,850', change: '+8%', trend: 'up' },
    ],
    table: {
      headers: ['Segment', 'Count', 'Share', 'Growth'],
      rows: [
        ['Personal Loan', 2120, '40.6%', '+11%'],
        ['Mortgage', 1850, '35.4%', '+7%'],
        ['Auto', 1250, '24.0%', '+8%'],
      ],
    },
  },
  {
    id: 'customer-distribution',
    title: 'Customer Distribution',
    description: 'Distribution of active customers by various attributes.',
    segmentId: 'business-dashboard',
    subSegmentId: 'audience-overview',
    metrics: [
      { label: 'By Age Group', value: '5,220', change: undefined, trend: undefined },
      { label: 'By Region', value: '5,220', change: undefined, trend: undefined },
      { label: 'By Product', value: '5,220', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Attribute', 'Value', 'Count', 'Share'],
      rows: [
        ['Age', '25-30', 1200, '23%'],
        ['Age', '30-40', 1850, '35%'],
        ['Age', '40-50', 1420, '27%'],
        ['Age', '50+', 750, '15%'],
      ],
    },
  },
  {
    id: 'customer-segments',
    title: 'Customer Segments',
    description: 'Active customer segmentation analysis.',
    segmentId: 'business-dashboard',
    subSegmentId: 'audience-overview',
    metrics: [
      { label: 'Prime', value: '3,120', change: '+5%', trend: 'up' },
      { label: 'Near Prime', value: '1,680', change: '+8%', trend: 'up' },
      { label: 'Subprime', value: '420', change: '+2%', trend: 'up' },
    ],
  },
  // Business Dashboard - Disbursement Overview
  {
    id: 'disbursement-metrics',
    title: 'Disbursement Metrics',
    description: 'All disbursement related metrics.',
    segmentId: 'business-dashboard',
    subSegmentId: 'disbursement-overview',
    metrics: [
      { label: 'MTD Disbursed', value: '$24.2M', change: '+9%', trend: 'up' },
      { label: 'Loans Count', value: '1,180', change: '+6%', trend: 'up' },
      { label: 'Avg Ticket', value: '$20,500', change: '+3%', trend: 'up' },
    ],
  },
  {
    id: 'eligibility-band-distribution',
    title: 'Eligibility Band Distribution',
    description: 'Distribution by customer eligibility limit usage.',
    segmentId: 'business-dashboard',
    subSegmentId: 'disbursement-overview',
    metrics: [
      { label: '0-40% Used', value: '180', change: undefined, trend: undefined },
      { label: '40-60% Used', value: '360', change: undefined, trend: undefined },
      { label: '60-80% Used', value: '420', change: undefined, trend: undefined },
      { label: '80-100% Used', value: '220', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Eligibility Band', 'Loan Count', 'Share', 'Avg Loan Size'],
      rows: [
        ['0-40%', 180, '15.3%', 18500],
        ['40-60%', 360, '30.5%', 20500],
        ['60-80%', 420, '35.6%', 22500],
        ['80-100%', 220, '18.6%', 24500],
      ],
    },
  },
  {
    id: 'loan-limit-distribution',
    title: 'Loan Limit Distribution',
    description: 'Distribution by loan limit bands.',
    segmentId: 'business-dashboard',
    subSegmentId: 'disbursement-overview',
    metrics: [
      { label: '<$10K', value: '240', change: undefined, trend: undefined },
      { label: '$10K-$25K', value: '520', change: undefined, trend: undefined },
      { label: '$25K-$50K', value: '320', change: undefined, trend: undefined },
      { label: '>$50K', value: '100', change: undefined, trend: undefined },
    ],
  },
  // Business Dashboard - Repayment Overview
  {
    id: 'repayment-metrics',
    title: 'Repayment Metrics',
    description: 'Repayment rate and collection metrics.',
    segmentId: 'business-dashboard',
    subSegmentId: 'repayment-overview',
    metrics: [
      { label: 'Repayment Rate', value: '94.2%', change: '+1.2%', trend: 'up' },
      { label: 'Collection Rate', value: '96.8%', change: '+0.8%', trend: 'up' },
      { label: 'NPA', value: '1.2%', change: '-0.1%', trend: 'up' },
    ],
  },
  {
    id: 'collection-metrics',
    title: 'Collection Metrics',
    description: 'Collection performance indicators.',
    segmentId: 'business-dashboard',
    subSegmentId: 'repayment-overview',
    metrics: [
      { label: 'Collection Efficiency', value: '96.8%', change: '+0.8%', trend: 'up' },
      { label: 'Avg Collection Days', value: '2.1', change: '-0.2', trend: 'up' },
      { label: 'Overdue Amount', value: '$1.5M', change: '-8%', trend: 'up' },
    ],
  },
  {
    id: 'npa-overview',
    title: 'NPA Overview',
    description: 'Non-performing assets overview.',
    segmentId: 'business-dashboard',
    subSegmentId: 'repayment-overview',
    metrics: [
      { label: 'NPL Ratio', value: '1.2%', change: '-0.1%', trend: 'up' },
      { label: 'NPA Amount', value: '$1.54M', change: '-5%', trend: 'up' },
      { label: 'Provision Coverage', value: '1.1x', change: '+0.05', trend: 'up' },
    ],
  },
  {
    id: 'repayment-by-status',
    title: 'Repayment by Loan Status',
    description: 'Repayment metrics split by loan status (open, closed).',
    segmentId: 'business-dashboard',
    subSegmentId: 'repayment-overview',
    metrics: [
      { label: 'Open Loans', value: '4,920', change: '+7%', trend: 'up' },
      { label: 'Closed Loans', value: '300', change: '+5%', trend: 'up' },
    ],
    table: {
      headers: ['Status', 'Count', 'Repayment Rate', 'Avg Balance'],
      rows: [
        ['Open', 4920, '94.5%', 24500],
        ['Closed', 300, '100%', 0],
      ],
    },
  },
  {
    id: 'repayment-by-due-bands',
    title: 'Repayment by Due Bands',
    description: 'Repayment metrics by number of dues bands.',
    segmentId: 'business-dashboard',
    subSegmentId: 'repayment-overview',
    metrics: [
      { label: 'Current', value: '4,900', change: undefined, trend: undefined },
      { label: '1-30 DPD', value: '120', change: undefined, trend: undefined },
      { label: '31-60 DPD', value: '85', change: undefined, trend: undefined },
      { label: '60+ DPD', value: '115', change: undefined, trend: undefined },
    ],
  },
  // Marketing & Audience Intelligence - Marketing Analytics
  {
    id: 'channel-analysis',
    title: 'Channel Analysis',
    description: 'Analysis by marketing channel.',
    segmentId: 'marketing-audience',
    subSegmentId: 'marketing-analytics',
    metrics: [
      { label: 'Digital', value: '41%', change: '+3%', trend: 'up' },
      { label: 'Branch', value: '31%', change: '-1%', trend: 'down' },
      { label: 'Referral', value: '28%', change: '-2%', trend: 'down' },
    ],
    table: {
      headers: ['Channel', 'Applications', 'Share', 'Conversion'],
      rows: [
        ['Digital', 5100, '41%', '28.1%'],
        ['Branch', 3860, '31%', '30.7%'],
        ['Referral', 3490, '28%', '25.0%'],
      ],
    },
  },
  {
    id: 'campaign-performance',
    title: 'Campaign Performance',
    description: 'Campaign metrics and performance.',
    segmentId: 'marketing-audience',
    subSegmentId: 'marketing-analytics',
    metrics: [
      { label: 'Total Campaigns', value: '24', change: '+2', trend: 'up' },
      { label: 'Active Campaigns', value: '12', change: '+1', trend: 'up' },
      { label: 'Avg ROI', value: '3.2x', change: '+12%', trend: 'up' },
    ],
  },
  {
    id: 'channel-metrics',
    title: 'Channel Metrics',
    description: 'Detailed channel performance metrics.',
    segmentId: 'marketing-audience',
    subSegmentId: 'marketing-analytics',
    metrics: [
      { label: 'Digital ROI', value: '3.5x', change: '+15%', trend: 'up' },
      { label: 'Branch ROI', value: '2.8x', change: '+8%', trend: 'up' },
      { label: 'Referral ROI', value: '3.1x', change: '+5%', trend: 'up' },
    ],
  },
  // Marketing & Audience Intelligence - Audience Intelligence
  {
    id: 'customer-comparison',
    title: 'Customer Comparison',
    description: 'Comparisons of customers across base, eligible, and active.',
    segmentId: 'marketing-audience',
    subSegmentId: 'audience-intelligence',
    metrics: [
      { label: 'Base Customers', value: '45,200', change: undefined, trend: undefined },
      { label: 'Eligible', value: '28,500', change: undefined, trend: undefined },
      { label: 'Active', value: '5,220', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Segment', 'Count', 'Conversion Rate'],
      rows: [
        ['Base to Eligible', 28500, '63.1%'],
        ['Eligible to Active', 5220, '18.3%'],
        ['Base to Active', 5220, '11.5%'],
      ],
    },
  },
  {
    id: 'geography-insights',
    title: 'Geography Insights',
    description: 'Geographic insights across base, eligible, and active customers.',
    segmentId: 'marketing-audience',
    subSegmentId: 'audience-intelligence',
    metrics: [
      { label: 'North Share', value: '35%', change: undefined, trend: undefined },
      { label: 'South Share', value: '30%', change: undefined, trend: undefined },
      { label: 'East Share', value: '22%', change: undefined, trend: undefined },
      { label: 'West Share', value: '13%', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'base-eligible-active',
    title: 'Base vs Eligible vs Active',
    description: 'Detailed breakdown of base, eligible, and active customers.',
    segmentId: 'marketing-audience',
    subSegmentId: 'audience-intelligence',
    metrics: [
      { label: 'Base', value: '45,200', change: '+8%', trend: 'up' },
      { label: 'Eligible', value: '28,500', change: '+6%', trend: 'up' },
      { label: 'Active', value: '5,220', change: '+7%', trend: 'up' },
    ],
  },
  // Banking Reports & Hygiene - Banking Reports
  {
    id: 'accounting-entries',
    title: 'Accounting Entries',
    description: 'Accounting entries report.',
    segmentId: 'banking-hygiene',
    subSegmentId: 'banking-reports',
    metrics: [
      { label: 'Total Entries', value: '12,450', change: undefined, trend: undefined },
      { label: 'Debit', value: '$128M', change: undefined, trend: undefined },
      { label: 'Credit', value: '$128M', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Date', 'Account', 'Debit', 'Credit'],
      rows: [
        ['2025-01-15', 'Loan Disbursement', 2400000, 0],
        ['2025-01-15', 'Cash', 0, 2400000],
        ['2025-01-16', 'Interest Income', 0, 42000],
        ['2025-01-16', 'Revenue', 42000, 0],
      ],
    },
  },
  {
    id: 'pl-statement',
    title: 'P&L Statement',
    description: 'Profit and Loss statement.',
    segmentId: 'banking-hygiene',
    subSegmentId: 'banking-reports',
    metrics: [
      { label: 'Revenue', value: '$5.0M', change: '+6%', trend: 'up' },
      { label: 'Expenses', value: '$3.3M', change: '+4%', trend: 'up' },
      { label: 'Net Profit', value: '$1.7M', change: '+9%', trend: 'up' },
    ],
    table: {
      headers: ['Item', 'Amount'],
      rows: [
        ['Interest Income', 4200000],
        ['Fees', 800000],
        ['Operating Expenses', 2500000],
        ['Provision', 800000],
        ['Net Profit', 1700000],
      ],
    },
  },
  {
    id: 'trial-balance',
    title: 'Trial Balance',
    description: 'Trial balance report.',
    segmentId: 'banking-hygiene',
    subSegmentId: 'banking-reports',
    metrics: [
      { label: 'Total Debit', value: '$128M', change: undefined, trend: undefined },
      { label: 'Total Credit', value: '$128M', change: undefined, trend: undefined },
      { label: 'Balance', value: '$0', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'balance-sheet',
    title: 'Balance Sheet',
    description: 'Balance sheet report.',
    segmentId: 'banking-hygiene',
    subSegmentId: 'banking-reports',
    metrics: [
      { label: 'Assets', value: '$128M', change: '+9%', trend: 'up' },
      { label: 'Liabilities', value: '$95M', change: '+8%', trend: 'up' },
      { label: 'Equity', value: '$33M', change: '+12%', trend: 'up' },
    ],
  },
  // Banking Reports & Hygiene - Hygiene
  {
    id: 'disbursement-reconciliation',
    title: 'Disbursement Reconciliation',
    description: 'Disbursement reconciliation report.',
    segmentId: 'banking-hygiene',
    subSegmentId: 'hygiene',
    metrics: [
      { label: 'Matched', value: '1,175', change: undefined, trend: undefined },
      { label: 'Unmatched', value: '5', change: '-2', trend: 'up' },
      { label: 'Match Rate', value: '99.6%', change: '+0.2%', trend: 'up' },
    ],
  },
  {
    id: 'repayment-reconciliation',
    title: 'Repayment Reconciliation',
    description: 'Repayment reconciliation report.',
    segmentId: 'banking-hygiene',
    subSegmentId: 'hygiene',
    metrics: [
      { label: 'Matched', value: '4,890', change: undefined, trend: undefined },
      { label: 'Unmatched', value: '30', change: '-5', trend: 'up' },
      { label: 'Match Rate', value: '99.4%', change: '+0.1%', trend: 'up' },
    ],
  },
  // Disbursement - Funnel Analysis
  {
    id: 'funnel-metrics',
    title: 'Funnel Metrics',
    description: 'Funnel analysis metrics.',
    segmentId: 'disbursement',
    subSegmentId: 'funnel-analysis',
    metrics: [
      { label: 'Leads', value: '45,200', change: '+8%', trend: 'up' },
      { label: 'Applications', value: '12,450', change: '+5%', trend: 'up' },
      { label: 'Approved', value: '8,920', change: '+7%', trend: 'up' },
      { label: 'Disbursed', value: '1,180', change: '+6%', trend: 'up' },
    ],
  },
  {
    id: 'funnel-by-stage',
    title: 'Funnel by Stage',
    description: 'Funnel breakdown by stage.',
    segmentId: 'disbursement',
    subSegmentId: 'funnel-analysis',
    metrics: [
      { label: 'Lead to App', value: '27.5%', change: '-0.8%', trend: 'down' },
      { label: 'App to Approved', value: '71.6%', change: '+1.2%', trend: 'up' },
      { label: 'Approved to Disbursed', value: '13.2%', change: '-0.5%', trend: 'down' },
    ],
    table: {
      headers: ['Stage', 'Count', 'Conversion'],
      rows: [
        ['Leads', 45200, '100%'],
        ['Applications', 12450, '27.5%'],
        ['Approved', 8920, '71.6%'],
        ['Disbursed', 1180, '13.2%'],
      ],
    },
  },
  // Disbursement - Loan Product Wise Analysis
  {
    id: 'disbursement-by-product',
    title: 'Disbursement by Product',
    description: 'Disbursement metrics split across loan products (3, 6, 9 months).',
    segmentId: 'disbursement',
    subSegmentId: 'loan-product-analysis',
    metrics: [
      { label: '3 Month', value: '420', change: '+8%', trend: 'up' },
      { label: '6 Month', value: '480', change: '+5%', trend: 'up' },
      { label: '9 Month', value: '280', change: '+3%', trend: 'up' },
    ],
    table: {
      headers: ['Product', 'Count', 'Amount', 'Avg Size'],
      rows: [
        ['3 Month', 420, 8400000, 20000],
        ['6 Month', 480, 12000000, 25000],
        ['9 Month', 280, 8400000, 30000],
      ],
    },
  },
  {
    id: 'disbursement-by-age',
    title: 'Disbursement by Age',
    description: 'Disbursement split by customer age.',
    segmentId: 'disbursement',
    subSegmentId: 'loan-product-analysis',
    metrics: [
      { label: '25-30', value: '280', change: undefined, trend: undefined },
      { label: '30-40', value: '420', change: undefined, trend: undefined },
      { label: '40-50', value: '320', change: undefined, trend: undefined },
      { label: '50+', value: '160', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'disbursement-by-occupation',
    title: 'Disbursement by Occupation',
    description: 'Disbursement split by customer occupation.',
    segmentId: 'disbursement',
    subSegmentId: 'loan-product-analysis',
    metrics: [
      { label: 'Salaried', value: '680', change: undefined, trend: undefined },
      { label: 'Self Employed', value: '380', change: undefined, trend: undefined },
      { label: 'Business', value: '120', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'disbursement-by-geography',
    title: 'Disbursement by Geography',
    description: 'Disbursement split by geography.',
    segmentId: 'disbursement',
    subSegmentId: 'loan-product-analysis',
    metrics: [
      { label: 'North', value: '420', change: undefined, trend: undefined },
      { label: 'South', value: '380', change: undefined, trend: undefined },
      { label: 'East', value: '280', change: undefined, trend: undefined },
      { label: 'West', value: '100', change: undefined, trend: undefined },
    ],
  },
  // Disbursement - Impact Analysis
  {
    id: 'repeat-customers',
    title: 'Repeat Customers',
    description: 'Analysis of repeat customers leading to repeat business.',
    segmentId: 'disbursement',
    subSegmentId: 'impact-analysis',
    metrics: [
      { label: 'Repeat Count', value: '1,850', change: '+8%', trend: 'up' },
      { label: 'Avg Loan Size', value: '$24,500', change: '+3%', trend: 'up' },
      { label: 'Repeat Rate', value: '35.4%', change: '+1%', trend: 'up' },
    ],
  },
  {
    id: 'repeat-by-product',
    title: 'Repeat by Product',
    description: 'Repeat customers by product type.',
    segmentId: 'disbursement',
    subSegmentId: 'impact-analysis',
    metrics: [
      { label: '3 Month Repeat', value: '520', change: undefined, trend: undefined },
      { label: '6 Month Repeat', value: '680', change: undefined, trend: undefined },
      { label: '9 Month Repeat', value: '650', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'repeat-by-customer-type',
    title: 'Repeat by Customer Type',
    description: 'Repeat customers by customer type.',
    segmentId: 'disbursement',
    subSegmentId: 'impact-analysis',
    metrics: [
      { label: 'New to Repeat', value: '1,200', change: undefined, trend: undefined },
      { label: 'Existing Repeat', value: '650', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'repeat-by-region',
    title: 'Repeat by Region',
    description: 'Repeat customers by region.',
    segmentId: 'disbursement',
    subSegmentId: 'impact-analysis',
    metrics: [
      { label: 'North', value: '680', change: undefined, trend: undefined },
      { label: 'South', value: '520', change: undefined, trend: undefined },
      { label: 'East', value: '420', change: undefined, trend: undefined },
      { label: 'West', value: '230', change: undefined, trend: undefined },
    ],
  },
  // Repayment - Collection Analysis
  {
    id: 'collection-by-product',
    title: 'Collection by Product',
    description: 'Collection metrics for each product.',
    segmentId: 'repayment',
    subSegmentId: 'collection-analysis',
    metrics: [
      { label: '3 Month Collection', value: '96.2%', change: '+0.8%', trend: 'up' },
      { label: '6 Month Collection', value: '97.1%', change: '+0.5%', trend: 'up' },
      { label: '9 Month Collection', value: '97.5%', change: '+0.3%', trend: 'up' },
    ],
  },
  {
    id: 'collection-by-segment',
    title: 'Collection by Segment',
    description: 'Collection metrics across customer segments.',
    segmentId: 'repayment',
    subSegmentId: 'collection-analysis',
    metrics: [
      { label: 'Prime', value: '98.5%', change: undefined, trend: undefined },
      { label: 'Near Prime', value: '95.2%', change: undefined, trend: undefined },
      { label: 'Subprime', value: '92.1%', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'collection-by-geography',
    title: 'Collection by Geography',
    description: 'Collection metrics by geography.',
    segmentId: 'repayment',
    subSegmentId: 'collection-analysis',
    metrics: [
      { label: 'North', value: '97.2%', change: undefined, trend: undefined },
      { label: 'South', value: '96.5%', change: undefined, trend: undefined },
      { label: 'East', value: '96.8%', change: undefined, trend: undefined },
      { label: 'West', value: '95.1%', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'collection-by-customer-attributes',
    title: 'Collection by Customer Attributes',
    description: 'Collection metrics by customer attributes.',
    segmentId: 'repayment',
    subSegmentId: 'collection-analysis',
    metrics: [
      { label: 'By Age', value: '96.8%', change: undefined, trend: undefined },
      { label: 'By Occupation', value: '96.8%', change: undefined, trend: undefined },
      { label: 'By Income', value: '96.8%', change: undefined, trend: undefined },
    ],
  },
  // Repayment - Risk Analysis
  {
    id: 'risk-by-product',
    title: 'Risk by Product',
    description: 'Risk metrics for each product.',
    segmentId: 'repayment',
    subSegmentId: 'risk-analysis',
    metrics: [
      { label: '3 Month NPA', value: '0.8%', change: undefined, trend: undefined },
      { label: '6 Month NPA', value: '1.2%', change: undefined, trend: undefined },
      { label: '9 Month NPA', value: '1.5%', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'risk-classification',
    title: 'Risk Classification',
    description: 'Risk classification analysis.',
    segmentId: 'repayment',
    subSegmentId: 'risk-analysis',
    metrics: [
      { label: 'Low Risk', value: '4,200', change: undefined, trend: undefined },
      { label: 'Medium Risk', value: '820', change: undefined, trend: undefined },
      { label: 'High Risk', value: '200', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Risk Class', 'Count', 'NPA %', 'Provision'],
      rows: [
        ['Low', 4200, '0.5%', 105000],
        ['Medium', 820, '2.1%', 172200],
        ['High', 200, '8.5%', 170000],
      ],
    },
  },
  {
    id: 'npa-by-product',
    title: 'NPA by Product',
    description: 'Non-performing assets by product.',
    segmentId: 'repayment',
    subSegmentId: 'risk-analysis',
    metrics: [
      { label: '3 Month NPA', value: '$0.67M', change: undefined, trend: undefined },
      { label: '6 Month NPA', value: '$0.58M', change: undefined, trend: undefined },
      { label: '9 Month NPA', value: '$0.29M', change: undefined, trend: undefined },
    ],
  },
  {
    id: 'write-off-analysis',
    title: 'Write-off Analysis',
    description: 'Write-off analysis by product and segment.',
    segmentId: 'repayment',
    subSegmentId: 'risk-analysis',
    metrics: [
      { label: 'Total Write-offs', value: '$0.42M', change: '-12%', trend: 'up' },
      { label: 'Write-off Rate', value: '0.33%', change: '-0.05%', trend: 'up' },
      { label: 'Recovery Rate', value: '15%', change: '+2%', trend: 'up' },
    ],
  },
]

export function getReports(): Report[] {
  return reports
}

export function getReportById(id: string): Report | undefined {
  return reports.find((r) => r.id === id)
}

export function getReportsBySegment(segmentId: string): Report[] {
  return reports.filter((r) => r.segmentId === segmentId)
}

export function getReportsBySubSegment(segmentId: string, subSegmentId: string): Report[] {
  return reports.filter((r) => r.segmentId === segmentId && r.subSegmentId === subSegmentId)
}
