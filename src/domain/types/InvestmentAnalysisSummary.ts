import type { InvestmentHealth } from './InvestmentHealth'
import type { Recommendation } from './Recommendation'

export type InvestmentAnalysisSummary = {
  readonly sessionId: string
  readonly generatedAt: Date
  readonly totalValue: number
  readonly cash: number
  readonly investedValue: number
  readonly cashReserveRatio: number
  readonly expectedAnnualDividend?: number
  readonly expectedMonthlyDividend?: number
  readonly dividendYield?: number
  readonly ruleScore: number
  readonly health: InvestmentHealth
  readonly passedRules: number
  readonly failedRules: number
  readonly warningRules: number
  readonly recommendationCount: number
  readonly topRecommendation?: Recommendation
  readonly insightCount: number
}
