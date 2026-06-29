import type {
  DividendForecast,
  InvestmentAnalysisReport,
  InvestmentContext,
  InvestmentPolicy,
  InvestmentRule,
  Recommendation,
  RuleResult,
} from '../types'
import { buildInsights } from '../builders/insightBuilder'
import { buildPortfolioAllocation, type PortfolioAllocationInput } from '../builders/portfolioAllocationBuilder'
import { buildPortfolioMetrics } from '../builders/portfolioMetricsBuilder'
import { buildPortfolioSnapshot, type PortfolioSnapshotInput } from '../builders/portfolioSnapshotBuilder'
import { buildRecommendations } from '../builders/recommendationBuilder'
import { buildRuleSummary } from '../builders/ruleSummaryBuilder'
import { evaluateRules } from './ruleEngine'

export type InvestmentAnalysisInput = {
  readonly policy: InvestmentPolicy
  readonly snapshotInput: PortfolioSnapshotInput
  readonly allocationInput: PortfolioAllocationInput
  readonly dividendForecast?: DividendForecast
  readonly generatedAt?: Date
  readonly rules: readonly InvestmentRule[]
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

export function analyzeInvestment(input: InvestmentAnalysisInput): InvestmentAnalysisReport {
  const snapshot = buildPortfolioSnapshot(input.snapshotInput)
  const allocation = buildPortfolioAllocation(input.allocationInput)
  const metrics = buildPortfolioMetrics(snapshot)
  const context: InvestmentContext = {
    policy: input.policy,
    snapshot,
    allocation,
    metrics,
  }
  const ruleResults = evaluateRules(context, input.rules)
  const summary = buildRuleSummary(ruleResults)
  const recommendations = buildRecommendations(ruleResults, input.rules)
  const insights = buildInsights(input.dividendForecast, summary, ruleResults)
  const reportRuleResults = ruleResults.map(cloneRuleResult)
  const reportRecommendations = recommendations.map(cloneRecommendation)

  return freezeReport({
    generatedAt: new Date(input.generatedAt ?? Date.now()),
    snapshot,
    allocation,
    metrics,
    dividendForecast: cloneDividendForecast(input.dividendForecast),
    ruleResults: reportRuleResults,
    summary,
    recommendations: reportRecommendations,
    insights,
  })
}
