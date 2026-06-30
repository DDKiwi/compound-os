import type { InvestmentSimulationContext, InvestmentSimulationTimeline } from '../types'

export function buildInvestmentSimulationTimeline(
  context: InvestmentSimulationContext,
): InvestmentSimulationTimeline {
  return {
    steps: [
      {
        date: new Date(),
        action: context.input.action,
        portfolio: context.portfolio,
      },
    ],
  }
}
