import type { InvestmentScenario } from './InvestmentScenario'
import type { InvestmentSimulationResult } from './InvestmentSimulationResult'

export type InvestmentScenarioResult = {
  readonly scenario: InvestmentScenario
  readonly simulations: readonly InvestmentSimulationResult[]
  readonly summary: InvestmentScenarioSummary
}

export type InvestmentScenarioSummary = {
  readonly expectedValue: number
  readonly investedCapital: number
  readonly expectedProfit: number
  readonly expectedDividendIncome: number
}
