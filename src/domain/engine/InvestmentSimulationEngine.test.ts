import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Holding, InvestmentPolicy, InvestmentSimulationInput, Portfolio } from '../types'
import { InvestmentSimulationEngine, simulateInvestment } from './InvestmentSimulationEngine'

const date = new Date('2026-06-30T12:00:00.000Z')

const portfolio: Portfolio = {
  id: 'portfolio-1',
  holdings: [],
  cashBalance: 0,
  watchlist: [],
  journalEntries: [],
  dividendProjection: [],
}

const holding: Holding = {
  id: 'compounder',
  name: 'Investor',
  ticker: 'INVE B',
  accountType: 'KF',
  marketValue: 300_000,
  monthlyContribution: 2_000,
  assetType: 'Stock',
  classification: 'SuperCompounder',
  portfolioRole: 'Growth',
  moatScore: 5,
  countryExposure: 'Sweden',
  currency: 'SEK',
  expectedDividendYield: 2,
  expectedDividendGrowth: 6,
  isWatchlist: false,
  isSpeculative: false,
  notes: '',
}

const policy: InvestmentPolicy = {
  id: 'policy-1',
  name: 'Long-term policy',
  philosophy: {
    text: 'Own durable compounders.',
  },
  riskTolerance: 'balanced',
  allocationRules: [],
  positionRule: {
    id: 'max-position-size',
    maxWeight: 0.25,
  },
  exposureRule: {
    id: 'max-sector-exposure',
    exposureType: 'sector',
    maxWeight: 0.4,
  },
  dividendPolicy: {
    preference: 'growth',
  },
  rebalancingRule: {
    id: 'rebalancing-threshold',
    driftThreshold: 0.1,
  },
}

function createInput(inputPortfolio = portfolio): InvestmentSimulationInput {
  return {
    portfolio: inputPortfolio,
    policy,
    action: {
      type: 'deposit',
      amount: 10_000,
    },
  }
}

describe('simulateInvestment', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('can be called and returns an investment simulation result', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    expect(simulateInvestment(createInput())).toEqual({
      portfolio: {
        ...portfolio,
        cashBalance: 10_000,
      },
      summary: {
        expectedValue: 0,
        investedCapital: 0,
        expectedProfit: 0,
      },
      projections: [
        {
          date,
          portfolioValue: 10_000,
          investedCapital: 10_000,
          expectedProfit: 0,
          expectedDividendIncome: 0,
        },
      ],
    })
  })

  it('exposes the same behavior through InvestmentSimulationEngine', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const input = createInput()

    expect(InvestmentSimulationEngine.simulate(input)).toEqual(simulateInvestment(input))
  })

  it('iterates over the simulation timeline without changing the summary', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    expect(simulateInvestment(createInput())).toEqual({
      portfolio: {
        ...portfolio,
        cashBalance: 10_000,
      },
      summary: {
        expectedValue: 0,
        investedCapital: 0,
        expectedProfit: 0,
      },
      projections: [
        {
          date,
          portfolioValue: 10_000,
          investedCapital: 10_000,
          expectedProfit: 0,
          expectedDividendIncome: 0,
        },
      ],
    })
  })

  it('returns the updated portfolio instance from the simulation context', () => {
    const result = simulateInvestment(createInput())

    expect(result.portfolio).not.toBe(portfolio)
    expect(result.portfolio.cashBalance).toBe(10_000)
  })

  it('creates exactly one projection after processing simulation steps', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const result = simulateInvestment(createInput())

    expect(result.projections).toHaveLength(1)
  })

  it('creates a projection with portfolioValue from cashBalance and holdings marketValue', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const result = simulateInvestment(
      createInput({
        ...portfolio,
        holdings: [holding],
        cashBalance: 25_000,
      }),
    )

    expect(result.projections[0]).toMatchObject({
      portfolioValue: 335_000,
      investedCapital: 335_000,
      expectedProfit: 0,
      expectedDividendIncome: 0,
    })
  })

  it('uses the last simulation step date for the projection', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const result = simulateInvestment(createInput())

    expect(result.projections[0]?.date).toEqual(date)
  })
})
