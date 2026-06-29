import { describe, expect, it } from 'vitest'
import type { AllocationWeight, InvestmentContext, InvestmentPolicy } from '../types'
import { CountryAllocationRule } from './CountryAllocationRule'

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
      id: 'max-country-exposure',
      exposureType: 'country',
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

function createCountry(country: Partial<AllocationWeight> = {}): AllocationWeight {
  return {
    id: 'us',
    name: 'United States',
    value: 40_000,
    weight: 0.4,
    ...country,
  }
}

function createContext({
  policy = {},
  countries = [],
}: {
  policy?: Partial<InvestmentPolicy>
  countries?: readonly AllocationWeight[]
} = {}): InvestmentContext {
  return {
    policy: createPolicy(policy),
    snapshot: {
      totalValue: 100_000,
      cashValue: 10_000,
      cashWeight: 0.1,
    },
    allocation: {
      holdings: [],
      sectors: [],
      countries,
      currencies: [],
      assetClasses: [],
    },
    metrics: {
      cashWeight: 0.1,
    },
  }
}

describe('CountryAllocationRule', () => {
  it('has rule metadata', () => {
    expect(CountryAllocationRule).toEqual(
      expect.objectContaining({
        id: 'country-allocation',
        title: 'Country allocation',
        description: 'Verifies that country weights stay within the investment policy limits.',
        severity: 'critical',
        category: 'allocation',
      }),
    )
  })

  it('warns when country limits are missing from the policy', () => {
    const result = CountryAllocationRule.evaluate(createContext())

    expect(result).toEqual({
      ruleId: 'country-allocation',
      title: 'Country allocation',
      status: 'warning',
      message: 'The investment policy does not define country limits.',
      score: 0,
      details: ['Add country limits before evaluating country allocation.'],
    })
  })

  it('warns when country limits are empty', () => {
    const result = CountryAllocationRule.evaluate(
      createContext({
        policy: {
          countryLimits: [],
        },
      }),
    )

    expect(result.status).toBe('warning')
    expect(result.score).toBe(0)
    expect(result.message).toBe('The investment policy does not define country limits.')
  })

  it('passes when the country allocation list is empty', () => {
    const result = CountryAllocationRule.evaluate(
      createContext({
        policy: {
          countryLimits: [
            {
              id: 'us',
              name: 'United States',
              maxWeight: 0.5,
            },
          ],
        },
      }),
    )

    expect(result).toEqual({
      ruleId: 'country-allocation',
      title: 'Country allocation',
      status: 'pass',
      message: 'All countries are within the investment policy limits.',
      score: 10,
      details: ['Country limits evaluated: 1.'],
    })
  })

  it('passes when all policy countries are within their limits', () => {
    const result = CountryAllocationRule.evaluate(
      createContext({
        policy: {
          countryLimits: [
            {
              id: 'us',
              name: 'United States',
              maxWeight: 0.45,
            },
            {
              id: 'se',
              name: 'Sweden',
              maxWeight: 0.25,
            },
          ],
        },
        countries: [
          createCountry({
            id: 'us',
            name: 'United States',
            weight: 0.4,
          }),
          createCountry({
            id: 'se',
            name: 'Sweden',
            weight: 0.2,
          }),
        ],
      }),
    )

    expect(result).toEqual({
      ruleId: 'country-allocation',
      title: 'Country allocation',
      status: 'pass',
      message: 'All countries are within the investment policy limits.',
      score: 10,
      details: ['Country limits evaluated: 2.'],
    })
  })

  it('treats a missing allocation country as zero weight', () => {
    const result = CountryAllocationRule.evaluate(
      createContext({
        policy: {
          countryLimits: [
            {
              id: 'jp',
              name: 'Japan',
              maxWeight: 0.25,
            },
          ],
        },
        countries: [
          createCountry({
            id: 'us',
            name: 'United States',
            weight: 0.4,
          }),
        ],
      }),
    )

    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
    expect(result.details).toEqual(['Country limits evaluated: 1.'])
  })

  it('fails when one country exceeds its policy limit', () => {
    const result = CountryAllocationRule.evaluate(
      createContext({
        policy: {
          countryLimits: [
            {
              id: 'us',
              name: 'United States',
              maxWeight: 0.3,
            },
            {
              id: 'se',
              name: 'Sweden',
              maxWeight: 0.25,
            },
          ],
        },
        countries: [
          createCountry({
            id: 'us',
            name: 'United States',
            weight: 0.35,
          }),
          createCountry({
            id: 'se',
            name: 'Sweden',
            weight: 0.2,
          }),
        ],
      }),
    )

    expect(result.status).toBe('fail')
    expect(result.score).toBe(-10)
    expect(result.message).toBe('One or more countries exceed the investment policy limits.')
    expect(result.details).toEqual(['United States: 0.35 exceeds 0.3.'])
  })

  it('returns details for every country that breaks the policy', () => {
    const result = CountryAllocationRule.evaluate(
      createContext({
        policy: {
          countryLimits: [
            {
              id: 'us',
              name: 'United States',
              maxWeight: 0.3,
            },
            {
              id: 'se',
              name: 'Sweden',
              maxWeight: 0.2,
            },
            {
              id: 'jp',
              name: 'Japan',
              maxWeight: 0.25,
            },
          ],
        },
        countries: [
          createCountry({
            id: 'us',
            name: 'United States',
            weight: 0.35,
          }),
          createCountry({
            id: 'se',
            name: 'Sweden',
            weight: 0.22,
          }),
          createCountry({
            id: 'jp',
            name: 'Japan',
            weight: 0.25,
          }),
        ],
      }),
    )

    expect(result).toEqual({
      ruleId: 'country-allocation',
      title: 'Country allocation',
      status: 'fail',
      message: 'One or more countries exceed the investment policy limits.',
      score: -10,
      details: ['United States: 0.35 exceeds 0.3.', 'Sweden: 0.22 exceeds 0.2.'],
    })
  })
})
