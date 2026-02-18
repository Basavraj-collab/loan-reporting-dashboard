/**
 * Product-wise report data: Disbursement, Collection, and Risk.
 * Used for Loan Product Wise Analysis views with bar-line charts, month/store tables, and dimension×metrics tables.
 */

// ---------- Shared types ----------
export interface BarLinePoint {
  monthYear: string
  count: number
  amount: number
}

export interface MonthYearMetricRow {
  monthYear: string
  [key: string]: string | number
}

export interface StoreMetricRow {
  storeName: string
  [key: string]: string | number
}

export interface DimensionMetricsRow {
  [dimensionKey: string]: string | number
}

export interface ProductWiseSectionData {
  productType: string
  barLineData: BarLinePoint[]
  monthYearTable: { headers: string[]; rows: MonthYearMetricRow[] }
  storeTable: { headers: string[]; rows: StoreMetricRow[] }
  dimensionMetrics: { dimensionHeaders: string[]; metricHeaders: string[]; rows: DimensionMetricsRow[] }
}

// ---------- Disbursement: product types and metrics ----------
export const DISBURSEMENT_PRODUCT_TYPES = ['3 Month', '6 Month', '9 Month'] as const

function disbursementBarLine(product: string): BarLinePoint[] {
  const base = product === '3 Month' ? [120, 135, 142, 138, 145, 152] : product === '6 Month' ? [95, 102, 108, 98, 105, 112] : [72, 78, 82, 75, 80, 85]
  const amountBase = product === '3 Month' ? 2.2 : product === '6 Month' ? 2.8 : 2.6
  return [
    { monthYear: 'Aug-24', count: base[0], amount: base[0] * amountBase * 10000 },
    { monthYear: 'Sep-24', count: base[1], amount: base[1] * amountBase * 10000 },
    { monthYear: 'Oct-24', count: base[2], amount: base[2] * amountBase * 10000 },
    { monthYear: 'Nov-24', count: base[3], amount: base[3] * amountBase * 10000 },
    { monthYear: 'Dec-24', count: base[4], amount: base[4] * amountBase * 10000 },
    { monthYear: 'Jan-25', count: base[5], amount: base[5] * amountBase * 10000 },
  ]
}

function disbursementMonthYearTable(product: string): { headers: string[]; rows: MonthYearMetricRow[] } {
  const rows: MonthYearMetricRow[] = [
    { monthYear: 'Aug-24', 'Disbursement count': 120, 'Disbursed amount (₹ L)': 26.4, 'Avg loan size (₹)': 22000 },
    { monthYear: 'Sep-24', 'Disbursement count': 135, 'Disbursed amount (₹ L)': 29.7, 'Avg loan size (₹)': 22000 },
    { monthYear: 'Oct-24', 'Disbursement count': 142, 'Disbursed amount (₹ L)': 31.2, 'Avg loan size (₹)': 22000 },
    { monthYear: 'Nov-24', 'Disbursement count': 138, 'Disbursed amount (₹ L)': 30.4, 'Avg loan size (₹)': 22000 },
    { monthYear: 'Dec-24', 'Disbursement count': 145, 'Disbursed amount (₹ L)': 31.9, 'Avg loan size (₹)': 22000 },
    { monthYear: 'Jan-25', 'Disbursement count': 152, 'Disbursed amount (₹ L)': 33.4, 'Avg loan size (₹)': 22000 },
  ]
  if (product === '6 Month') {
    rows.forEach((r, i) => {
      r['Disbursement count'] = [95, 102, 108, 98, 105, 112][i]
      r['Disbursed amount (₹ L)'] = Number((([95, 102, 108, 98, 105, 112][i] * 25000) / 100000).toFixed(1))
      r['Avg loan size (₹)'] = 25000
    })
  }
  if (product === '9 Month') {
    rows.forEach((r, i) => {
      r['Disbursement count'] = [72, 78, 82, 75, 80, 85][i]
      r['Disbursed amount (₹ L)'] = Number((([72, 78, 82, 75, 80, 85][i] * 30000) / 100000).toFixed(1))
      r['Avg loan size (₹)'] = 30000
    })
  }
  return {
    headers: ['Month-Year', 'Disbursement count', 'Disbursed amount (₹ L)', 'Avg loan size (₹)'],
    rows,
  }
}

