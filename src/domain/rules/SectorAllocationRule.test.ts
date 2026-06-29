import { describe, expect, it } from 'vitest'
import type { AllocationWeight, InvestmentContext, InvestmentPolicy } from '../types'
import { SectorAllocationRule } from './SectorAllocationRule'

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

function createSector(sector: Partial<AllocationWeight> = {}): AllocationWeight {
  return {
    id: 'technology',
    name: 'Technology',
    value: 40_000,
    weight: 0.4,
    ...sector,
  }
}

function createContext({
  policy = {},
  sectors = [],
}: {
  policy?: Partial<InvestmentPolicy>
  sectors?: readonly AllocationWeight[]
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
      sectors,
      countries: [],
      currencies: [],
      assetClasses: [],
    },
    metrics: {
      cashWeight: 0.1,
    },
  }
}

describe('SectorAllocationRule', () => {
  it('has rule metadata', () => {
    expect(SectorAllocationRule).toEqual(
      expect.objectContaining({
        id: 'sector-allocation',
        title: 'Sector allocation',
        description: 'Verifies that sector weights stay within the investment policy limits.',
        severity: 'critical',
        category: 'allocation',
      }),
    )
  })

  it('warns when sector limits are missing from the policy', () => {
    const result = SectorAllocationRule.evaluate(createContext())

    expect(result).toEqual({
      ruleId: 'sector-allocation',
      title: 'Sector allocation',
      status: 'warning',
      message: 'The investment policy does not define sector limits.',
      score: 0,
      details: ['Add sector limits before evaluating sector allocation.'],
    })
  })

  it('warns when sector limits are empty', () => {
    const result = SectorAllocationRule.evaluate(
      createContext({
        policy: {
          sectorLimits: [],
        },
      }),
    )

    expect(result.status).toBe('warning')
    expect(result.score).toBe(0)
    expect(result.message).toBe('The investment policy does not define sector limits.')
  })

  it('passes when all policy sectors are within their limits', () => {
    const result = SectorAllocationRule.evaluate(
      createContext({
        policy: {
          sectorLimits: [
            {
              id: 'technology',
              name: 'Technology',
              maxWeight: 0.45,
            },
            {
              id: 'health-care',
              name: 'Health Care',
              maxWeight: 0.25,
            },
          ],
        },
        sectors: [
          createSector({
            id: 'technology',
            name: 'Technology',
            weight: 0.4,
          }),
          createSector({
            id: 'health-care',
            name: 'Health Care',
            weight: 0.2,
          }),
        ],
      }),
    )

    expect(result).toEqual({
      ruleId: 'sector-allocation',
      title: 'Sector allocation',
      status: 'pass',
      message: 'All sectors are within the investment policy limits.',
      score: 10,
      details: ['Sector limits evaluated: 2.'],
    })
  })

  it('passes when a sector equals its policy limit', () => {
    const result = SectorAllocationRule.evaluate(
      createContext({
        policy: {
          sectorLimits: [
            {
              id: 'technology',
              name: 'Technology',
              maxWeight: 0.4,
            },
          ],
        },
        sectors: [
          createSector({
            id: 'technology',
            name: 'Technology',
            weight: 0.4,
          }),
        ],
      }),
    )

    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
  })

  it('treats a missing allocation sector as zero weight', () => {
    const result = SectorAllocationRule.evaluate(
      createContext({
        policy: {
          sectorLimits: [
            {
              id: 'technology',
              name: 'Technology',
              maxWeight: 0.25,
            },
          ],
        },
      }),
    )

    expect(result.status).toBe('pass')
    expect(result.score).toBe(10)
    expect(result.details).toEqual(['Sector limits evaluated: 1.'])
  })

  it('matches sectors by id rather than name', () => {
    const result = SectorAllocationRule.evaluate(
      createContext({
        policy: {
          sectorLimits: [
            {
              id: 'technology',
              name: 'Information Technology',
              maxWeight: 0.3,
            },
          ],
        },
        sectors: [
          createSector({
            id: 'technology',
            name: 'Technology',
            weight: 0.35,
          }),
        ],
      }),
    )

    expect(result).toEqual({
      ruleId: 'sector-allocation',
      title: 'Sector allocation',
      status: 'fail',
      message: 'One or more sectors exceed the investment policy limits.',
      score: -10,
      details: ['Information Technology: 0.35 exceeds 0.3.'],
    })
  })

  it('fails when one sector exceeds its policy limit', () => {
    const result = SectorAllocationRule.evaluate(
      createContext({
        policy: {
          sectorLimits: [
            {
              id: 'technology',
              name: 'Technology',
              maxWeight: 0.3,
            },
            {
              id: 'health-care',
              name: 'Health Care',
              maxWeight: 0.25,
            },
          ],
        },
        sectors: [
          createSector({
            id: 'technology',
            name: 'Technology',
            weight: 0.35,
          }),
          createSector({
            id: 'health-care',
            name: 'Health Care',
            weight: 0.2,
          }),
        ],
      }),
    )

    expect(result.status).toBe('fail')
    expect(result.score).toBe(-10)
    expect(result.message).toBe('One or more sectors exceed the investment policy limits.')
    expect(result.details).toEqual(['Technology: 0.35 exceeds 0.3.'])
  })

  it('returns details for every sector that breaks the policy', () => {
    const result = SectorAllocationRule.evaluate(
      createContext({
        policy: {
          sectorLimits: [
            {
              id: 'technology',
              name: 'Technology',
              maxWeight: 0.3,
            },
            {
              id: 'financials',
              name: 'Financials',
              maxWeight: 0.2,
            },
            {
              id: 'health-care',
              name: 'Health Care',
              maxWeight: 0.25,
            },
          ],
        },
        sectors: [
          createSector({
            id: 'technology',
            name: 'Technology',
            weight: 0.35,
          }),
          createSector({
            id: 'financials',
            name: 'Financials',
            weight: 0.22,
          }),
          createSector({
            id: 'health-care',
            name: 'Health Care',
            weight: 0.25,
          }),
        ],
      }),
    )

    expect(result).toEqual({
      ruleId: 'sector-allocation',
      title: 'Sector allocation',
      status: 'fail',
      message: 'One or more sectors exceed the investment policy limits.',
      score: -10,
      details: ['Technology: 0.35 exceeds 0.3.', 'Financials: 0.22 exceeds 0.2.'],
    })
  })
})
