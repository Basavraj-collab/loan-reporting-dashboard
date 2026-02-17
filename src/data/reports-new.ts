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
    description: 'Key KPIs across disbursement, repayment, yield, NPA, and default.',
    segmentId: 'business-dashboard',
    subSegmentId: 'business-health',
    metrics: [
      { label: 'Disbursement', value: '$24.2M', change: '+9%', trend: 'up' },
      { label: 'Repayment rate', value: '94.2%', change: '+1.2%', trend: 'up' },
      { label: 'Collection', value: '$23.4M', change: '+8%', trend: 'up' },
      { label: 'Yield', value: '12.5%', change: '+0.3%', trend: 'up' },
      { label: 'NPA', value: '1.2%', change: '-0.1%', trend: 'up' },
      { label: 'Default rate', value: '0.6%', change: '-0.1%', trend: 'up' },
    ],
  },
  {
    id: 'lending-ratios',
    title: 'Lending Ratios',
    description: 'Key lending ratios including funds available, sanction ratio, and collection efficiency.',
    segmentId: 'business-dashboard',
    subSegmentId: 'business-health',
    metrics: [
      { label: 'Funds available', value: '$32.5M', change: '+4%', trend: 'up' },
      { label: 'Sanction ratio', value: '78.3%', change: '+1.1%', trend: 'up' },
      { label: 'Collection efficiency', value: '96.8%', change: '+0.8%', trend: 'up' },
      { label: 'Disbursal to Fund', value: '1.15x', change: '+0.05', trend: 'up' },
      { label: 'Utilization Rate', value: '87%', change: '+3%', trend: 'up' },
    ],
  },
  {
    id: 'highest-lowest-performers',
    title: 'Performance distribution',
    description: 'High / low performing products, regions, and customer cohorts across key metrics.',
    segmentId: 'business-dashboard',
    subSegmentId: 'business-health',
    metrics: [
      { label: 'Disbursement – top product', value: 'Flexi Loan', clickable: true, linkTo: 'popup:disb-top-product' },
      { label: 'Disbursement – low product', value: 'Education Loan', clickable: true, linkTo: 'popup:disb-low-product' },
      { label: 'Disbursement – top region', value: 'North', clickable: true, linkTo: 'popup:disb-top-region' },
      { label: 'NPA – high product', value: 'Personal Loan', clickable: true, linkTo: 'popup:npa-high-product' },
      { label: 'Collection – low region', value: 'West', clickable: true, linkTo: 'popup:collection-low-region' },
      { label: 'Yield – top customer age', value: '30–40', clickable: true, linkTo: 'popup:yield-top-age' },
      { label: 'Yield – top occupation', value: 'Salaried', clickable: true, linkTo: 'popup:yield-top-occupation' },
    ],
    rawData: {
      headers: [
        'Loan ID',
        'MSISDN',
        'Product',
        'Region',
        'Customer age',
        'Gender',
        'Occupation',
        'Disbursement amount',
        'Outstanding',
        'NPA flag',
        'Collection rate',
        'Yield',
      ],
      rows: [
        ['LN-10001', '9876543210', 'Flexi Loan', 'North', '32', 'Male', 'Salaried', 250000, 210000, 'No', '98.5%', '13.2%'],
        ['LN-10002', '9876543211', 'Personal Loan', 'South', '45', 'Female', 'Self Employed', 180000, 172000, 'Yes', '82.1%', '11.8%'],
        ['LN-10003', '9876543212', 'Education Loan', 'West', '27', 'Male', 'Student', 120000, 118000, 'No', '76.5%', '10.2%'],
        ['LN-10004', '9876543213', 'Flexi Loan', 'East', '38', 'Female', 'Salaried', 300000, 294000, 'No', '97.2%', '13.8%'],
        ['LN-10005', '9876543214', 'Personal Loan', 'North', '29', 'Male', 'Business', 220000, 215000, 'Yes', '88.4%', '12.4%'],
      ],
    },
  },
  // Business Dashboard - Audience Overview
  {
    id: 'active-customers',
    title: 'Active Customers',
    description: 'Active users with split across new, existing, and resurrected users.',
    segmentId: 'business-dashboard',
    subSegmentId: 'audience-overview',
    metrics: [
      { label: 'Active users', value: '5,220', change: '+7%', trend: 'up' },
      { label: 'New', value: '1,120', change: '+12%', trend: 'up' },
      { label: 'Existing', value: '3,540', change: '+5%', trend: 'up' },
      { label: 'Resurrected', value: '560', change: '+9%', trend: 'up' },
    ],
    table: {
      headers: ['User type', 'Count', 'Share of active', '30d resurrected', '60d resurrected', '90d+ resurrected'],
      rows: [
        ['Overall active', 5220, '100%', 220, 180, 160],
        ['New', 1120, '21.4%', 0, 0, 0],
        ['Existing', 3540, '67.8%', 0, 0, 0],
        ['Resurrected', 560, '10.7%', 220, 180, 160],
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
      { label: 'By age', value: '5,220', change: undefined, trend: undefined },
      { label: 'By gender', value: '5,220', change: undefined, trend: undefined },
      { label: 'By occupation', value: '5,220', change: undefined, trend: undefined },
      { label: 'By region', value: '5,220', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Attribute', 'Segment', 'Overall', 'New', 'Existing', 'Resurrected'],
      rows: [
        ['Age', '18–25', 620, 260, 260, 100],
        ['Age', '26–35', 2120, 520, 1350, 250],
        ['Age', '36–50', 1700, 260, 1270, 170],
        ['Age', '50+', 780, 80, 660, 40],
        ['Gender', 'Male', 2980, 640, 2120, 220],
        ['Gender', 'Female', 2240, 480, 1420, 340],
        ['Region', 'North', 1820, 360, 1220, 240],
        ['Region', 'South', 1560, 340, 1040, 180],
        ['Region', 'East', 980, 220, 640, 120],
        ['Region', 'West', 860, 200, 640, 20],
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
    description: 'Overall disbursement KPIs for the selected period.',
    segmentId: 'business-dashboard',
    subSegmentId: 'disbursement-overview',
    metrics: [
      { label: 'Disbursement', value: '$24.2M', change: '+9%', trend: 'up' },
      { label: 'Avg disbursement', value: '$20,500', change: '+3%', trend: 'up' },
      { label: '# of loans', value: '1,180', change: '+6%', trend: 'up' },
      { label: 'Unique customers', value: '940', change: '+4%', trend: 'up' },
    ],
    table: {
      headers: ['Product', '# of loans', 'Disbursement amount', 'Avg disbursement'],
      rows: [
        ['3 Month', 420, 8400000, 20000],
        ['6 Month', 480, 12000000, 25000],
        ['9 Month', 280, 8400000, 30000],
      ],
    },
  },
  {
    id: 'eligibility-band-distribution',
    title: 'Eligibility Band Distribution',
    description: 'Loan count and disbursement across eligibility usage bands.',
    segmentId: 'business-dashboard',
    subSegmentId: 'disbursement-overview',
    metrics: [
      { label: '0–20% eligibility used', value: '160', change: undefined, trend: undefined },
      { label: '20–50% eligibility used', value: '380', change: undefined, trend: undefined },
      { label: '50–80% eligibility used', value: '420', change: undefined, trend: undefined },
      { label: '80–100% eligibility used', value: '220', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Eligibility usage band', '# of loans', 'Disbursement amount', 'Avg disbursement'],
      rows: [
        ['0–20%', 160, 2600000, 16250],
        ['20–50%', 380, 7200000, 18950],
        ['50–80%', 420, 9800000, 23300],
        ['80–100%', 220, 6600000, 30000],
      ],
    },
  },
  {
    id: 'loan-limit-distribution',
    title: 'Loan Limit Distribution',
    description: 'Loan limits and utilization bands.',
    segmentId: 'business-dashboard',
    subSegmentId: 'disbursement-overview',
    metrics: [
      { label: '<$10K', value: '240', change: undefined, trend: undefined },
      { label: '$10K-$25K', value: '520', change: undefined, trend: undefined },
      { label: '$25K-$50K', value: '320', change: undefined, trend: undefined },
      { label: '>$50K', value: '100', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Loan limit band', '# of loans', 'Disbursement amount', 'Avg utilization'],
      rows: [
        ['<$10K', 240, 1800000, '74%'],
        ['$10K–$25K', 520, 9100000, '81%'],
        ['$25K–$50K', 320, 9800000, '86%'],
        ['>$50K', 100, 5200000, '89%'],
      ],
    },
  },
  // Business Dashboard - Repayment Overview
  {
    id: 'repayment-metrics',
    title: 'Repayment Metrics',
    description: 'High-level repayment and collection KPIs.',
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
    description: 'Repayment metrics split by loan status (open, closed) and due combinations.',
    segmentId: 'business-dashboard',
    subSegmentId: 'repayment-overview',
    metrics: [
      { label: 'Open Loans', value: '4,920', change: '+7%', trend: 'up' },
      { label: 'Closed Loans', value: '300', change: '+5%', trend: 'up' },
    ],
    table: {
      headers: ['Loan status', 'Due bucket', '# of loans', 'Repayment rate', 'Collection rate'],
      rows: [
        ['Open', 'No dues', 4320, '96.5%', '97.8%'],
        ['Open', '1 due', 320, '84.2%', '88.1%'],
        ['Open', '>1 due', 280, '72.4%', '79.6%'],
        ['Closed', 'No dues', 260, '100.0%', '100.0%'],
        ['Closed', '1 due before closure', 28, '100.0%', '100.0%'],
        ['Closed', '>1 due before closure', 12, '100.0%', '100.0%'],
      ],
    },
  },
  {
    id: 'repayment-by-due-bands',
    title: 'Repayment by Due Bands',
    description: 'Distribution of loans across due buckets.',
    segmentId: 'business-dashboard',
    subSegmentId: 'repayment-overview',
    metrics: [
      { label: 'Current', value: '4,900', change: undefined, trend: undefined },
      { label: '1-30 DPD', value: '120', change: undefined, trend: undefined },
      { label: '31-60 DPD', value: '85', change: undefined, trend: undefined },
      { label: '60+ DPD', value: '115', change: undefined, trend: undefined },
    ],
    table: {
      headers: ['Due bucket', '# of loans', 'Balance', 'Share of portfolio'],
      rows: [
        ['Current', 4900, 123800000, '98.1%'],
        ['1–30 DPD', 120, 1350000, '1.1%'],
        ['31–60 DPD', 85, 840000, '0.7%'],
        ['60+ DPD', 115, 760000, '0.6%'],
      ],
    },
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
    description: 'Overall base, eligible base, and active customers.',
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
    description: 'Geographic split of base, eligible, and active customers.',
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
    description: 'Counts of customer attributes across overall base, eligible base, and active customers.',
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
      { label: '3 Month', value: '420', change: '+8%', trend: 'up', clickable: true, linkTo: 'popup:disb-product' },
      { label: '6 Month', value: '480', change: '+5%', trend: 'up', clickable: true, linkTo: 'popup:disb-product' },
      { label: '9 Month', value: '280', change: '+3%', trend: 'up', clickable: true, linkTo: 'popup:disb-product' },
    ],
    table: {
      headers: ['Product', 'Count', 'Amount', 'Avg Size'],
      rows: [
        ['3 Month', 420, 8400000, 20000],
        ['6 Month', 480, 12000000, 25000],
        ['9 Month', 280, 8400000, 30000],
      ],
    },
    rawData: {
      headers: [
        'Loan ID',
        'MSISDN',
        'Product',
        'Region',
        'Customer age',
        'Gender',
        'Occupation',
        'Disbursement amount',
        'Disbursement date',
        'Eligibility used %',
      ],
      rows: [
        ['DL-20001', '9876500001', '3 Month', 'North', '29', 'Male', 'Salaried', 180000, '2025-01-05', '72%'],
        ['DL-20002', '9876500002', '3 Month', 'South', '33', 'Female', 'Self Employed', 220000, '2025-01-08', '64%'],
        ['DL-20003', '9876500003', '6 Month', 'East', '41', 'Male', 'Business', 260000, '2025-01-10', '81%'],
        ['DL-20004', '9876500004', '6 Month', 'West', '36', 'Female', 'Salaried', 280000, '2025-01-12', '88%'],
        ['DL-20005', '9876500005', '9 Month', 'North', '47', 'Male', 'Salaried', 320000, '2025-01-14', '93%'],
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
      { label: '25-30', value: '280', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:disb-age' },
      { label: '30-40', value: '420', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:disb-age' },
      { label: '40-50', value: '320', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:disb-age' },
      { label: '50+', value: '160', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:disb-age' },
    ],
    rawData: {
      headers: [
        'Loan ID',
        'MSISDN',
        'Product',
        'Region',
        'Customer age',
        'Gender',
        'Occupation',
        'Disbursement amount',
        'Disbursement date',
        'Eligibility used %',
      ],
      rows: [
        ['DL-20006', '9876500006', '3 Month', 'North', '27', 'Female', 'Salaried', 150000, '2025-01-03', '69%'],
        ['DL-20007', '9876500007', '6 Month', 'South', '34', 'Male', 'Business', 240000, '2025-01-07', '77%'],
        ['DL-20008', '9876500008', '9 Month', 'East', '42', 'Female', 'Self Employed', 310000, '2025-01-11', '85%'],
        ['DL-20009', '9876500009', '6 Month', 'West', '38', 'Male', 'Salaried', 265000, '2025-01-15', '91%'],
      ],
    },
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
      { label: 'North', value: '420', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:disb-region' },
      { label: 'South', value: '380', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:disb-region' },
      { label: 'East', value: '280', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:disb-region' },
      { label: 'West', value: '100', change: undefined, trend: undefined, clickable: true, linkTo: 'popup:disb-region' },
    ],
    rawData: {
      headers: [
        'Loan ID',
        'MSISDN',
        'Product',
        'Region',
        'Customer age',
        'Gender',
        'Occupation',
        'Disbursement amount',
        'Disbursement date',
        'Eligibility used %',
      ],
      rows: [
        ['DL-20100', '9876500100', '3 Month', 'North', '31', 'Male', 'Salaried', 210000, '2025-01-02', '78%'],
        ['DL-20101', '9876500101', '6 Month', 'South', '39', 'Female', 'Salaried', 255000, '2025-01-06', '82%'],
        ['DL-20102', '9876500102', '9 Month', 'East', '44', 'Male', 'Business', 330000, '2025-01-09', '88%'],
        ['DL-20103', '9876500103', '6 Month', 'West', '37', 'Female', 'Self Employed', 245000, '2025-01-13', '90%'],
      ],
    },
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
      { label: '3 Month Collection', value: '96.2%', change: '+0.8%', trend: 'up', clickable: true, linkTo: 'popup:collection-product' },
      { label: '6 Month Collection', value: '97.1%', change: '+0.5%', trend: 'up', clickable: true, linkTo: 'popup:collection-product' },
      { label: '9 Month Collection', value: '97.5%', change: '+0.3%', trend: 'up', clickable: true, linkTo: 'popup:collection-product' },
    ],
    rawData: {
      headers: [
        'Loan ID',
        'Product',
        'Region',
        'Customer age',
        'EMI amount',
        'Payment amount',
        'Principal component',
        'Interest component',
        'Due bucket',
        'Status',
      ],
      rows: [
        ['CL-30001', '3 Month', 'North', '30', 8500, 8500, 7300, 1200, 'Current', 'Open'],
        ['CL-30002', '3 Month', 'South', '42', 8200, 8200, 7000, 1200, 'Current', 'Open'],
        ['CL-30003', '6 Month', 'East', '37', 6500, 6500, 5200, 1300, '1–30 DPD', 'Open'],
        ['CL-30004', '6 Month', 'West', '45', 6700, 6700, 5400, 1300, 'Current', 'Open'],
        ['CL-30005', '9 Month', 'North', '39', 5200, 5200, 4100, 1100, '31–60 DPD', 'Open'],
      ],
    },
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