function disbursementStoreTable(product: string): { headers: string[]; rows: StoreMetricRow[] } {
  const stores = ['Store North', 'Store South', 'Store East', 'Store West', 'Store Central']
  const counts = product === '3 Month' ? [320, 280, 240, 180, 120] : product === '6 Month' ? [260, 240, 200, 160, 100] : [180, 160, 140, 110, 80]
  const avgSize = product === '3 Month' ? 22000 : product === '6 Month' ? 25000 : 30000
  return {
    headers: ['Store', 'Disbursement count', 'Disbursed amount (₹ L)', 'Avg loan size (₹)'],
    rows: stores.map((s, i) => ({
      storeName: s,
      'Disbursement count': counts[i],
      'Disbursed amount (₹ L)': Number(((counts[i] * avgSize) / 100000).toFixed(1)),
      'Avg loan size (₹)': avgSize,
    })),
  }
}

function disbursementDimensionMetrics(product: string): ProductWiseSectionData['dimensionMetrics'] {
  return {
    dimensionHeaders: ['Customer age', 'Occupation', 'Region', 'User type'],
    metricHeaders: ['# of loans', 'Disbursed amount (₹ L)', 'Avg ticket (₹)'],
    rows: [
      { 'Customer age': '18–25', Occupation: 'Salaried', Region: 'North', 'User type': 'New', '# of loans': 85, 'Disbursed amount (₹ L)': 18.7, 'Avg ticket (₹)': 22000 },
      { 'Customer age': '26–35', Occupation: 'Salaried', Region: 'North', 'User type': 'Existing', '# of loans': 120, 'Disbursed amount (₹ L)': 26.4, 'Avg ticket (₹)': 22000 },
      { 'Customer age': '36–45', Occupation: 'Self Employed', Region: 'South', 'User type': 'New', '# of loans': 65, 'Disbursed amount (₹ L)': 14.3, 'Avg ticket (₹)': 22000 },
      { 'Customer age': '36–45', Occupation: 'Business', Region: 'East', 'User type': 'Existing', '# of loans': 42, 'Disbursed amount (₹ L)': 9.2, 'Avg ticket (₹)': 22000 },
      { 'Customer age': '46+', Occupation: 'Salaried', Region: 'West', 'User type': 'Existing', '# of loans': 58, 'Disbursed amount (₹ L)': 12.8, 'Avg ticket (₹)': 22000 },
    ],
  }
}

export function getDisbursementProductData(): ProductWiseSectionData[] {
  return DISBURSEMENT_PRODUCT_TYPES.map((productType) => ({
    productType,
    barLineData: disbursementBarLine(productType),
    monthYearTable: disbursementMonthYearTable(productType),
    storeTable: disbursementStoreTable(productType),
    dimensionMetrics: disbursementDimensionMetrics(productType),
  }))
}

// ---------- Collection: product types and metrics ----------
export const COLLECTION_PRODUCT_TYPES = ['3 Month', '6 Month', '9 Month'] as const

function collectionBarLine(product: string): BarLinePoint[] {
  const counts = product === '3 Month' ? [118, 125, 130, 128, 132, 138] : product === '6 Month' ? [92, 98, 102, 96, 100, 105] : [68, 74, 78, 72, 76, 82]
  const amounts = product === '3 Month' ? [25.2, 26.8, 27.9, 27.4, 28.5, 29.8] : product === '6 Month' ? [22.1, 23.5, 24.4, 23.0, 24.0, 25.2] : [19.2, 20.8, 21.8, 20.2, 21.4, 22.6]
  return counts.map((count, i) => ({ monthYear: ['Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25'][i], count, amount: amounts[i] * 100000 }))
}

function collectionMonthYearTable(product: string): { headers: string[]; rows: MonthYearMetricRow[] } {
  const rows: MonthYearMetricRow[] = [
    { monthYear: 'Aug-24', 'Collection count': 118, 'Collection amount (₹ L)': 25.2, 'Collection efficiency %': 96.2 },
    { monthYear: 'Sep-24', 'Collection count': 125, 'Collection amount (₹ L)': 26.8, 'Collection efficiency %': 96.8 },
    { monthYear: 'Oct-24', 'Collection count': 130, 'Collection amount (₹ L)': 27.9, 'Collection efficiency %': 97.1 },
    { monthYear: 'Nov-24', 'Collection count': 128, 'Collection amount (₹ L)': 27.4, 'Collection efficiency %': 97.0 },
    { monthYear: 'Dec-24', 'Collection count': 132, 'Collection amount (₹ L)': 28.5, 'Collection efficiency %': 97.2 },
    { monthYear: 'Jan-25', 'Collection count': 138, 'Collection amount (₹ L)': 29.8, 'Collection efficiency %': 97.5 },
  ]
  if (product === '6 Month') rows.forEach((r, i) => { r['Collection count'] = [92, 98, 102, 96, 100, 105][i]; r['Collection amount (₹ L)'] = [22.1, 23.5, 24.4, 23.0, 24.0, 25.2][i]; r['Collection efficiency %'] = 97.1 })
  if (product === '9 Month') rows.forEach((r, i) => { r['Collection count'] = [68, 74, 78, 72, 76, 82][i]; r['Collection amount (₹ L)'] = [19.2, 20.8, 21.8, 20.2, 21.4, 22.6][i]; r['Collection efficiency %'] = 97.5 })
  return { headers: ['Month-Year', 'Collection count', 'Collection amount (₹ L)', 'Collection efficiency %'], rows }
}

