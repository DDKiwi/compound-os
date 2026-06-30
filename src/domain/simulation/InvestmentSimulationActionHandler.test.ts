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

  it.each(['buy', 'sell', 'deposit', 'withdraw'] as const)(
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
})
