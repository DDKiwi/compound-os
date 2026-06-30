import type { InvestmentPolicy } from './InvestmentPolicy'
import type { Portfolio } from './Portfolio'

export type InvestmentSimulationAction = {
  readonly type: 'buy' | 'sell' | 'deposit' | 'withdraw'
  readonly holdingId?: string
  readonly amount?: number
  readonly quantity?: number
}

export type InvestmentSimulationInput = {
  readonly portfolio: Portfolio
  readonly policy: InvestmentPolicy
  readonly action: InvestmentSimulationAction
}
