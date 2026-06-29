import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export function evaluateRules(
  context: InvestmentContext,
  rules: readonly InvestmentRule[],
): RuleResult[] {
  return rules.map((rule) => rule.evaluate(context))
}
