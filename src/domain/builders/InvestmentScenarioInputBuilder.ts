import type {
  InvestmentPolicy,
  InvestmentScenario,
  InvestmentSimulationInput,
  Portfolio,
} from '../types'

export function buildSimulationInputsFromScenario(
  scenario: InvestmentScenario,
  portfolio: Portfolio,
  policy: InvestmentPolicy,
): readonly InvestmentSimulationInput[] {
  return scenario.actions.map((action) => ({
    portfolio,
    policy,
    action,
  }))
}
