import { describe, expect, it } from 'vitest'
import type { InvestmentContext, InvestmentPolicy } from '../types'
import { CashReserveRule } from './CashReserveRule'

function createPolicy(policy: Partial<InvestmentPolicy> = {}): InvestmentPolicy {
  return {
    id: 'long-term-policy',
    name: 'Long-term policy',
    philosophy: {
      text: 'Own durable compounders and rebalance with discipline.',
    },
    riskTolerance: 'balanced',
    allocationRules: [],
    positionRule: {
      id: 'max-position-size',
      maxWeight: 0.6,
    },
    exposureRule: {
      id: 'max-sector-exposure',
      exposureType: 'sector',
      maxWeight: 0.6,
    },
    dividendPolicy: {
      preference: 'growth',
    },
    rebalancingRule: {
      id: 'rebalancing-threshold',
      driftThreshold: 0.1,
    },
    ...policy,
  }
}

function createContext(policy: Partial<InvestmentPolicy> = {}): InvestmentContext {
  return {
    policy: createPolicy(policy),
  }
}

describe('CashReserveRule', () => {
  it('has rule metadata', () => {
    expect(CashReserveRule).toEqual(
      expect.objectContaining({
        id: 'cash-reserve',
        title: 'Cash reserve',
        description: 'Verifies that the investment policy defines a cash reserve.',
        severity: 'warning',
        category: 'cash',
      }),
    )
  })

  it('passes when cash reserve is defined in the policy', () => {
    const result = CashReserveRule.evaluate(
      createContext({
        cashReserve: {
          targetMonths: 6,
        },
      }),
    )

    expect(result).toEqual({
      ruleId: 'cash-reserve',
      title: 'Cash reserve',
      status: 'pass',
      message: 'The investment policy defines a cash reserve.',
      details: ['Target reserve: 6 months.'],
    })
  })

  it('warns when cash reserve is missing from the policy', () => {
    const result = CashReserveRule.evaluate(createContext())

    expect(result).toEqual({
      ruleId: 'cash-reserve',
      title: 'Cash reserve',
      status: 'warning',
      message: 'The investment policy does not define a cash reserve.',
      details: ['Add a cash reserve policy before evaluating cash reserve coverage.'],
    })
  })

  it('returns a RuleResult for the evaluated rule', () => {
    const result = CashReserveRule.evaluate(
      createContext({
        cashReserve: {
          targetMonths: 3,
        },
      }),
    )

    expect(result.ruleId).toBe(CashReserveRule.id)
    expect(result.title).toBe(CashReserveRule.title)
    expect(result.status).toBe('pass')
    expect(result.message).toBe('The investment policy defines a cash reserve.')
    expect(result.details).toEqual(['Target reserve: 3 months.'])
    expect(result).not.toHaveProperty('recommendation')
  })
})
