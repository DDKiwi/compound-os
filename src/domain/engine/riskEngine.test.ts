import { describe, expect, it } from 'vitest'
import type { Goal, Holding, InvestmentRule } from '../types'
import {
  evaluateInvestmentRules,
  getCashBufferProgress,
  getSpeculativeExposurePercent,
  isSpeculativeExposureWithinLimit,
} from './riskEngine'

const holdings: Holding[] = [
  {
    id: 'global-index',
    name: 'LF Global',
    ticker: 'LFGL',
    accountType: 'ISK',
    marketValue: 900_000,
    monthlyContribution: 10_000,
    assetType: 'Fund',
    classification: 'GlobalIndex',
    portfolioRole: 'Core',
    moatScore: 4,
    countryExposure: 'Global',
    currency: 'SEK',
    expectedDividendYield: 0,
    expectedDividendGrowth: 0,
    isWatchlist: false,
    isSpeculative: false,
    notes: '',
  },
  {
    id: 'speculative',
    name: 'T1 Energy',
    ticker: 'TE',
    accountType: 'ISK',
    marketValue: 20_000,
    monthlyContribution: 0,
    assetType: 'Stock',
    classification: 'SpeculativeGrowth',
    portfolioRole: 'Growth',
    moatScore: 1,
    countryExposure: 'Other',
    currency: 'SEK',
    expectedDividendYield: 0,
    expectedDividendGrowth: 0,
    isWatchlist: false,
    isSpeculative: true,
    notes: '',
  },
  {
    id: 'cash',
    name: 'Kassa',
    ticker: 'CASH',
    accountType: 'Cash',
    marketValue: 80_000,
    monthlyContribution: 0,
    assetType: 'Cash',
    classification: 'YieldInstrument',
    portfolioRole: 'CashReserve',
    moatScore: 0,
    countryExposure: 'Sweden',
    currency: 'SEK',
    expectedDividendYield: 0,
    expectedDividendGrowth: 0,
    isWatchlist: false,
    isSpeculative: false,
    notes: '',
  },
  {
    id: 'watchlist-speculative',
    name: 'Watchlist Case',
    ticker: 'WATCH',
    accountType: 'ISK',
    marketValue: 500_000,
    monthlyContribution: 0,
    assetType: 'Stock',
    classification: 'SpeculativeGrowth',
    portfolioRole: 'Watchlist',
    moatScore: 1,
    countryExposure: 'Other',
    currency: 'SEK',
    expectedDividendYield: 0,
    expectedDividendGrowth: 0,
    isWatchlist: true,
    isSpeculative: true,
    notes: '',
  },
]

const goals: Goal = {
  monthlyDividendGoal: 10_000,
  targetBuffer: 100_000,
  targetNetWorth: 3_000_000,
}

const rules: InvestmentRule[] = [
  {
    id: 'high-risk-limit',
    title: 'High risk',
    description: '',
    severity: 'critical',
    category: 'risk',
    evaluate: () => ({
      ruleId: 'high-risk-limit',
      title: 'High risk',
      status: 'pass',
      message: 'Rule is not implemented yet.',
    }),
  },
]

describe('riskEngine', () => {
  it('calculates speculative exposure percent excluding watchlist holdings', () => {
    expect(getSpeculativeExposurePercent(holdings)).toBeCloseTo(20_000 / 920_000)
    expect(isSpeculativeExposureWithinLimit(holdings, 2)).toBe(false)
  })

  it('calculates cash buffer progress', () => {
    expect(getCashBufferProgress(holdings, goals.targetBuffer)).toBe(0.8)
  })

  it('evaluates speculative exposure and cash buffer rules', () => {
    const results = evaluateInvestmentRules(holdings, goals, rules)

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ ruleId: 'high-risk-limit', status: 'pass' }),
        expect.objectContaining({ ruleId: 'cash-buffer-target', status: 'warning' }),
      ]),
    )
  })
})
