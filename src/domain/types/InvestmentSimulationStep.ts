import type { InvestmentSimulationAction } from './InvestmentSimulationInput'
import type { Portfolio } from './Portfolio'

export type InvestmentSimulationStep = {
  readonly date: Date
  readonly action: InvestmentSimulationAction
  readonly portfolio: Portfolio
}
