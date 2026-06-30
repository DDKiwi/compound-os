import type {
  InvestmentSimulationContext,
  InvestmentSimulationProjection,
  InvestmentSimulationTimeline,
  Portfolio,
} from '../types'

function getPortfolioValue(portfolio: Portfolio) {
  return portfolio.cashBalance + portfolio.holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
}

export function buildSimulationProjection(
  context: InvestmentSimulationContext,
  timeline: InvestmentSimulationTimeline,
): InvestmentSimulationProjection {
  const lastStep = timeline.steps[timeline.steps.length - 1]
  const portfolioValue = getPortfolioValue(context.portfolio)

  return {
    date: lastStep.date,
    portfolioValue,
    investedCapital: portfolioValue,
    expectedProfit: 0,
    expectedDividendIncome: 0,
  }
}
