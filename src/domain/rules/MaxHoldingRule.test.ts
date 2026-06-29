import { describe, expect, it } from 'vitest'
import type { AllocationWeight, InvestmentContext, InvestmentPolicy } from '../types'
import { MaxHoldingRule } from './MaxHoldingRule'

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

function createHolding(holding: Partial<AllocationWeight> = {}): AllocationWeight {
  return {
    id: 'holding-1',
    name: 'Compounder AB',
    value: 40_000,
    weight: 0.4,
    ...holding,
  }
}

function createContext({
  holdings = [],
  policy = {},
}: {
  holdings?: readonly AllocationWeight[]
  policy?: Partial<InvestmentPolicy>
} = {}): InvestmentContext {
  return {
    policy: createPolicy(policy),
    snapshot: {
      totalValue: 100_000,
      cashValue: 10_000,
      cashWeight: 0.1,
    },
    allocation: {
      holdings,
      sectors: [],
      countries: [],
      currencies: [],
      assetClasses: [],
    },
    metrics: {
      cashWeight: 0.1,
    },
  }
}

describe('MaxHoldingRule', () => {
  it('has rule metadata', () => {
    expect(MaxHoldingRule).toEqual(
      expect.objectContaining({
        id: 'max-holding',
        title: 'Maximum holding weight',
        description:
          'Verifies that no holding exceeds the maximum holding weight in the investment policy.',
        severity: 'critical',
        category: 'allocation',
      }),
    )
  })

  it('warns when maximum holding weight is missing from the policy', () => {
    const result = MaxHoldingRule.evaluate(createContext())

    expect(result).toEqual({
      ruleId: 'max-holding',
      title: 'Maximum holding weight',
      status: 'warning',
      message: 'The investment policy does not define a maximum holding weight.',
      score: 0,
      details: ['Add a maximum holding weight before evaluating holding concentration.'],
    })
  })

  it('passes when the holdings list is empty', () => {
    const result = MaxHoldingRule.evaluate(
      createContext({
        policy: {
          maxHoldingWeight: 0.25,
        },
      }),
    )

    expect(result).toEqual({
      ruleId: 'max-holding',
      title: 'Maximum holding weight',
      status: 'pass',
      message: 'All holdings are within the maximum holding weight.',
      score: 10,
      details: ['Maximum holding weight: 0.25.'],
    })
  })

  it('passes when all holdings are below the maximum holding weight', () => {
    const result = MaxHoldingRule.evaluate(
      createContext({
        policy: {
          maxHoldingWeight: 0.25,
        },
        holdings: [
          createHolding({
            id: 'holding-1',
            name: 'Compounder AB',
            weight: 0.2,
          }),
          createHolding({
            id: 'holding-2',
            name: 'Durable Inc',
            weight: 0.25,
          }),
        ],
      }),
    )

    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
    expect(result.message).toBe('All holdings are within the maximum holding weight.')
  })

  it('fails when one holding exceeds the maximum holding weight', () => {
    const result = MaxHoldingRule.evaluate(
      createContext({
        policy: {
          maxHoldingWeight: 0.25,
        },
        holdings: [
          createHolding({
            id: 'holding-1',
            name: 'Compounder AB',
            weight: 0.3,
          }),
          createHolding({
            id: 'holding-2',
            name: 'Durable Inc',
            weight: 0.2,
          }),
        ],
      }),
    )

    expect(result).toEqual({
      ruleId: 'max-holding',
      title: 'Maximum holding weight',
      status: 'fail',
      message: 'One or more holdings exceed the maximum holding weight.',
      score: -10,
      details: ['Compounder AB: 0.3 exceeds 0.25.'],
    })
  })

  it('fails when several holdings exceed the maximum holding weight', () => {
    const result = MaxHoldingRule.evaluate(
      createContext({
        policy: {
          maxHoldingWeight: 0.25,
        },
        holdings: [
          createHolding({
            id: 'holding-1',
            name: 'Compounder AB',
            weight: 0.3,
          }),
          createHolding({
            id: 'holding-2',
            name: 'Durable Inc',
            weight: 0.35,
          }),
          createHolding({
            id: 'holding-3',
            name: 'Cash Machine Co',
            weight: 0.25,
          }),
        ],
      }),
    )

    expect(result.status).toBe('fail')
    expect(result.score).toBe(-10)
    expect(result.details).toEqual([
      'Compounder AB: 0.3 exceeds 0.25.',
      'Durable Inc: 0.35 exceeds 0.25.',
    ])
  })

  it('does not recommend an action when all holdings are within the maximum holding weight', () => {
    const result = MaxHoldingRule.evaluate(
      createContext({
        policy: {
          maxHoldingWeight: 0.25,
        },
        holdings: [
          createHolding({
            weight: 0.2,
          }),
        ],
      }),
    )

    expect(MaxHoldingRule.buildRecommendation?.(result)).toBeNull()
  })

  it('recommends defining a maximum holding weight when the policy is missing one', () => {
    const result = MaxHoldingRule.evaluate(createContext())

    expect(MaxHoldingRule.buildRecommendation?.(result)).toEqual({
      id: 'max-holding-define-policy',
      ruleId: 'max-holding',
      title: 'Define a maximum holding weight',
      message: 'The investment policy does not define a maximum holding weight.',
      severity: 'warning',
      confidence: 'high',
      expectedImpact: 'Makes concentration risk measurable against the investment policy.',
      details: ['Add a maximum holding weight before evaluating holding concentration.'],
    })
  })

  it('recommends reducing oversized holdings when the maximum holding weight fails', () => {
    const result = MaxHoldingRule.evaluate(
      createContext({
        policy: {
          maxHoldingWeight: 0.25,
        },
        holdings: [
          createHolding({
            name: 'Compounder AB',
            weight: 0.3,
          }),
        ],
      }),
    )

    expect(MaxHoldingRule.buildRecommendation?.(result)).toEqual({
      id: 'max-holding-reduce-concentration',
      ruleId: 'max-holding',
      title: 'Reduce oversized holdings',
      message: 'One or more holdings exceed the maximum holding weight.',
      severity: 'critical',
      confidence: 'high',
      expectedImpact: 'Reduces single-position concentration and restores policy alignment.',
      details: ['Compounder AB: 0.3 exceeds 0.25.'],
    })
  })
})
