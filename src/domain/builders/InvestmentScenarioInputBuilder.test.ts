import { describe, expect, it } from 'vitest'
import type { InvestmentPolicy, InvestmentScenario, Portfolio } from '../types'
import { buildSimulationInputsFromScenario } from './InvestmentScenarioInputBuilder'

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

function createScenario(
  actions: InvestmentScenario['actions'],
): InvestmentScenario {
  return {
    id: 'scenario-1',
    name: 'Increase cash allocation',
    startDate: new Date('2026-07-01T00:00:00.000Z'),
    actions,
  }
}

describe('buildSimulationInputsFromScenario', () => {
  it('builds one simulation input for a scenario with one action', () => {
    const action = {
      type: 'deposit' as const,
      amount: 10_000,
    }

    expect(buildSimulationInputsFromScenario(createScenario([action]), portfolio, policy)).toEqual([
      {
        portfolio,
        policy,
        action,
      },
    ])
  })

  it('builds multiple simulation inputs for a scenario with multiple actions', () => {
    const inputs = buildSimulationInputsFromScenario(
      createScenario([
        {
          type: 'deposit',
          amount: 10_000,
        },
        {
          type: 'buy',
          ticker: 'INVE B',
          quantity: 10,
          price: 300,
        },
      ]),
      portfolio,
      policy,
    )

    expect(inputs).toHaveLength(2)
  })

  it('passes portfolio and policy through unchanged', () => {
    const [input] = buildSimulationInputsFromScenario(
      createScenario([
        {
          type: 'withdraw',
          amount: 1_000,
        },
      ]),
      portfolio,
      policy,
    )

    expect(input.portfolio).toBe(portfolio)
    expect(input.policy).toBe(policy)
  })

  it('preserves action order', () => {
    const firstAction = {
      type: 'deposit' as const,
      amount: 10_000,
    }
    const secondAction = {
      type: 'sell' as const,
      holdingId: 'holding-1',
      quantity: 5,
      price: 200,
    }

    const inputs = buildSimulationInputsFromScenario(
      createScenario([firstAction, secondAction]),
      portfolio,
      policy,
    )

    expect(inputs.map((input) => input.action)).toEqual([firstAction, secondAction])
  })
})
