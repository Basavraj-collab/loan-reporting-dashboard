import { reports, getReportById } from './reports-new'
import { getSegmentById } from './navigation'

export interface ReportEntry {
  reportId: string
  title: string
  description: string
  segmentId: string
  subSegmentId: string
  segmentName: string
  subSegmentName: string
  topicId: string
  topicLabel: string
}

const SEGMENT_TO_TOPIC: Record<string, { id: string; label: string; description: string }> = {
  'business-dashboard': {
    id: 'business-health-kpis',
    label: 'Business health & KPIs',
    description: 'KPIs, ratios, and performance across business, audience, disbursement & repayment overview.',
  },
  'disbursement': {
    id: 'disbursement',
    label: 'Disbursement',
    description: 'Funnel analysis, loan product-wise metrics, and impact analysis.',
  },
  'repayment': {
    id: 'repayment-risk',
    label: 'Repayment & risk',
    description: 'Collection analysis, risk, NPA, and write-offs.',
  },
  'banking-hygiene': {
    id: 'banking-accounting',
    label: 'Banking & accounting',
    description: 'P&L, balance sheet, trial balance, and reconciliation.',
  },
  'marketing-audience': {
    id: 'marketing-audience',
    label: 'Marketing & audience',
    description: 'Channel analytics, campaign performance, and audience intelligence.',
  },
}

function getSegmentName(segmentId: string): string {
  return getSegmentById(segmentId)?.name ?? segmentId
}

function getSubSegmentName(segmentId: string, subSegmentId: string): string {
  const sub = getSegmentById(segmentId)?.subSegments.find((s) => s.id === subSegmentId)
  return sub?.name ?? subSegmentId
}

/** Flat list of all reports for search; each has topic and segment/sub names for matching. */
export function getReportListForSearch(): ReportEntry[] {
  return reports.map((r) => {
    const topic = SEGMENT_TO_TOPIC[r.segmentId] ?? { id: 'other', label: 'Other', description: 'Other reports' }
    return {
      reportId: r.id,
      title: r.title,
      description: r.description,
      segmentId: r.segmentId,
      subSegmentId: r.subSegmentId,
      segmentName: getSegmentName(r.segmentId),
      subSegmentName: getSubSegmentName(r.segmentId, r.subSegmentId),
      topicId: topic.id,
      topicLabel: topic.label,
    }
  })
}

export interface TopicGroup {
  topicId: string
  topicLabel: string
  topicDescription: string
  reports: ReportEntry[]
}

/** Topic groups for mega-menu; each topic has its report entries. */
export function getTopicGroups(): TopicGroup[] {
  const list = getReportListForSearch()
  const byTopic = new Map<string, ReportEntry[]>()
  for (const entry of list) {
    const arr = byTopic.get(entry.topicId) ?? []
    arr.push(entry)
    byTopic.set(entry.topicId, arr)
  }
  const order = [
    'business-health-kpis',
    'disbursement',
    'repayment-risk',
    'banking-accounting',
    'marketing-audience',
    'other',
  ]
  return order
    .filter((id) => byTopic.has(id))
    .map((topicId) => {
      const first = byTopic.get(topicId)![0]
      const meta = SEGMENT_TO_TOPIC[first.segmentId]
      return {
        topicId,
        topicLabel: first.topicLabel,
        topicDescription: meta?.description ?? 'Reports',
        reports: byTopic.get(topicId)!,
      }
    })
}

/** Search report list by query (title, description, segment/sub names). */
export function searchReports(query: string): ReportEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return getReportListForSearch()
  const list = getReportListForSearch()
  return list.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.segmentName.toLowerCase().includes(q) ||
      e.subSegmentName.toLowerCase().includes(q)
  )
}

export { getReportById }

const RECENT_STORAGE_KEY = 'reportPortal_recent'
const RECENT_MAX = 5

export interface RecentItem {
  segmentId: string
  subSegmentId: string
  label: string
}

export function loadRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(RECENT_STORAGE_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr.slice(0, RECENT_MAX) : []
  } catch {
    return []
  }
}

export function saveRecentItem(item: RecentItem) {
  const prev = loadRecent()
  const next = [
    item,
    ...prev.filter((r) => !(r.segmentId === item.segmentId && r.subSegmentId === item.subSegmentId)),
  ].slice(0, RECENT_MAX)
  try {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next))
  } catch {}
}
