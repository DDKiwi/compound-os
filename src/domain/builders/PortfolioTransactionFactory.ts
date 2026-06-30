import type { InvestmentSimulationStep, PortfolioTransaction } from '../types'

export function createPortfolioTransactionFromSimulationStep(
  step: InvestmentSimulationStep,
): PortfolioTransaction {
  return {
    id: `${step.action.type}-${step.date.toISOString()}`,
    type: step.action.type,
    date: step.date,
    amount: step.action.amount ?? 0,
    origin: 'simulation',
    ...(step.action.quantity !== undefined ? { quantity: step.action.quantity } : {}),
    ...(step.action.ticker !== undefined ? { ticker: step.action.ticker } : {}),
    ...(step.action.price !== undefined ? { price: step.action.price } : {}),
    ...(step.action.currency !== undefined ? { currency: step.action.currency } : {}),
  }
}
