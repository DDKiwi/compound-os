import { describe, expect, it } from 'vitest'
import type {
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

const portfolio: Portfolio = {
  id: 'portfolio-1',
  holdings: [],
  cashBalance: 0,
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
  it.each([
    ['buy', BuySimulationActionHandler],
    ['sell', SellSimulationActionHandler],
    ['deposit', DepositSimulationActionHandler],
    ['withdraw', WithdrawSimulationActionHandler],
  ] as const)('selects the %s handler', (actionType, Handler) => {
    expect(getInvestmentSimulationActionHandler(actionType)).toBeInstanceOf(Handler)
  })

  it.each(['buy', 'sell'] as const)(
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

  it('increases cashBalance for deposit actions', () => {
    const action: InvestmentSimulationAction = {
      type: 'deposit',
      amount: 10_000,
    }
    const context = createContext(action)
    const result = new DepositSimulationActionHandler().handle(context, createStep(action))

    expect(result.portfolio.cashBalance).toBe(10_000)
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