function collectionStoreTable(_product: string): { headers: string[]; rows: StoreMetricRow[] } {
  return {
    headers: ['Store', 'Collection count', 'Collection amount (₹ L)', 'Collection efficiency %'],
    rows: [
      { storeName: 'Store North', 'Collection count': 312, 'Collection amount (₹ L)': 68.2, 'Collection efficiency %': 97.2 },
      { storeName: 'Store South', 'Collection count': 278, 'Collection amount (₹ L)': 61.0, 'Collection efficiency %': 96.8 },
      { storeName: 'Store East', 'Collection count': 242, 'Collection amount (₹ L)': 53.1, 'Collection efficiency %': 96.5 },
      { storeName: 'Store West', 'Collection count': 188, 'Collection amount (₹ L)': 41.2, 'Collection efficiency %': 95.9 },
      { storeName: 'Store Central', 'Collection count': 120, 'Collection amount (₹ L)': 26.3, 'Collection efficiency %': 95.5 },
    ],
  }
}

function collectionDimensionMetrics(): ProductWiseSectionData['dimensionMetrics'] {
  return {
    dimensionHeaders: ['Customer age', 'Occupation', 'Region', 'User type'],
    metricHeaders: ['# of loans', 'Collection amount (₹ L)', 'Collection efficiency %'],
    rows: [
      { 'Customer age': '18–25', Occupation: 'Salaried', Region: 'North', 'User type': 'New', '# of loans': 82, 'Collection amount (₹ L)': 18.0, 'Collection efficiency %': 96.2 },
      { 'Customer age': '26–35', Occupation: 'Salaried', Region: 'North', 'User type': 'Existing', '# of loans': 118, 'Collection amount (₹ L)': 25.9, 'Collection efficiency %': 97.5 },
      { 'Customer age': '36–45', Occupation: 'Self Employed', Region: 'South', 'User type': 'New', '# of loans': 62, 'Collection amount (₹ L)': 13.6, 'Collection efficiency %': 95.8 },
      { 'Customer age': '36–45', Occupation: 'Business', Region: 'East', 'User type': 'Existing', '# of loans': 40, 'Collection amount (₹ L)': 8.8, 'Collection efficiency %': 96.8 },
      { 'Customer age': '46+', Occupation: 'Salaried', Region: 'West', 'User type': 'Existing', '# of loans': 56, 'Collection amount (₹ L)': 12.3, 'Collection efficiency %': 97.1 },
    ],
  }
}

export function getCollectionProductData(): ProductWiseSectionData[] {
  return COLLECTION_PRODUCT_TYPES.map((productType) => ({
    productType,
    barLineData: collectionBarLine(productType),
    monthYearTable: collectionMonthYearTable(productType),
    storeTable: collectionStoreTable(productType),
    dimensionMetrics: collectionDimensionMetrics(),
  }))
}

// ---------- Risk: product types and metrics ----------
export const RISK_PRODUCT_TYPES = ['3 Month', '6 Month', '9 Month'] as const

function riskBarLine(product: string): BarLinePoint[] {
  const counts = product === '3 Month' ? [3, 4, 2, 3, 2, 3] : product === '6 Month' ? [5, 6, 5, 4, 5, 6] : [4, 5, 4, 5, 4, 5]
  const amounts = product === '3 Month' ? [0.66, 0.88, 0.44, 0.66, 0.44, 0.66] : product === '6 Month' ? [0.58, 0.70, 0.58, 0.46, 0.58, 0.70] : [0.28, 0.35, 0.28, 0.35, 0.28, 0.35]
  return counts.map((count, i) => ({ monthYear: ['Aug-24', 'Sep-24', 'Oct-24', 'Nov-24', 'Dec-24', 'Jan-25'][i], count, amount: amounts[i] * 1000000 }))
}

