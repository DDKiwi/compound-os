import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export const CountryAllocationRule: InvestmentRule = {
  id: 'country-allocation',
  title: 'Country allocation',
  description: 'Verifies that country weights stay within the investment policy limits.',
  severity: 'critical',
  category: 'allocation',

  evaluate(context: InvestmentContext): RuleResult {
    const countryLimits = context.policy.countryLimits

    if (countryLimits === undefined || countryLimits.length === 0) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The investment policy does not define country limits.',
        score: 0,
        details: ['Add country limits before evaluating country allocation.'],
      }
    }

    const policyViolations = countryLimits.flatMap((countryLimit) => {
      const country = context.allocation.countries.find(
        (allocationCountry) => allocationCountry.id === countryLimit.id,
      )
      const weight = country?.weight ?? 0

      if (weight <= countryLimit.maxWeight) {
        return []
      }

      return [`${countryLimit.name}: ${weight} exceeds ${countryLimit.maxWeight}.`]
    })

    if (policyViolations.length === 0) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'pass',
        message: 'All countries are within the investment policy limits.',
        score: 10,
        details: [`Country limits evaluated: ${countryLimits.length}.`],
      }
    }

    return {
      ruleId: this.id,
      title: this.title,
      status: 'fail',
      message: 'One or more countries exceed the investment policy limits.',
      score: -10,
      details: policyViolations,
    }
  },
}
