import { describe, expect, it } from 'vitest'
import type {
  InvestmentPolicy,
  InvestmentSimulationContext,
  InvestmentSimulationStep,
  Portfolio,
} from '../types'
import { processInvestmentSimulationStep } from './InvestmentSimulationStepProcessor'

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

const step: InvestmentSimulationStep = {
  date: new Date('2026-06-30T12:00:00.000Z'),
  action: context.input.action,
  portfolio,
}

describe('processInvestmentSimulationStep', () => {
  it('returns the updated simulation context from the action handler', () => {
    const result = processInvestmentSimulationStep(context, step)

    expect(result).not.toBe(context)
    expect(result.portfolio.cashBalance).toBe(10_000)
  })
})
