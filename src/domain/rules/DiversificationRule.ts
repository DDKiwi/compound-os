import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export const DiversificationRule: InvestmentRule = {
  id: 'diversification',
  title: 'Diversification',
  description: 'Verifies that the portfolio has enough holdings to reduce single-company risk.',
  severity: 'warning',
  category: 'risk',

  evaluate(context: InvestmentContext): RuleResult {
    const holdingCount = context.allocation.holdings.length

    if (holdingCount === 0) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The portfolio has no holdings to evaluate for diversification.',
        score: 0,
        details: ['Add holdings before evaluating diversification.'],
      }
    }

    if (holdingCount < 10) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The portfolio has fewer than 10 holdings.',
        score: 0,
        details: [`Holdings: ${holdingCount}.`, 'Minimum diversified holdings: 10.'],
      }
    }

    return {
      ruleId: this.id,
      title: this.title,
      status: 'pass',
      message: 'The portfolio has enough holdings for basic diversification.',
      score: 10,
      details: [`Holdings: ${holdingCount}.`],
    }
  },
}
