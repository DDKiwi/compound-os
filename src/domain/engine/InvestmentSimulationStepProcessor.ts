import type { InvestmentSimulationContext, InvestmentSimulationStep } from '../types'

export function processInvestmentSimulationStep(
  context: InvestmentSimulationContext,
  step: InvestmentSimulationStep,
): InvestmentSimulationContext {
  void step

  return context
}
