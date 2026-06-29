import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export const CashDragRule: InvestmentRule = {
  id: 'cash-drag',
  title: 'Cash drag',
  description: 'Verifies that excess cash does not create a material drag on long-term returns.',
  severity: 'warning',
  category: 'cash',

  evaluate(context: InvestmentContext): RuleResult {
    const cashWeight = context.metrics.cashWeight

    if (cashWeight > 0.4) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'fail',
        message: 'The portfolio cash weight creates severe cash drag.',
        score: -10,
        details: [`Cash weight: ${cashWeight} exceeds 0.4.`],
      }
    }

    if (cashWeight > 0.25) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The portfolio cash weight creates cash drag.',
        score: 0,
        details: [`Cash weight: ${cashWeight} exceeds 0.25.`],
      }
    }

    return {
      ruleId: this.id,
      title: this.title,
      status: 'pass',
      message: 'The portfolio cash weight is not creating material cash drag.',
      score: 10,
      details: [`Cash weight: ${cashWeight}.`],
    }
  },
}
