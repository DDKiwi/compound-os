import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export const MaxHoldingRule: InvestmentRule = {
  id: 'max-holding',
  title: 'Maximum holding weight',
  description: 'Verifies that no holding exceeds the maximum holding weight in the investment policy.',
  severity: 'critical',
  category: 'allocation',

  evaluate(context: InvestmentContext): RuleResult {
    const maxHoldingWeight = context.policy.maxHoldingWeight

    if (maxHoldingWeight === undefined) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The investment policy does not define a maximum holding weight.',
        score: 0,
        details: ['Add a maximum holding weight before evaluating holding concentration.'],
      }
    }

    const overweightHoldings = context.allocation.holdings.filter(
      (holding) => holding.weight > maxHoldingWeight,
    )

    if (overweightHoldings.length === 0) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'pass',
        message: 'All holdings are within the maximum holding weight.',
        score: 10,
        details: [`Maximum holding weight: ${maxHoldingWeight}.`],
      }
    }

    return {
      ruleId: this.id,
      title: this.title,
      status: 'fail',
      message: 'One or more holdings exceed the maximum holding weight.',
      score: -10,
      details: overweightHoldings.map(
        (holding) => `${holding.name}: ${holding.weight} exceeds ${maxHoldingWeight}.`,
      ),
    }
  },

  buildRecommendation(result: RuleResult) {
    if (result.status === 'pass') {
      return null
    }

    if (result.status === 'warning') {
      return {
        id: `${this.id}-define-policy`,
        ruleId: this.id,
        title: 'Define a maximum holding weight',
        message: result.message,
        severity: 'warning',
        confidence: 'high',
        expectedImpact: 'Makes concentration risk measurable against the investment policy.',
        details: result.details,
      }
    }

    return {
      id: `${this.id}-reduce-concentration`,
      ruleId: this.id,
      title: 'Reduce oversized holdings',
      message: result.message,
      severity: 'critical',
      confidence: 'high',
      expectedImpact: 'Reduces single-position concentration and restores policy alignment.',
      details: result.details,
    }
  },
}
