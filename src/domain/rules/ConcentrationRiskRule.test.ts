import { describe, expect, it } from 'vitest'
import type { AllocationWeight, InvestmentContext, InvestmentPolicy } from '../types'
import { ConcentrationRiskRule } from './ConcentrationRiskRule'

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
    value: 10_000,
    weight: 0.1,
    ...holding,
  }
}

function createContext(holdings: readonly AllocationWeight[] = []): InvestmentContext {
  return {
    policy: createPolicy(),
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

describe('ConcentrationRiskRule', () => {
  it('has rule metadata', () => {
    expect(ConcentrationRiskRule).toEqual(
      expect.objectContaining({
        id: 'concentration-risk',
        title: 'Concentration risk',
        description:
          'Verifies that the largest holding does not create excessive concentration risk.',
        severity: 'critical',
        category: 'risk',
      }),
    )
  })

  it('warns when holdings are empty', () => {
    const result = ConcentrationRiskRule.evaluate(createContext())

    expect(result).toEqual({
      ruleId: 'concentration-risk',
      title: 'Concentration risk',
      status: 'warning',
      message: 'The portfolio has no holdings to evaluate for concentration risk.',
      score: 0,
      details: ['Add holdings before evaluating concentration risk.'],
    })
  })

  it('passes when the largest holding is at most 10 percent', () => {
    const result = ConcentrationRiskRule.evaluate(
      createContext([
        createHolding({
          id: 'holding-1',
          name: 'Compounder AB',
          weight: 0.1,
        }),
        createHolding({
          id: 'holding-2',
          name: 'Durable Inc',
          weight: 0.08,
        }),
      ]),
    )

    expect(result).toEqual({
      ruleId: 'concentration-risk',
      title: 'Concentration risk',
      status: 'pass',
      message: 'The largest holding is within the concentration risk threshold.',
      score: 10,
      details: ['Largest holding: Compounder AB at 0.1.'],
    })
  })

  it('warns when the largest holding exceeds 10 percent', () => {
    const result = ConcentrationRiskRule.evaluate(
      createContext([
        createHolding({
          id: 'holding-1',
          name: 'Compounder AB',
          weight: 0.12,
        }),
        createHolding({
          id: 'holding-2',
          name: 'Durable Inc',
          weight: 0.08,
        }),
      ]),
    )

    expect(result.status).toBe('warning')
    expect(result.score).toBe(0)
    expect(result.message).toBe('The largest holding creates elevated concentration risk.')
  })

  it('fails when the largest holding exceeds 20 percent', () => {
    const result = ConcentrationRiskRule.evaluate(
      createContext([
        createHolding({
          id: 'holding-1',
          name: 'Compounder AB',
          weight: 0.21,
        }),
        createHolding({
          id: 'holding-2',
          name: 'Durable Inc',
          weight: 0.08,
        }),
      ]),
    )

    expect(result.status).toBe('fail')
    expect(result.score).toBe(-10)
    expect(result.message).toBe('The largest holding creates excessive concentration risk.')
  })

  it('returns details when concentration risk is elevated', () => {
    const result = ConcentrationRiskRule.evaluate(
      createContext([
        createHolding({
          id: 'holding-1',
          name: 'Compounder AB',
          weight: 0.12,
        }),
      ]),
    )

    expect(result.details).toEqual(['Compounder AB: 0.12 exceeds 0.1.'])
  })

  it('returns details when concentration risk fails', () => {
    const result = ConcentrationRiskRule.evaluate(
      createContext([
        createHolding({
          id: 'holding-1',
          name: 'Compounder AB',
          weight: 0.25,
        }),
      ]),
    )

    expect(result.details).toEqual(['Compounder AB: 0.25 exceeds 0.2.'])
  })
})
