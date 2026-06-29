import { describe, expect, it } from 'vitest'
import type { PortfolioAllocationInput } from './portfolioAllocationBuilder'
import { buildPortfolioAllocation } from './portfolioAllocationBuilder'

describe('buildPortfolioAllocation', () => {
  it('builds an empty allocation from empty input', () => {
    expect(buildPortfolioAllocation({})).toEqual({
      holdings: [],
      sectors: [],
      countries: [],
      currencies: [],
      assetClasses: [],
    })
  })

  it('builds all allocation lists', () => {
    expect(
      buildPortfolioAllocation({
        holdings: [
          {
            id: 'msft',
            name: 'Microsoft',
            value: 40_000,
            weight: 0.4,
          },
        ],
        sectors: [
          {
            id: 'technology',
            name: 'Technology',
            value: 50_000,
            weight: 0.5,
          },
        ],
        countries: [
          {
            id: 'us',
            name: 'United States',
            value: 70_000,
            weight: 0.7,
          },
        ],
        currencies: [
          {
            id: 'usd',
            name: 'USD',
            value: 80_000,
            weight: 0.8,
          },
        ],
        assetClasses: [
          {
            id: 'equity',
            name: 'Equity',
            value: 90_000,
            weight: 0.9,
          },
        ],
      }),
    ).toEqual({
      holdings: [
        {
          id: 'msft',
          name: 'Microsoft',
          value: 40_000,
          weight: 0.4,
        },
      ],
      sectors: [
        {
          id: 'technology',
          name: 'Technology',
          value: 50_000,
          weight: 0.5,
        },
      ],
      countries: [
        {
          id: 'us',
          name: 'United States',
          value: 70_000,
          weight: 0.7,
        },
      ],
      currencies: [
        {
          id: 'usd',
          name: 'USD',
          value: 80_000,
          weight: 0.8,
        },
      ],
      assetClasses: [
        {
          id: 'equity',
          name: 'Equity',
          value: 90_000,
          weight: 0.9,
        },
      ],
    })
  })

  it('rejects negative value', () => {
    expect(() =>
      buildPortfolioAllocation({
        holdings: [
          {
            id: 'msft',
            name: 'Microsoft',
            value: -1,
            weight: 0.4,
          },
        ],
      }),
    ).toThrow('Allocation value cannot be negative.')
  })

  it('rejects negative weight', () => {
    expect(() =>
      buildPortfolioAllocation({
        holdings: [
          {
            id: 'msft',
            name: 'Microsoft',
            value: 40_000,
            weight: -0.1,
          },
        ],
      }),
    ).toThrow('Allocation weight cannot be negative.')
  })

  it('rejects weight over one', () => {
    expect(() =>
      buildPortfolioAllocation({
        holdings: [
          {
            id: 'msft',
            name: 'Microsoft',
            value: 40_000,
            weight: 1.01,
          },
        ],
      }),
    ).toThrow('Allocation weight cannot exceed 1.')
  })

  it('does not mutate the input', () => {
    const input: PortfolioAllocationInput = {
      holdings: [
        {
          id: 'msft',
          name: 'Microsoft',
          value: 40_000,
          weight: 0.4,
        },
      ],
    }

    const allocation = buildPortfolioAllocation(input)

    expect(input).toEqual({
      holdings: [
        {
          id: 'msft',
          name: 'Microsoft',
          value: 40_000,
          weight: 0.4,
        },
      ],
    })
    expect(allocation.holdings).not.toBe(input.holdings)
    expect(allocation.holdings[0]).not.toBe(input.holdings?.[0])
  })
})
