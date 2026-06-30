import type { Insight, InvestmentAnalysisSummary, InvestmentDecision, Recommendation } from '../types'
import { buildInvestmentDiagnosis } from './InvestmentDiagnosisBuilder'
import { buildInvestmentImpact } from './InvestmentImpactBuilder'

export type InvestmentDecisionBuilderInput = {
  readonly insights?: readonly Insight[]
  readonly recommendations?: readonly Recommendation[]
}

function getRecommendations(
  summary: InvestmentAnalysisSummary,
  recommendations: readonly Recommendation[] | undefined,
): readonly Recommendation[] {
  if (recommendations !== undefined) {
    return recommendations
  }

  return summary.topRecommendation === undefined ? [] : [summary.topRecommendation]
}

export function buildInvestmentDecision(
  summary: InvestmentAnalysisSummary,
  input: InvestmentDecisionBuilderInput = {},
): InvestmentDecision {
  const recommendation = summary.topRecommendation

  return {
    health: summary.health,
    recommendation,
    diagnosis: buildInvestmentDiagnosis(
      input.insights ?? [],
      getRecommendations(summary, input.recommendations),
    ),
    impact: recommendation === undefined ? undefined : buildInvestmentImpact(summary, recommendation),
  }
}
