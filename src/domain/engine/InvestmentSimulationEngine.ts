import type { InvestmentSimulationInput, InvestmentSimulationResult } from '../types'

export function simulateInvestment(
  input: InvestmentSimulationInput,
): InvestmentSimulationResult {
  return {
    portfolio: input.portfolio,
    summary: {
      expectedValue: 0,
      investedCapital: 0,
      expectedProfit: 0,
    },
  }
}

export const InvestmentSimulationEngine = {
  simulate(input: InvestmentSimulationInput): InvestmentSimulationResult {
    return simulateInvestment(input)
  },
} as const
