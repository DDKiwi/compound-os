import { afterEach, describe, expect, it, vi } from 'vitest'
import type {
  Holding,
  InvestmentPolicy,
  InvestmentSimulationAction,
  InvestmentSimulationContext,
  InvestmentSimulationStep,
  Portfolio,
} from '../types'
import {
  BuySimulationActionHandler,
  DepositSimulationActionHandler,
  SellSimulationActionHandler,
  WithdrawSimulationActionHandler,
  getInvestmentSimulationActionHandler,
} from './InvestmentSimulationActionHandler'
import * as portfolioTransactionFactory from '../builders/PortfolioTransactionFactory'
import * as portfolioEngine from '../engine/portfolioEngine'

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
  quantity: 100,
  averageCost: 2_000,
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

function createContext(action: InvestmentSimulationAction): InvestmentSimulationContext {
  return {
    input: {
      portfolio,
      policy,
      action,
    },
    portfolio,
  }
}

function createStep(action: InvestmentSimulationAction): InvestmentSimulationStep {
  return {
    date: new Date('2026-06-30T12:00:00.000Z'),
    action,
    portfolio,
  }
}

describe('investment simulation action handlers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it.each([
    ['buy', BuySimulationActionHandler],
    ['sell', SellSimulationActionHandler],
    ['deposit', DepositSimulationActionHandler],
    ['withdraw', WithdrawSimulationActionHandler],
  ] as const)('selects the %s handler', (actionType, Handler) => {
    expect(getInvestmentSimulationActionHandler(actionType)).toBeInstanceOf(Handler)
  })

  it.each(['sell'] as const)(
    'returns context unchanged for %s actions',
    (actionType) => {
      const action: InvestmentSimulationAction = {
        type: actionType,
        amount: 10_000,
      }
      const context = createContext(action)
      const step = createStep(action)

      expect(getInvestmentSimulationActionHandler(actionType).handle(context, step)).toBe(context)
    },
  )

  it('applies buy actions through a portfolio transaction', () => {
    const action: InvestmentSimulationAction = {
      type: 'buy',
      ticker: 'INVE B',
      amount: 50_000,
      quantity: 20,
      price: 2_500,
      currency: 'SEK',
    }
    const startingPortfolio: Portfolio = {
      ...portfolio,
      holdings: [holding],
      cashBalance: 75_000,
    }
    const context = {
      ...createContext(action),
      portfolio: startingPortfolio,
    }
    const step = createStep(action)
    const createTransactionSpy = vi.spyOn(
      portfolioTransactionFactory,
      'createPortfolioTransactionFromSimulationStep',
    )
    const applyPortfolioTransactionSpy = vi.spyOn(portfolioEngine, 'applyPortfolioTransaction')

    new BuySimulationActionHandler().handle(context, step)

    expect(createTransactionSpy).toHaveBeenCalledWith(step)
    expect(applyPortfolioTransactionSpy).toHaveBeenCalledWith(context.portfolio, {
      id: 'buy-2026-06-30T12:00:00.000Z',
      type: 'buy',
      date: step.date,
      amount: 50_000,
      ticker: 'INVE B',
      quantity: 20,
      price: 2_500,
      currency: 'SEK',
      origin: 'simulation',
    })
  })

  it('decreases cashBalance and updates holdings for buy actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'buy',
      ticker: 'INVE B',
      amount: 50_000,
      quantity: 20,
      price: 2_500,
      currency: 'SEK',
    }
    const startingPortfolio: Portfolio = {
      ...portfolio,
      holdings: [holding],
      cashBalance: 75_000,
    }
    const context = {
      ...createContext(action),
      portfolio: startingPortfolio,
    }
    const result = new BuySimulationActionHandler().handle(context, createStep(action))

    expect(result.portfolio.cashBalance).toBe(25_000)
    expect(result.portfolio.holdings[0]).toEqual({
      ...holding,
      quantity: 120,
      marketValue: 350_000,
      averageCost: (100 * 2_000 + 20 * 2_500) / 120,
    })
  })

  it('does not mutate the original portfolio for buy actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'buy',
      ticker: 'INVE B',
      amount: 50_000,
      quantity: 20,
      price: 2_500,
      currency: 'SEK',
    }
    const startingPortfolio: Portfolio = {
      ...portfolio,
      holdings: [holding],
      cashBalance: 75_000,
    }
    const context = {
      ...createContext(action),
      portfolio: startingPortfolio,
    }

    new BuySimulationActionHandler().handle(context, createStep(action))

    expect(startingPortfolio.cashBalance).toBe(75_000)
    expect(startingPortfolio.holdings).toEqual([holding])
    expect(context.portfolio).toBe(startingPortfolio)
  })

  it('returns a new context and portfolio for buy actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'buy',
      ticker: 'INVE B',
      amount: 50_000,
      quantity: 20,
      price: 2_500,
      currency: 'SEK',
    }
    const context = {
      ...createContext(action),
      portfolio: {
        ...portfolio,
        holdings: [holding],
        cashBalance: 75_000,
      },
    }
    const result = new BuySimulationActionHandler().handle(context, createStep(action))

    expect(result).not.toBe(context)
    expect(result.portfolio).not.toBe(context.portfolio)
  })

  it('increases cashBalance for deposit actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'deposit',
      amount: 10_000,
    }
    const context = createContext(action)
    const result = new DepositSimulationActionHandler().handle(context, createStep(action))

    expect(result.portfolio.cashBalance).toBe(10_000)
  })

  it('applies deposit actions through a portfolio transaction', () => {
    const action: InvestmentSimulationAction = {
      type: 'deposit',
      amount: 10_000,
    }
    const context = createContext(action)
    const step = createStep(action)
    const applyPortfolioTransactionSpy = vi.spyOn(portfolioEngine, 'applyPortfolioTransaction')

    new DepositSimulationActionHandler().handle(context, step)

    expect(applyPortfolioTransactionSpy).toHaveBeenCalledWith(context.portfolio, {
      id: 'deposit-2026-06-30T12:00:00.000Z',
      type: 'deposit',
      date: step.date,
      amount: 10_000,
      origin: 'simulation',
    })

  })

  it('does not mutate the original portfolio for deposit actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'deposit',
      amount: 10_000,
    }
    const context = createContext(action)

    new DepositSimulationActionHandler().handle(context, createStep(action))

    expect(portfolio.cashBalance).toBe(0)
    expect(context.portfolio).toBe(portfolio)
  })

  it('returns a new context and portfolio for deposit actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'deposit',
      amount: 10_000,
    }
    const context = createContext(action)
    const result = new DepositSimulationActionHandler().handle(context, createStep(action))

    expect(result).not.toBe(context)
    expect(result.portfolio).not.toBe(context.portfolio)
  })

  it('decreases cashBalance for withdraw actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'withdraw',
      amount: 10_000,
    }
    const context = {
      ...createContext(action),
      portfolio: {
        ...portfolio,
        cashBalance: 25_000,
      },
    }
    const result = new WithdrawSimulationActionHandler().handle(context, createStep(action))

    expect(result.portfolio.cashBalance).toBe(15_000)
  })

  it('applies withdraw actions through a portfolio transaction', () => {
    const action: InvestmentSimulationAction = {
      type: 'withdraw',
      amount: 10_000,
    }
    const context = {
      ...createContext(action),
      portfolio: {
        ...portfolio,
        cashBalance: 25_000,
      },
    }
    const step = createStep(action)
    const applyPortfolioTransactionSpy = vi.spyOn(portfolioEngine, 'applyPortfolioTransaction')

    new WithdrawSimulationActionHandler().handle(context, step)

    expect(applyPortfolioTransactionSpy).toHaveBeenCalledWith(context.portfolio, {
      id: 'withdraw-2026-06-30T12:00:00.000Z',
      type: 'withdraw',
      date: step.date,
      amount: 10_000,
      origin: 'simulation',
    })

  })

  it('does not mutate the original portfolio for withdraw actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'withdraw',
      amount: 10_000,
    }
    const startingPortfolio: Portfolio = {
      ...portfolio,
      cashBalance: 25_000,
    }
    const context = {
      ...createContext(action),
      portfolio: startingPortfolio,
    }

    new WithdrawSimulationActionHandler().handle(context, createStep(action))

    expect(startingPortfolio.cashBalance).toBe(25_000)
    expect(context.portfolio).toBe(startingPortfolio)
  })

  it('returns a new context and portfolio for withdraw actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'withdraw',
      amount: 10_000,
    }
    const context = {
      ...createContext(action),
      portfolio: {
        ...portfolio,
        cashBalance: 25_000,
      },
    }
    const result = new WithdrawSimulationActionHandler().handle(context, createStep(action))

    expect(result).not.toBe(context)
    expect(result.portfolio).not.toBe(context.portfolio)
  })
})
