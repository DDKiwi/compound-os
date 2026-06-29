import type { InsightCategory } from './InsightCategory'
import type { InsightImportance } from './InsightImportance'

export type Insight = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly category: InsightCategory
  readonly importance: InsightImportance
}
