import type { Portfolio, PortfolioTransaction } from '../../types'
import type { PortfolioTransactionHandler } from './PortfolioTransactionHandler'

export class DepositPortfolioTransactionHandler implements PortfolioTransactionHandler {
  apply(portfolio: Portfolio, transaction: PortfolioTransaction): Portfolio {
    return {
      ...portfolio,
      cashBalance: portfolio.cashBalance + transaction.amount,
    }
  }
}
