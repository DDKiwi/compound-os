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
    snapshot: {
      totalValue: 100_000,
      cashValue: 10_000,
      cashWeight: 0.1,
    },
    metrics: {
      cashWeight: 0.1,
    },
  }
}

describe('CashReserveRule', () => {
  it('has rule metadata', () => {
    expect(CashReserveRule).toEqual(
      expect.objectContaining({
        id: 'cash-reserve',
        title: 'Cash reserve',
        description: 'Verifies that the portfolio cash reserve meets the investment policy.',
        severity: 'warning',
        category: 'cash',
      }),
    )
  })

  it('passes when cash weight meets the cash reserve policy', () => {
    const result = CashReserveRule.evaluate(
      createContext({
        cashReserve: 0.1,
      }),
    )

    expect(result).toEqual({
      ruleId: 'cash-reserve',
      title: 'Cash reserve',
      status: 'pass',
      message: 'The portfolio cash reserve meets the investment policy.',
      details: ['Cash weight: 0.1.', 'Target cash weight: 0.1.'],
    })
  })

  it('passes when cash weight exceeds the cash reserve policy', () => {
    const result = CashReserveRule.evaluate(
      createContext({
        cashReserve: 0.05,
      }),
    )

    expect(result.status).toBe('pass')
    expect(result.message).toBe('The portfolio cash reserve meets the investment policy.')
  })

  it('fails when cash weight is below the cash reserve policy', () => {
    const result = CashReserveRule.evaluate(
      createContext({
        cashReserve: 0.2,
      }),
    )

    expect(result).toEqual({
      ruleId: 'cash-reserve',
      title: 'Cash reserve',
      status: 'fail',
      message: 'The portfolio cash reserve is below the investment policy target.',
      details: ['Cash weight: 0.1.', 'Target cash weight: 0.2.'],
    })
  })

  it('uses portfolio metrics when evaluating cash weight', () => {
    const context = createContext({
      cashReserve: 0.2,
    })
    const result = CashReserveRule.evaluate({
      ...context,
      snapshot: {
        totalValue: 100_000,
        cashValue: 10_000,
        cashWeight: 0.1,
      },
      metrics: {
        cashWeight: 0.25,
      },
    })

    expect(result).toEqual({
      ruleId: 'cash-reserve',
      title: 'Cash reserve',
      status: 'pass',
      message: 'The portfolio cash reserve meets the investment policy.',
      details: ['Cash weight: 0.25.', 'Target cash weight: 0.2.'],
    })
  })

  it('warns when cash reserve is missing from the policy', () => {
    const result = CashReserveRule.evaluate(createContext())

    expect(result).toEqual({
      ruleId: 'cash-reserve',
      title: 'Cash reserve',
      status: 'warning',
      message: 'The investment policy does not define a cash reserve.',
      details: ['Add a cash reserve target before evaluating cash reserve coverage.'],
    })
  })

  it('warns when cash reserve is explicitly undefined', () => {
    const result = CashReserveRule.evaluate(
      createContext({
        cashReserve: undefined,
      }),
    )

    expect(result.status).toBe('warning')
    expect(result.message).toBe('The investment policy does not define a cash reserve.')
  })

  it('returns a RuleResult for the evaluated rule', () => {
    const result = CashReserveRule.evaluate(
      createContext({
        cashReserve: 0.1,
      }),
    )

    expect(result.ruleId).toBe(CashReserveRule.id)
    expect(result.title).toBe(CashReserveRule.title)
    expect(result.status).toBe('pass')
    expect(result.message).toBe('The portfolio cash reserve meets the investment policy.')
    expect(result.details).toEqual(['Cash weight: 0.1.', 'Target cash weight: 0.1.'])
    expect(result).not.toHaveProperty('recommendation')
  })
})
