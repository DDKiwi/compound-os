import { describe, expect, it } from 'vitest'
import type { Holding, Portfolio, PortfolioTransactionType } from '../types'
import {
  applyPortfolioTransaction,
  getAllocationByAccountType,
  getAllocationByClassification,
  getTotalInvestedCapital,
  getTotalMarketValue,
} from './portfolioEngine'

const holdings: Holding[] = [
  {
    id: 'global-index',
    name: 'LF Global',
    ticker: 'LFGL',
    accountType: 'ISK',
    marketValue: 600_000,
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
  },
  {
    id: 'cash',
    name: 'Kassa',
    ticker: 'CASH',
    accountType: 'Cash',
    marketValue: 100_000,
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
]

const portfolio: Portfolio = {
  id: 'portfolio-1',
  holdings: [],
  cashBalance: 25_000,
  watchlist: [],
  journalEntries: [],
  dividendProjection: [],
}

describe('portfolioEngine', () => {
  it('calculates total market value', () => {
    expect(getTotalMarketValue(holdings)).toBe(1_000_000)
  })

  it('calculates invested capital excluding cash', () => {
    expect(getTotalInvestedCapital(holdings)).toBe(900_000)
  })

  it('calculates allocation by account type as decimal weights', () => {
    expect(getAllocationByAccountType(holdings)).toEqual([
      { name: 'ISK', value: 600_000, weight: 0.6 },
      { name: 'KF', value: 300_000, weight: 0.3 },
      { name: 'Cash', value: 100_000, weight: 0.1 },
    ])
  })

  it('calculates allocation by classification as decimal weights', () => {
    expect(getAllocationByClassification(holdings)).toEqual([
      { name: 'GlobalIndex', value: 600_000, weight: 0.6 },
      { name: 'SuperCompounder', value: 300_000, weight: 0.3 },
      { name: 'YieldInstrument', value: 100_000, weight: 0.1 },
    ])
  })

  it('applies deposit transactions to cashBalance immutably', () => {
    const result = applyPortfolioTransaction(portfolio, {
      id: 'deposit-2026-06-30T12:00:00.000Z',
      type: 'deposit',
      date: new Date('2026-06-30T12:00:00.000Z'),
      amount: 10_000,
    })

    expect(result.cashBalance).toBe(35_000)
    expect(result).not.toBe(portfolio)
    expect(portfolio.cashBalance).toBe(25_000)
  })

  it('applies withdraw transactions to cashBalance immutably', () => {
    const result = applyPortfolioTransaction(portfolio, {
      id: 'withdraw-2026-06-30T12:00:00.000Z',
      type: 'withdraw',
      date: new Date('2026-06-30T12:00:00.000Z'),
      amount: 10_000,
    })

    expect(result.cashBalance).toBe(15_000)
    expect(result).not.toBe(portfolio)
    expect(portfolio.cashBalance).toBe(25_000)
  })

  it.each(['buy', 'sell', 'dividend', 'fee', 'tax'] satisfies PortfolioTransactionType[])(
    'returns portfolio unchanged for unimplemented %s transactions',
    (type) => {
      const result = applyPortfolioTransaction(portfolio, {
        id: `${type}-2026-06-30T12:00:00.000Z`,
        type,
        date: new Date('2026-06-30T12:00:00.000Z'),
        amount: 10_000,
      })

      expect(result).toBe(portfolio)
      expect(portfolio.cashBalance).toBe(25_000)
    },
  )
})
