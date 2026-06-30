import type { Portfolio, PortfolioTransaction } from '../../types'
import type { PortfolioTransactionHandler } from './PortfolioTransactionHandler'

export class BuyPortfolioTransactionHandler implements PortfolioTransactionHandler {
  apply(portfolio: Portfolio, transaction: PortfolioTransaction): Portfolio {
    const cashBalance = portfolio.cashBalance - transaction.amount

    return {
      ...portfolio,
      cashBalance,
      holdings: portfolio.holdings.map((holding) => {
        if (holding.ticker !== transaction.ticker) {
          return holding
        }

        const previousQuantity = holding.quantity ?? 0
        const previousAverageCost = holding.averageCost ?? 0
        const buyQuantity = transaction.quantity ?? 0
        const buyPrice = transaction.price ?? 0
        const newQuantity = previousQuantity + buyQuantity
        const newAverageCost =
          newQuantity > 0
            ? (previousQuantity * previousAverageCost + buyQuantity * buyPrice) / newQuantity
            : previousAverageCost

        return {
          ...holding,
          quantity: newQuantity,
          marketValue: holding.marketValue + transaction.amount,
          averageCost: newAverageCost,
        }
      }),
    }
  }
}
