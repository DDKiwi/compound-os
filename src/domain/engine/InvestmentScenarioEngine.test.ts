import { afterEach, describe, expect, it, vi } from 'vitest'
import * as scenarioInputBuilder from '../builders/InvestmentScenarioInputBuilder'
import type { InvestmentPolicy, InvestmentScenario, Portfolio } from '../types'
import * as simulationEngine from './InvestmentSimulationEngine'
import { runInvestmentScenario } from './InvestmentScenarioEngine'

const date = new Date('2026-06-30T12:00:00.000Z')

const portfolio: Portfolio = {
  id: 'portfolio-1',
  holdings: [],
  cashBalance: 10_000,
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
    name: 'Adjust cash plan',
    startDate: new Date('2026-07-01T00:00:00.000Z'),
    actions,
  }
}

describe('runInvestmentScenario', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('returns one simulation result for a scenario with one action', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const results = runInvestmentScenario(
      createScenario([
        {
          type: 'deposit',
          amount: 5_000,
        },
      ]),
      portfolio,
      policy,
    )

    expect(results).toHaveLength(1)
    expect(results[0]?.portfolio.cashBalance).toBe(15_000)
  })

  it('returns multiple simulation results for a scenario with multiple actions', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const results = runInvestmentScenario(
      createScenario([
        {
          type: 'deposit',
          amount: 5_000,
        },
        {
          type: 'withdraw',
          amount: 2_000,
        },
      ]),
      portfolio,
      policy,
    )

    expect(results).toHaveLength(2)
  })

  it('returns results in action order', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const results = runInvestmentScenario(
      createScenario([
        {
          type: 'withdraw',
          amount: 2_000,
        },
        {
          type: 'deposit',
          amount: 5_000,
        },
      ]),
      portfolio,
      policy,
    )

    expect(results.map((result) => result.portfolio.cashBalance)).toEqual([8_000, 15_000])
  })

  it('passes portfolio and policy through the scenario input builder flow', () => {
    const buildInputsSpy = vi.spyOn(
      scenarioInputBuilder,
      'buildSimulationInputsFromScenario',
    )
    const simulateInvestmentSpy = vi.spyOn(simulationEngine, 'simulateInvestment')
    const scenario = createScenario([
      {
        type: 'deposit',
        amount: 5_000,
      },
    ])

    runInvestmentScenario(scenario, portfolio, policy)

    expect(buildInputsSpy).toHaveBeenCalledWith(scenario, portfolio, policy)
    expect(simulateInvestmentSpy).toHaveBeenCalledWith({
      portfolio,
      policy,
      action: scenario.actions[0],
    })
  })
})
