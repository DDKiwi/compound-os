import type { InvestmentSimulationProjection } from './InvestmentSimulationProjection'
import type { Portfolio } from './Portfolio'

export type InvestmentSimulationSummary = {
  readonly expectedValue: number
  readonly investedCapital: number
  readonly expectedProfit: number
  readonly expectedDividendIncome?: number
}

export type InvestmentSimulationResult = {
  readonly portfolio: Portfolio
  readonly summary: InvestmentSimulationSummary
  readonly projections: readonly InvestmentSimulationProjection[]
}
