import type { InvestmentSimulationInput, InvestmentSimulationResult } from '../types'
import { buildInvestmentSimulationTimeline } from '../builders/InvestmentSimulationTimelineBuilder'

export function simulateInvestment(
  input: InvestmentSimulationInput,
): InvestmentSimulationResult {
  const timeline = buildInvestmentSimulationTimeline({
    input,
    portfolio: input.portfolio,
  })

  void timeline

  return {
    portfolio: input.portfolio,
    summary: {
      expectedValue: 0,
      investedCapital: 0,
      expectedProfit: 0,
    },
    projections: [],
  }
}

export const InvestmentSimulationEngine = {
  simulate(input: InvestmentSimulationInput): InvestmentSimulationResult {
    return simulateInvestment(input)
  },
} as const
