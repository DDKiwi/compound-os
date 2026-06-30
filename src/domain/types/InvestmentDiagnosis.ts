import type { Insight } from './Insight'
import type { Recommendation } from './Recommendation'

export type InvestmentDiagnosis = {
  readonly strengths: readonly Insight[]
  readonly weaknesses: readonly Insight[]
  readonly opportunities: readonly Recommendation[]
}
