import type { Portfolio, PortfolioTransaction } from '../../types'

export interface PortfolioTransactionHandler {
  apply(portfolio: Portfolio, transaction: PortfolioTransaction): Portfolio
}
