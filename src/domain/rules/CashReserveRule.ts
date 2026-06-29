import type { InvestmentContext, InvestmentRule, RuleResult } from '../types'

export const CashReserveRule: InvestmentRule = {
  id: 'cash-reserve',
  title: 'Cash reserve',
  description: 'Verifies that the portfolio cash reserve meets the investment policy.',
  severity: 'warning',
  category: 'cash',

  evaluate(context: InvestmentContext): RuleResult {
    if (context.policy.cashReserve === undefined) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'warning',
        message: 'The investment policy does not define a cash reserve.',
        details: ['Add a cash reserve target before evaluating cash reserve coverage.'],
      }
    }

    if (context.metrics.cashWeight >= context.policy.cashReserve) {
      return {
        ruleId: this.id,
        title: this.title,
        status: 'pass',
        message: 'The portfolio cash reserve meets the investment policy.',
        details: [
          `Cash weight: ${context.metrics.cashWeight}.`,
          `Target cash weight: ${context.policy.cashReserve}.`,
        ],
      }
    }

    return {
      ruleId: this.id,
      title: this.title,
      status: 'fail',
      message: 'The portfolio cash reserve is below the investment policy target.',
      details: [
        `Cash weight: ${context.metrics.cashWeight}.`,
        `Target cash weight: ${context.policy.cashReserve}.`,
      ],
    }
  },
}
