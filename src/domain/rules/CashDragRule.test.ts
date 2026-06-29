import { describe, expect, it } from 'vitest'
import type { InvestmentContext, InvestmentPolicy } from '../types'
import { CashDragRule } from './CashDragRule'

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

function createContext(cashWeight = 0.1): InvestmentContext {
  return {
    policy: createPolicy(),
    snapshot: {
      totalValue: 100_000,
      cashValue: 10_000,
      cashWeight,
    },
    allocation: {
      holdings: [],
      sectors: [],
      countries: [],
      currencies: [],
      assetClasses: [],
    },
    metrics: {
      cashWeight,
    },
  }
}

describe('CashDragRule', () => {
  it('has rule metadata', () => {
    expect(CashDragRule).toEqual(
      expect.objectContaining({
        id: 'cash-drag',
        title: 'Cash drag',
        description:
          'Verifies that excess cash does not create a material drag on long-term returns.',
        severity: 'warning',
        category: 'cash',
      }),
    )
  })

  it('passes when cash weight is low', () => {
    const result = CashDragRule.evaluate(createContext(0.25))

    expect(result).toEqual({
      ruleId: 'cash-drag',
      title: 'Cash drag',
      status: 'pass',
      message: 'The portfolio cash weight is not creating material cash drag.',
      score: 10,
      details: ['Cash weight: 0.25.'],
    })
  })

  it('passes when portfolio data is empty and cash weight is low', () => {
    const result = CashDragRule.evaluate(createContext(0))

    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('warns when cash weight exceeds 25 percent', () => {
    const result = CashDragRule.evaluate(createContext(0.3))

    expect(result.status).toBe('warning')
    expect(result.score).toBe(0)
    expect(result.message).toBe('The portfolio cash weight creates cash drag.')
  })

  it('fails when cash weight exceeds 40 percent', () => {
    const result = CashDragRule.evaluate(createContext(0.41))

    expect(result).toEqual({
      ruleId: 'cash-drag',
      title: 'Cash drag',
      status: 'fail',
      message: 'The portfolio cash weight creates severe cash drag.',
      score: -10,
      details: ['Cash weight: 0.41 exceeds 0.4.'],
    })
  })

  it('returns details when cash drag is elevated', () => {
    const result = CashDragRule.evaluate(createContext(0.3))

    expect(result.details).toEqual(['Cash weight: 0.3 exceeds 0.25.'])
  })
})
