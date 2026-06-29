import { describe, expect, it } from 'vitest'
import type { AllocationWeight, InvestmentContext, InvestmentPolicy } from '../types'
import { DiversificationRule } from './DiversificationRule'

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

function createHoldings(count: number): AllocationWeight[] {
  return Array.from({ length: count }, (_, index) =>
    createHolding({
      id: `holding-${index + 1}`,
      name: `Holding ${index + 1}`,
      weight: 1 / count,
    }),
  )
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

describe('DiversificationRule', () => {
  it('has rule metadata', () => {
    expect(DiversificationRule).toEqual(
      expect.objectContaining({
        id: 'diversification',
        title: 'Diversification',
        description:
          'Verifies that the portfolio has enough holdings to reduce single-company risk.',
        severity: 'warning',
        category: 'risk',
      }),
    )
  })

  it('warns when holdings are empty', () => {
    const result = DiversificationRule.evaluate(createContext())

    expect(result).toEqual({
      ruleId: 'diversification',
      title: 'Diversification',
      status: 'warning',
      message: 'The portfolio has no holdings to evaluate for diversification.',
      score: 0,
      details: ['Add holdings before evaluating diversification.'],
    })
  })

  it('passes when the portfolio has at least 10 holdings', () => {
    const result = DiversificationRule.evaluate(createContext(createHoldings(10)))

    expect(result).toEqual({
      ruleId: 'diversification',
      title: 'Diversification',
      status: 'pass',
      message: 'The portfolio has enough holdings for basic diversification.',
      score: 10,
      details: ['Holdings: 10.'],
    })
  })

  it('warns when the portfolio has fewer than 10 holdings', () => {
    const result = DiversificationRule.evaluate(createContext(createHoldings(9)))

    expect(result.status).toBe('warning')
    expect(result.score).toBe(0)
    expect(result.message).toBe('The portfolio has fewer than 10 holdings.')
  })

  it('returns details when diversification is below the threshold', () => {
    const result = DiversificationRule.evaluate(createContext(createHoldings(4)))

    expect(result.details).toEqual(['Holdings: 4.', 'Minimum diversified holdings: 10.'])
  })
})
