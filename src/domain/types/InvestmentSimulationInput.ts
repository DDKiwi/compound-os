import type { Currency } from './Holding'
import type { InvestmentPolicy } from './InvestmentPolicy'
import type { Portfolio } from './Portfolio'

export type InvestmentSimulationAction = {
  readonly type: 'buy' | 'sell' | 'deposit' | 'withdraw'
  readonly holdingId?: string
  readonly amount?: number
  readonly ticker?: string
  readonly quantity?: number
  readonly price?: number
  readonly currency?: Currency
}

export type InvestmentSimulationInput = {
  readonly portfolio: Portfolio
  readonly policy: InvestmentPolicy
  readonly action: InvestmentSimulationAction
}
