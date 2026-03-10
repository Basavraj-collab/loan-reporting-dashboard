import { Layout } from './Layout'
import { getOption2Segments } from '../data/navigation'

interface Option2LayoutProps {
  children: React.ReactNode
}

/**
 * Option 2: Same structure as reports (Layout with sidebar navigation, segment/sub-segment, reports, raw-data popup).
 * Only differences: Marketing & Audience Intelligence segment removed;
 * under Business Dashboard, "Audience Overview" renamed to "Audience & Transaction".
 */
export function Option2Layout({ children }: Option2LayoutProps) {
  return <Layout segments={getOption2Segments()}>{children}</Layout>
}
