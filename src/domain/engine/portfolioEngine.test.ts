import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Holding, Portfolio, PortfolioTransactionType } from '../types'
import {
  BuyPortfolioTransactionHandler,
  DepositPortfolioTransactionHandler,
  SellPortfolioTransactionHandler,
  WithdrawPortfolioTransactionHandler,
} from './portfolio-transactions'
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
  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it('delegates portfolio transactions to the matching handler', () => {
    const depositTransaction = {
      id: 'deposit-2026-06-30T12:00:00.000Z',
      type: 'deposit' as const,
      date: new Date('2026-06-30T12:00:00.000Z'),
      amount: 10_000,
    }
    const depositApply = vi.spyOn(DepositPortfolioTransactionHandler.prototype, 'apply')
    const withdrawApply = vi.spyOn(WithdrawPortfolioTransactionHandler.prototype, 'apply')
    const buyApply = vi.spyOn(BuyPortfolioTransactionHandler.prototype, 'apply')
    const sellApply = vi.spyOn(SellPortfolioTransactionHandler.prototype, 'apply')

    applyPortfolioTransaction(portfolio, depositTransaction)

    expect(depositApply).toHaveBeenCalledWith(portfolio, depositTransaction)
    expect(withdrawApply).not.toHaveBeenCalled()
    expect(buyApply).not.toHaveBeenCalled()
    expect(sellApply).not.toHaveBeenCalled()
  })

  it('applies buy transactions to existing holdings immutably', () => {
    const originalHolding: Holding = {
      ...holdings[1],
      quantity: 100,
      averageCost: 2_000,
      marketValue: 300_000,
    }
    const buyPortfolio: Portfolio = {
      ...portfolio,
      holdings: [holdings[0], originalHolding],
    }

    const result = applyPortfolioTransaction(buyPortfolio, {
      id: 'buy-2026-06-30T12:00:00.000Z',
      type: 'buy',
      date: new Date('2026-06-30T12:00:00.000Z'),
      ticker: 'INVE B',
      amount: 50_000,
      quantity: 20,
      price: 2_500,
      currency: 'SEK',
    })

    expect(result.cashBalance).toBe(-25_000)
    expect(result.holdings).toHaveLength(2)
    expect(result.holdings[1]).toEqual({
      ...originalHolding,
      quantity: 120,
      marketValue: 350_000,
      averageCost: (100 * 2_000 + 20 * 2_500) / 120,
    })
    expect(result).not.toBe(buyPortfolio)
    expect(result.holdings).not.toBe(buyPortfolio.holdings)
    expect(result.holdings[1]).not.toBe(originalHolding)
    expect(buyPortfolio.cashBalance).toBe(25_000)
    expect(originalHolding).toEqual({
      ...holdings[1],
      quantity: 100,
      averageCost: 2_000,
      marketValue: 300_000,
    })
  })

  it('does not create a holding when applying buy transactions to unknown tickers', () => {
    const buyPortfolio: Portfolio = {
      ...portfolio,
      holdings: [holdings[0]],
    }

    const result = applyPortfolioTransaction(buyPortfolio, {
      id: 'buy-2026-06-30T12:00:00.000Z',
      type: 'buy',
      date: new Date('2026-06-30T12:00:00.000Z'),
      ticker: 'UNKNOWN',
      amount: 10_000,
      quantity: 5,
      price: 2_000,
      currency: 'SEK',
    })

    expect(result.cashBalance).toBe(15_000)
    expect(result.holdings).toEqual([holdings[0]])
    expect(result.holdings).not.toBe(buyPortfolio.holdings)
    expect(buyPortfolio.holdings).toEqual([holdings[0]])
  })

  it('applies sell transactions to existing holdings immutably', () => {
    const originalHolding: Holding = {
      ...holdings[1],
      quantity: 100,
      averageCost: 2_000,
      marketValue: 300_000,
    }
    const sellPortfolio: Portfolio = {
      ...portfolio,
      holdings: [holdings[0], originalHolding],
    }

    const result = applyPortfolioTransaction(sellPortfolio, {
      id: 'sell-2026-06-30T12:00:00.000Z',
      type: 'sell',
      date: new Date('2026-06-30T12:00:00.000Z'),
      ticker: 'INVE B',
      amount: 50_000,
      quantity: 20,
      price: 2_500,
      currency: 'SEK',
    })

    expect(result.cashBalance).toBe(75_000)
    expect(result.holdings).toHaveLength(2)
    expect(result.holdings[1]).toEqual({
      ...originalHolding,
      quantity: 80,
      marketValue: 250_000,
      averageCost: 2_000,
    })
    expect(result).not.toBe(sellPortfolio)
    expect(result.holdings).not.toBe(sellPortfolio.holdings)
    expect(result.holdings[1]).not.toBe(originalHolding)
    expect(sellPortfolio.cashBalance).toBe(25_000)
    expect(originalHolding).toEqual({
      ...holdings[1],
      quantity: 100,
      averageCost: 2_000,
      marketValue: 300_000,
    })
  })

  it('does not create a holding when applying sell transactions to unknown tickers', () => {
    const sellPortfolio: Portfolio = {
      ...portfolio,
      holdings: [holdings[0]],
    }

    const result = applyPortfolioTransaction(sellPortfolio, {
      id: 'sell-2026-06-30T12:00:00.000Z',
      type: 'sell',
      date: new Date('2026-06-30T12:00:00.000Z'),
      ticker: 'UNKNOWN',
      amount: 10_000,
      quantity: 5,
      price: 2_000,
      currency: 'SEK',
    })

    expect(result.cashBalance).toBe(35_000)
    expect(result.holdings).toEqual([holdings[0]])
    expect(result.holdings).not.toBe(sellPortfolio.holdings)
    expect(sellPortfolio.holdings).toEqual([holdings[0]])
  })

  it.each(['dividend', 'fee', 'tax'] satisfies PortfolioTransactionType[])(
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
