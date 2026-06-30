import type { InvestmentSimulationInput, InvestmentSimulationResult } from '../types'
import { buildInvestmentSimulationTimeline } from '../builders/InvestmentSimulationTimelineBuilder'
import { processInvestmentSimulationStep } from './InvestmentSimulationStepProcessor'

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

  return {
    portfolio: context.portfolio,
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
