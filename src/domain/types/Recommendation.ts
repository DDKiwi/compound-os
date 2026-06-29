import type { RecommendationSeverity } from './RecommendationSeverity'

export type RecommendationConfidence = 'low' | 'medium' | 'high'

export type Recommendation = {
  readonly id: string
  readonly ruleId: string
  readonly title: string
  readonly message: string
  readonly severity: RecommendationSeverity
  readonly confidence: RecommendationConfidence
  readonly expectedImpact: string
  readonly details?: readonly string[]
}
