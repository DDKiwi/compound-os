import type {
  InvestmentPolicy,
  InvestmentScenario,
  InvestmentScenarioResult,
  InvestmentScenarioSummary,
  InvestmentSimulationResult,
  Portfolio,
} from '../types'
import * as scenarioInputBuilder from '../builders/InvestmentScenarioInputBuilder'
import * as simulationEngine from './InvestmentSimulationEngine'

export function runInvestmentScenario(
  scenario: InvestmentScenario,
  portfolio: Portfolio,
  policy: InvestmentPolicy,
): InvestmentScenarioResult {
  const simulations = scenarioInputBuilder
    .buildSimulationInputsFromScenario(scenario, portfolio, policy)
    .map((input) => simulationEngine.simulateInvestment(input))

  return {
    scenario,
    simulations,
    summary: buildScenarioSummary(simulations),
  }
}

export const InvestmentScenarioEngine = {
  run: runInvestmentScenario,
} as const

function buildScenarioSummary(
  simulations: readonly InvestmentSimulationResult[],
): InvestmentScenarioSummary {
  const lastSimulation = simulations[simulations.length - 1]

  return {
    expectedValue: lastSimulation?.summary.expectedValue ?? 0,
    investedCapital: lastSimulation?.summary.investedCapital ?? 0,
    expectedProfit: lastSimulation?.summary.expectedProfit ?? 0,
    expectedDividendIncome: lastSimulation?.summary.expectedDividendIncome ?? 0,
  }
}
