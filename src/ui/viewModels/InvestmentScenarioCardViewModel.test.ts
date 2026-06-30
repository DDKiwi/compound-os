import { describe, expect, it } from 'vitest'
import type {
  InvestmentScenarioResult,
  InvestmentSimulationResult,
  Portfolio,
} from '../../domain/types'
import { buildInvestmentScenarioCardViewModel } from './InvestmentScenarioCardViewModel'

const portfolio: Portfolio = {
  id: 'portfolio-1',
  holdings: [],
  cashBalance: 0,
  watchlist: [],
  journalEntries: [],
  dividendProjection: [],
}

function createSimulationResult(): InvestmentSimulationResult {
  return {
    portfolio,
    summary: {
      expectedValue: 0,
      investedCapital: 0,
      expectedProfit: 0,
      expectedDividendIncome: 0,
    },
    projections: [],
  }
}

function createScenarioResult(): InvestmentScenarioResult {
  return {
    scenario: {
      id: 'scenario-1',
      name: 'Increase dividend compounders',
      startDate: new Date('2026-07-01T00:00:00.000Z'),
      actions: [],
    },
    simulations: [createSimulationResult(), createSimulationResult()],
    summary: {
      expectedValue: 1_234_567,
      investedCapital: 1_000_000,
      expectedProfit: 234_567,
      expectedDividendIncome: 45_000,
    },
  }
}

describe('buildInvestmentScenarioCardViewModel', () => {
  it('uses the scenario name as title', () => {
    expect(buildInvestmentScenarioCardViewModel(createScenarioResult()).title).toBe(
      'Increase dividend compounders',
    )
  })

  it('formats summary values for presentation', () => {
    expect(buildInvestmentScenarioCardViewModel(createScenarioResult())).toMatchObject({
      expectedValue: '1 234 567 kr',
      investedCapital: '1 000 000 kr',
      expectedProfit: '234 567 kr',
      expectedDividendIncome: '45 000 kr',
    })
  })

  it('formats simulation count from the number of simulation results', () => {
    expect(buildInvestmentScenarioCardViewModel(createScenarioResult()).simulationCount).toBe(
      '2',
    )
  })

  it('includes the top recommendation when provided', () => {
    expect(
      buildInvestmentScenarioCardViewModel(
        createScenarioResult(),
        'Increase monthly deposits',
      ).topRecommendation,
    ).toBe('Increase monthly deposits')
  })

  it('does not include top recommendation when it is not provided', () => {
    expect(buildInvestmentScenarioCardViewModel(createScenarioResult())).not.toHaveProperty(
      'topRecommendation',
    )
  })

  it('does not mutate the input scenario result', () => {
    const scenarioResult = createScenarioResult()
    const expectedScenarioResult = structuredClone(scenarioResult)

    buildInvestmentScenarioCardViewModel(scenarioResult, 'Increase monthly deposits')

    expect(scenarioResult).toEqual(expectedScenarioResult)
  })
})
