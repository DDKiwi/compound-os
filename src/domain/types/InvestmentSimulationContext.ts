import type { InvestmentSimulationInput } from './InvestmentSimulationInput'
import type { Portfolio } from './Portfolio'

export type InvestmentSimulationContext = {
  readonly input: InvestmentSimulationInput
  readonly portfolio: Portfolio
}
