import { describe, expect, it } from 'vitest'
import type {
  Holding,
  InvestmentPolicy,
  InvestmentSimulationContext,
  InvestmentSimulationTimeline,
  Portfolio,
} from '../types'
import { buildSimulationProjection } from './SimulationProjectionBuilder'

const firstDate = new Date('2026-06-30T12:00:00.000Z')
const lastDate = new Date('2026-07-31T12:00:00.000Z')

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

const portfolio: Portfolio = {
  id: 'portfolio-1',
  holdings: [holding],
  cashBalance: 25_000,
  watchlist: [],
  journalEntries: [],
  dividendProjection: [],
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

const context: InvestmentSimulationContext = {
  input: {
    portfolio,
    policy,
    action: {
      type: 'deposit',
      amount: 10_000,
    },
  },
  portfolio,
}

const timeline: InvestmentSimulationTimeline = {
  steps: [
    {
      date: firstDate,
      action: context.input.action,
      portfolio,
    },
    {
      date: lastDate,
      action: context.input.action,
      portfolio,
    },
  ],
}

describe('buildSimulationProjection', () => {
  it('builds a simulation projection from context and timeline', () => {
    expect(buildSimulationProjection(context, timeline)).toEqual({
      date: lastDate,
      portfolioValue: 325_000,
      investedCapital: 325_000,
      expectedProfit: 0,
      expectedDividendIncome: 0,
    })
  })

  it('calculates portfolioValue from cashBalance and holdings marketValue', () => {
    expect(buildSimulationProjection(context, timeline).portfolioValue).toBe(325_000)
  })

  it('uses the last simulation step date', () => {
    expect(buildSimulationProjection(context, timeline).date).toBe(lastDate)
  })
})