function riskMonthYearTable(product: string): { headers: string[]; rows: MonthYearMetricRow[] } {
  const rows: MonthYearMetricRow[] = [
    { monthYear: 'Aug-24', 'NPA count': 3, 'NPA amount (₹ L)': 0.66, 'NPA %': 0.8 },
    { monthYear: 'Sep-24', 'NPA count': 4, 'NPA amount (₹ L)': 0.88, 'NPA %': 0.9 },
    { monthYear: 'Oct-24', 'NPA count': 2, 'NPA amount (₹ L)': 0.44, 'NPA %': 0.7 },
    { monthYear: 'Nov-24', 'NPA count': 3, 'NPA amount (₹ L)': 0.66, 'NPA %': 0.8 },
    { monthYear: 'Dec-24', 'NPA count': 2, 'NPA amount (₹ L)': 0.44, 'NPA %': 0.7 },
    { monthYear: 'Jan-25', 'NPA count': 3, 'NPA amount (₹ L)': 0.66, 'NPA %': 0.8 },
  ]
  if (product === '6 Month') rows.forEach((r, i) => { r['NPA count'] = [5, 6, 5, 4, 5, 6][i]; r['NPA amount (₹ L)'] = [0.58, 0.70, 0.58, 0.46, 0.58, 0.70][i]; r['NPA %'] = 1.2 })
  if (product === '9 Month') rows.forEach((r, i) => { r['NPA count'] = [4, 5, 4, 5, 4, 5][i]; r['NPA amount (₹ L)'] = [0.28, 0.35, 0.28, 0.35, 0.28, 0.35][i]; r['NPA %'] = 1.5 })
  return { headers: ['Month-Year', 'NPA count', 'NPA amount (₹ L)', 'NPA %'], rows }
}

function riskStoreTable(product: string): { headers: string[]; rows: StoreMetricRow[] } {
  return {
    headers: ['Store', 'NPA count', 'NPA amount (₹ L)', 'NPA %'],
    rows: [
      { storeName: 'Store North', 'NPA count': 4, 'NPA amount (₹ L)': 0.88, 'NPA %': 0.9 },
      { storeName: 'Store South', 'NPA count': 5, 'NPA amount (₹ L)': 1.10, 'NPA %': 1.1 },
      { storeName: 'Store East', 'NPA count': 3, 'NPA amount (₹ L)': 0.66, 'NPA %': 0.8 },
      { storeName: 'Store West', 'NPA count': 6, 'NPA amount (₹ L)': 1.32, 'NPA %': 1.3 },
      { storeName: 'Store Central', 'NPA count': 2, 'NPA amount (₹ L)': 0.44, 'NPA %': 0.7 },
    ],
  }
}

function riskDimensionMetrics(): ProductWiseSectionData['dimensionMetrics'] {
  return {
    dimensionHeaders: ['Customer age', 'Occupation', 'Region', 'User type'],
    metricHeaders: ['# of loans', 'NPA count', 'NPA amount (₹ L)', 'NPA %'],
    rows: [
      { 'Customer age': '18–25', Occupation: 'Salaried', Region: 'North', 'User type': 'New', '# of loans': 85, 'NPA count': 1, 'NPA amount (₹ L)': 0.22, 'NPA %': 0.6 },
      { 'Customer age': '26–35', Occupation: 'Salaried', Region: 'North', 'User type': 'Existing', '# of loans': 120, 'NPA count': 2, 'NPA amount (₹ L)': 0.44, 'NPA %': 0.8 },
      { 'Customer age': '36–45', Occupation: 'Self Employed', Region: 'South', 'User type': 'New', '# of loans': 65, 'NPA count': 2, 'NPA amount (₹ L)': 0.46, 'NPA %': 1.2 },
      { 'Customer age': '36–45', Occupation: 'Business', Region: 'East', 'User type': 'Existing', '# of loans': 42, 'NPA count': 1, 'NPA amount (₹ L)': 0.25, 'NPA %': 1.0 },
      { 'Customer age': '46+', Occupation: 'Salaried', Region: 'West', 'User type': 'Existing', '# of loans': 58, 'NPA count': 3, 'NPA amount (₹ L)': 0.66, 'NPA %': 1.4 },
    ],
  }
}

export function getRiskProductData(): ProductWiseSectionData[] {
  return RISK_PRODUCT_TYPES.map((productType) => ({
    productType,
    barLineData: riskBarLine(productType),
    monthYearTable: riskMonthYearTable(productType),
    storeTable: riskStoreTable(productType),
    dimensionMetrics: riskDimensionMetrics(),
  }))
}
