import type {
  InvestmentSimulationInput,
  InvestmentSimulationProjection,
  InvestmentSimulationResult,
  Portfolio,
} from '../types'
import { buildInvestmentSimulationTimeline } from '../builders/InvestmentSimulationTimelineBuilder'
import { processInvestmentSimulationStep } from './InvestmentSimulationStepProcessor'

function getPortfolioValue(portfolio: Portfolio) {
  return portfolio.cashBalance + portfolio.holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
}

function createInvestmentSimulationProjection(
  portfolio: Portfolio,
  date: Date,
): InvestmentSimulationProjection {
  const portfolioValue = getPortfolioValue(portfolio)

  return {
    date,
    portfolioValue,
    investedCapital: portfolioValue,
    expectedProfit: 0,
    expectedDividendIncome: 0,
  }
}

export function simulateInvestment(
  input: InvestmentSimulationInput,
): InvestmentSimulationResult {
  let context = {
    input,
    portfolio: input.portfolio,
  }
  const timeline = buildInvestmentSimulationTimeline(context)

  for (const step of timeline.steps) {
    context = processInvestmentSimulationStep(context, step)
  }

  const lastStep = timeline.steps[timeline.steps.length - 1]
  const projections = lastStep
    ? [createInvestmentSimulationProjection(context.portfolio, lastStep.date)]
    : []

  return {
    portfolio: context.portfolio,
    summary: {
      expectedValue: 0,
      investedCapital: 0,
      expectedProfit: 0,
    },
    projections,
  }
}

export const InvestmentSimulationEngine = {
  simulate(input: InvestmentSimulationInput): InvestmentSimulationResult {
    return simulateInvestment(input)
  },
} as const
