import type { InvestmentRule, Recommendation, RuleResult } from '../types'

export function buildRecommendations(
  results: readonly RuleResult[],
  rules: readonly InvestmentRule[],
): Recommendation[] {
  const resultByRuleId = new Map(results.map((result) => [result.ruleId, result]))
  const recommendations: Recommendation[] = []

  for (const rule of rules) {
    const result = resultByRuleId.get(rule.id)

    if (result === undefined || rule.buildRecommendation === undefined) {
      continue
    }

    const recommendation = rule.buildRecommendation(result)

    if (recommendation !== null) {
      recommendations.push(recommendation)
    }
  }

  return recommendations
}
