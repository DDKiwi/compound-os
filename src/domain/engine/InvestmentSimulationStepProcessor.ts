import type { InvestmentSimulationContext, InvestmentSimulationStep } from '../types'
import { getInvestmentSimulationActionHandler } from '../simulation'

export function processInvestmentSimulationStep(
  context: InvestmentSimulationContext,
  step: InvestmentSimulationStep,
): InvestmentSimulationContext {
  return getInvestmentSimulationActionHandler(step.action.type).handle(context, step)
}
