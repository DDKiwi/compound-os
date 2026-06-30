import type { Currency } from './Holding'

export type PortfolioTransactionType =
  | 'deposit'
  | 'withdraw'
  | 'buy'
  | 'sell'
  | 'dividend'
  | 'fee'
  | 'tax'

export type PortfolioTransaction = {
  readonly id: string
  readonly type: PortfolioTransactionType
  readonly date: Date
  readonly amount: number
  readonly ticker?: string
  readonly quantity?: number
  readonly price?: number
  readonly currency?: Currency
  readonly note?: string
  readonly origin?: 'manual' | 'simulation' | 'import'
}
