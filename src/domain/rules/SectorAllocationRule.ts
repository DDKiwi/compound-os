import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export const SectorAllocationRule: InvestmentRule = {
  id: 'sector-allocation',
  title: 'Sector allocation',
  description: 'Verifies that sector weights stay within the investment policy limits.',
  severity: 'critical',
  category: 'allocation',

  evaluate(context: InvestmentContext): RuleResult {
    const sectorLimits = context.policy.sectorLimits

    if (sectorLimits === undefined || sectorLimits.length === 0) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The investment policy does not define sector limits.',
        score: 0,
        details: ['Add sector limits before evaluating sector allocation.'],
      }
    }

    const policyViolations = sectorLimits.flatMap((sectorLimit) => {
      const sector = context.allocation.sectors.find(
        (allocationSector) => allocationSector.id === sectorLimit.id,
      )
      const weight = sector?.weight ?? 0

      if (weight <= sectorLimit.maxWeight) {
        return []
      }

      return [`${sectorLimit.name}: ${weight} exceeds ${sectorLimit.maxWeight}.`]
    })

    if (policyViolations.length === 0) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'pass',
        message: 'All sectors are within the investment policy limits.',
        score: 10,
        details: [`Sector limits evaluated: ${sectorLimits.length}.`],
      }
    }

    return {
      ruleId: this.id,
      title: this.title,
      status: 'fail',
      message: 'One or more sectors exceed the investment policy limits.',
      score: -10,
      details: policyViolations,
    }
  },
}
