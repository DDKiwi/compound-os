import { afterEach, describe, expect, it, vi } from 'vitest'
import * as scenarioInputBuilder from '../builders/InvestmentScenarioInputBuilder'
import type {
  InvestmentPolicy,
  InvestmentScenario,
  InvestmentSimulationResult,
  Portfolio,
} from '../types'
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

  it('returns an investment scenario result', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const scenario = createScenario([
      {
        type: 'deposit',
        amount: 5_000,
      },
    ])

    expect(runInvestmentScenario(scenario, portfolio, policy)).toMatchObject({
      scenario,
      simulations: expect.any(Array),
      summary: expect.any(Object),
    })
  })

  it('keeps the scenario on the result', () => {
    const scenario = createScenario([
      {
        type: 'deposit',
        amount: 5_000,
      },
    ])

    expect(runInvestmentScenario(scenario, portfolio, policy).scenario).toBe(scenario)
  })

  it('includes all simulation results', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const result = runInvestmentScenario(
      createScenario([
        {
          type: 'deposit',
          amount: 5_000,
        },
      ]),
      portfolio,
      policy,
    )

    expect(result.simulations).toHaveLength(1)
    expect(result.simulations[0]?.portfolio.cashBalance).toBe(15_000)
  })

  it('creates summary from the last simulation result', () => {
    const firstSimulation = createSimulationResult({
      expectedValue: 1,
      investedCapital: 2,
      expectedProfit: 3,
      expectedDividendIncome: 4,
    })
    const lastSimulation = createSimulationResult({
      expectedValue: 10,
      investedCapital: 20,
      expectedProfit: 30,
      expectedDividendIncome: 40,
    })
    const simulateInvestmentSpy = vi.spyOn(simulationEngine, 'simulateInvestment')
    simulateInvestmentSpy
      .mockReturnValueOnce(firstSimulation)
      .mockReturnValueOnce(lastSimulation)

    const result = runInvestmentScenario(
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

    expect(result.summary).toEqual({
      expectedValue: 10,
      investedCapital: 20,
      expectedProfit: 30,
      expectedDividendIncome: 40,
    })
  })

  it('preserves simulation order from action order', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    const result = runInvestmentScenario(
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

    expect(result.simulations).toHaveLength(2)
    expect(result.simulations.map((simulation) => simulation.portfolio.cashBalance)).toEqual([
      8_000,
      15_000,
    ])
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

function createSimulationResult(
  summary: InvestmentSimulationResult['summary'],
): InvestmentSimulationResult {
  return {
    portfolio,
    summary,
    projections: [],
  }
}
