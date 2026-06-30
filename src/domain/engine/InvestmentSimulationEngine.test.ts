import { describe, expect, it } from 'vitest'
import type { InvestmentPolicy, InvestmentSimulationInput, Portfolio } from '../types'
import { InvestmentSimulationEngine, simulateInvestment } from './InvestmentSimulationEngine'

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

function createInput(): InvestmentSimulationInput {
  return {
    portfolio,
    policy,
    action: {
      type: 'deposit',
      amount: 10_000,
    },
  }
}

describe('simulateInvestment', () => {
  it('can be called and returns an investment simulation result', () => {
    expect(simulateInvestment(createInput())).toEqual({
      portfolio,
      summary: {
        expectedValue: 0,
        investedCapital: 0,
        expectedProfit: 0,
      },
      projections: [],
    })
  })

  it('exposes the same behavior through InvestmentSimulationEngine', () => {
    const input = createInput()

    expect(InvestmentSimulationEngine.simulate(input)).toEqual(simulateInvestment(input))
  })

  it('iterates over the simulation timeline without changing the stub result', () => {
    expect(simulateInvestment(createInput())).toEqual({
      portfolio,
      summary: {
        expectedValue: 0,
        investedCapital: 0,
        expectedProfit: 0,
      },
      projections: [],
    })
  })
})
