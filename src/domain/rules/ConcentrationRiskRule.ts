import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export const ConcentrationRiskRule: InvestmentRule = {
  id: 'concentration-risk',
  title: 'Concentration risk',
  description: 'Verifies that the largest holding does not create excessive concentration risk.',
  severity: 'critical',
  category: 'risk',

  evaluate(context: InvestmentContext): RuleResult {
    const holdings = context.allocation.holdings

    if (holdings.length === 0) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The portfolio has no holdings to evaluate for concentration risk.',
        score: 0,
        details: ['Add holdings before evaluating concentration risk.'],
      }
    }

    const largestHolding = holdings.reduce((largest, holding) =>
      holding.weight > largest.weight ? holding : largest,
    )

    if (largestHolding.weight > 0.2) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'fail',
        message: 'The largest holding creates excessive concentration risk.',
        score: -10,
        details: [`${largestHolding.name}: ${largestHolding.weight} exceeds 0.2.`],
      }
    }

    if (largestHolding.weight > 0.1) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The largest holding creates elevated concentration risk.',
        score: 0,
        details: [`${largestHolding.name}: ${largestHolding.weight} exceeds 0.1.`],
      }
    }

    return {
      ruleId: this.id,
      title: this.title,
      status: 'pass',
      message: 'The largest holding is within the concentration risk threshold.',
      score: 10,
      details: [`Largest holding: ${largestHolding.name} at ${largestHolding.weight}.`],
    }
  },
}
