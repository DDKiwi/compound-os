import type {
  InvestmentContext,
  InvestmentPolicy,
  InvestmentRule,
  PortfolioAllocation,
  PortfolioMetrics,
  PortfolioSnapshot,
  Recommendation,
  RuleResult,
  RuleSummary,
} from '../types'
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
  readonly rules: readonly InvestmentRule[]
}

export type InvestmentAnalysisResult = {
  readonly snapshot: PortfolioSnapshot
  readonly allocation: PortfolioAllocation
  readonly metrics: PortfolioMetrics
  readonly context: InvestmentContext
  readonly ruleResults: readonly RuleResult[]
  readonly summary: RuleSummary
  readonly recommendations: readonly Recommendation[]
}

export function analyzeInvestment(input: InvestmentAnalysisInput): InvestmentAnalysisResult {
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

  return {
    snapshot,
    allocation,
    metrics,
    context,
    ruleResults,
    summary,
    recommendations,
  }
}
