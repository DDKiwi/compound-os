import type { Insight, InvestmentDiagnosis, Recommendation } from '../types'

const strengthInsightIds = new Set(['portfolio-no-failed-rules', 'portfolio-health-above-90'])
const weaknessInsightIds = new Set([
  'dividend-forecast-no-payments',
  'dividend-forecast-concentrated-month',
])

function isStrength(insight: Insight): boolean {
  return strengthInsightIds.has(insight.id)
}

function isWeakness(insight: Insight): boolean {
  return weaknessInsightIds.has(insight.id)
}

export function buildInvestmentDiagnosis(
  insights: readonly Insight[],
  recommendations: readonly Recommendation[],
): InvestmentDiagnosis {
  return {
    strengths: insights.filter(isStrength),
    weaknesses: insights.filter(isWeakness),
    opportunities: recommendations,
  }
}
