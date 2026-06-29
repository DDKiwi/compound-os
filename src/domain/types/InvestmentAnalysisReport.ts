import type { DividendForecast } from './DividendForecast'
import type { Insight } from './Insight'
import type { PortfolioAllocation } from './PortfolioAllocation'
import type { PortfolioMetrics } from './PortfolioMetrics'
import type { PortfolioSnapshot } from './PortfolioSnapshot'
import type { Recommendation } from './Recommendation'
import type { RuleResult } from './Rule'
import type { RuleSummary } from './RuleSummary'

export type InvestmentAnalysisReport = {
  readonly generatedAt: Date
  readonly snapshot: PortfolioSnapshot
  readonly allocation: PortfolioAllocation
  readonly metrics: PortfolioMetrics
  readonly dividendForecast?: DividendForecast
  readonly summary: RuleSummary
  readonly ruleResults: readonly RuleResult[]
  readonly recommendations: readonly Recommendation[]
  readonly insights: readonly Insight[]
}
