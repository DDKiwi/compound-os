import type { Portfolio, PortfolioTransaction } from '../../types'
import type { PortfolioTransactionHandler } from './PortfolioTransactionHandler'

export class SellPortfolioTransactionHandler implements PortfolioTransactionHandler {
  apply(portfolio: Portfolio, transaction: PortfolioTransaction): Portfolio {
    const cashBalance = portfolio.cashBalance + transaction.amount

    return {
      ...portfolio,
      cashBalance,
      holdings: portfolio.holdings.map((holding) => {
        if (holding.ticker !== transaction.ticker) {
          return holding
        }

        return {
          ...holding,
          quantity: (holding.quantity ?? 0) - (transaction.quantity ?? 0),
          marketValue: holding.marketValue - transaction.amount,
        }
      }),
    }
  }
}
