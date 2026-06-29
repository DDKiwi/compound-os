import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export const CashReserveRule: InvestmentRule = {
  id: 'cash-reserve',
  title: 'Cash reserve',
  description: 'Verifies that the investment policy defines a cash reserve.',
  severity: 'warning',
  category: 'cash',

  evaluate(context: InvestmentContext): RuleResult {
    if (context.policy.cashReserve === undefined) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The investment policy does not define a cash reserve.',
        details: ['Add a cash reserve policy before evaluating cash reserve coverage.'],
      }
    }

    return {
      ruleId: this.id,
      title: this.title,
      status: 'pass',
      message: 'The investment policy defines a cash reserve.',
      details: [`Target reserve: ${context.policy.cashReserve.targetMonths} months.`],
    }
  },
}
