import type { Portfolio, PortfolioTransaction } from '../../types'
import type { PortfolioTransactionHandler } from './PortfolioTransactionHandler'

export class NoopPortfolioTransactionHandler implements PortfolioTransactionHandler {
  apply(portfolio: Portfolio, _transaction: PortfolioTransaction): Portfolio {
    return portfolio
  }
}
