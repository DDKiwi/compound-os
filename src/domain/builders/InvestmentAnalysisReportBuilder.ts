import type {
  DividendForecast,
  Insight,
  InvestmentAnalysisReport,
  PortfolioAllocation,
  PortfolioMetrics,
  PortfolioSnapshot,
  Recommendation,
  RuleResult,
  RuleSummary,
} from '../types'

export type InvestmentAnalysisReportBuilderInput = {
  readonly generatedAt?: Date
  readonly snapshot: PortfolioSnapshot
  readonly allocation: PortfolioAllocation
  readonly metrics: PortfolioMetrics
  readonly dividendForecast?: DividendForecast
  readonly summary: RuleSummary
  readonly ruleResults: readonly RuleResult[]
  readonly recommendations: readonly Recommendation[]
  readonly insights: readonly Insight[]
}

function freezeReport<T>(value: T): T {
  if (value === null || typeof value !== 'object' || value instanceof Date) {
    return value
  }

  for (const propertyValue of Object.values(value)) {
    freezeReport(propertyValue)
  }

  return Object.freeze(value)
}

function cloneRuleResult(result: RuleResult): RuleResult {
  return {
    ...result,
    details: result.details === undefined ? undefined : [...result.details],
  }
}

function cloneRecommendation(recommendation: Recommendation): Recommendation {
  return {
    ...recommendation,
    details: recommendation.details === undefined ? undefined : [...recommendation.details],
  }
}

function cloneDividendForecast(forecast: DividendForecast | undefined): DividendForecast | undefined {
  if (forecast === undefined) {
    return undefined
  }

  return {
    ...forecast,
    months: forecast.months.map((month) => ({
      ...month,
      payments: month.payments.map((payment) => ({ ...payment })),
    })),
  }
}

export function buildInvestmentAnalysisReport(
  input: InvestmentAnalysisReportBuilderInput,
): InvestmentAnalysisReport {
  return freezeReport({
    generatedAt: new Date(input.generatedAt ?? Date.now()),
    snapshot: input.snapshot,
    allocation: input.allocation,
    metrics: input.metrics,
    dividendForecast: cloneDividendForecast(input.dividendForecast),
    summary: input.summary,
    ruleResults: input.ruleResults.map(cloneRuleResult),
    recommendations: input.recommendations.map(cloneRecommendation),
    insights: input.insights,
  })
}
