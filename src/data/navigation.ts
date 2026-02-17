export interface SubSegment {
  id: string
  name: string
  reportIds: string[]
}

export interface Segment {
  id: string
  name: string
  subSegments: SubSegment[]
}

export const segments: Segment[] = [
  {
    id: 'business-dashboard',
    name: 'Business Dashboard',
    subSegments: [
      {
        id: 'business-health',
        name: 'Business Health',
        reportIds: [
          'business-health-metrics',
          'lending-ratios',
          'highest-lowest-performers',
        ],
      },
      {
        id: 'audience-overview',
        name: 'Audience Overview',
        reportIds: [
          'active-customers',
          'customer-distribution',
          'customer-segments',
        ],
      },
      {
        id: 'disbursement-overview',
        name: 'Disbursement Overview',
        reportIds: [
          'disbursement-metrics',
          'eligibility-band-distribution',
          'loan-limit-distribution',
        ],
      },
      {
        id: 'repayment-overview',
        name: 'Repayment Overview',
        reportIds: [
          'repayment-metrics',
          'collection-metrics',
          'npa-overview',
          'repayment-by-status',
          'repayment-by-due-bands',
        ],
      },
    ],
  },
  {
    id: 'banking-hygiene',
    name: 'Banking Reports & Hygiene',
    subSegments: [
      {
        id: 'banking-reports',
        name: 'Banking Reports',
        reportIds: [
          'accounting-entries',
          'pl-statement',
          'trial-balance',
          'balance-sheet',
        ],
      },
      {
        id: 'hygiene',
        name: 'Hygiene',
        reportIds: [
          'disbursement-reconciliation',
          'repayment-reconciliation',
        ],
      },
    ],
  },
  {
    id: 'marketing-audience',
    name: 'Marketing & Audience Intelligence',
    subSegments: [
      {
        id: 'marketing-analytics',
        name: 'Marketing Analytics',
        reportIds: [
          'channel-analysis',
          'campaign-performance',
          'channel-metrics',
        ],
      },
      {
        id: 'audience-intelligence',
        name: 'Audience Intelligence Analysis',
        reportIds: [
          'customer-comparison',
          'geography-insights',
          'base-eligible-active',
        ],
      },
    ],
  },
  {
    id: 'disbursement',
    name: 'Disbursement',
    subSegments: [
      {
        id: 'funnel-analysis',
        name: 'Funnel Analysis',
        reportIds: [
          'funnel-metrics',
          'funnel-by-stage',
        ],
      },
      {
        id: 'loan-product-analysis',
        name: 'Loan Product Wise Analysis',
        reportIds: [
          'disbursement-by-product',
          'disbursement-by-age',
          'disbursement-by-occupation',
          'disbursement-by-geography',
        ],
      },
      {
        id: 'impact-analysis',
        name: 'Impact Analysis',
        reportIds: [
          'repeat-customers',
          'repeat-by-product',
          'repeat-by-customer-type',
          'repeat-by-region',
        ],
      },
    ],
  },
  {
    id: 'repayment',
    name: 'Repayment',
    subSegments: [
      {
        id: 'collection-analysis',
        name: 'Loan Product Wise Analysis - Collection',
        reportIds: [
          'collection-by-product',
          'collection-by-segment',
          'collection-by-geography',
          'collection-by-customer-attributes',
        ],
      },
      {
        id: 'risk-analysis',
        name: 'Loan Product Wise Analysis - Risk',
        reportIds: [
          'risk-by-product',
          'risk-classification',
          'npa-by-product',
          'write-off-analysis',
        ],
      },
    ],
  },
]

export function getSegmentById(id: string): Segment | undefined {
  return segments.find((s) => s.id === id)
}

export function getSubSegmentById(segmentId: string, subSegmentId: string): SubSegment | undefined {
  const segment = getSegmentById(segmentId)
  return segment?.subSegments.find((s) => s.id === subSegmentId)
}
