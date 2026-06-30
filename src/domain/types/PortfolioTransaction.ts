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
  readonly holdingId?: string
  readonly quantity?: number
  readonly price?: number
  readonly currency?: string
  readonly note?: string
}
