import type {
  DividendForecast,
  InvestmentAnalysisReport,
  InvestmentContext,
  InvestmentPolicy,
  InvestmentRule,
} from '../types'
import { buildInvestmentAnalysisReport } from '../builders/InvestmentAnalysisReportBuilder'
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

  return buildInvestmentAnalysisReport({
    generatedAt: input.generatedAt,
    snapshot,
    allocation,
    metrics,
    dividendForecast: input.dividendForecast,
    summary,
    ruleResults,
    recommendations,
    insights,
  })
}

export const InvestmentAnalysisEngine = {
  analyze(input: InvestmentAnalysisInput): InvestmentAnalysisReport {
    return analyzeInvestment(input)
  },
} as const
