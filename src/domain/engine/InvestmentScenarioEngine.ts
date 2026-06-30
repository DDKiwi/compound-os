import type {
  InvestmentPolicy,
  InvestmentScenario,
  InvestmentSimulationResult,
  Portfolio,
} from '../types'
import * as scenarioInputBuilder from '../builders/InvestmentScenarioInputBuilder'
import * as simulationEngine from './InvestmentSimulationEngine'

export function runInvestmentScenario(
  scenario: InvestmentScenario,
  portfolio: Portfolio,
  policy: InvestmentPolicy,
): readonly InvestmentSimulationResult[] {
  return scenarioInputBuilder
    .buildSimulationInputsFromScenario(scenario, portfolio, policy)
    .map((input) => simulationEngine.simulateInvestment(input))
}

export const InvestmentScenarioEngine = {
  run: runInvestmentScenario,
} as const
