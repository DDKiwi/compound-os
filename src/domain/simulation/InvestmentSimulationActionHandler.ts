import type {
  InvestmentSimulationAction,
  InvestmentSimulationContext,
  InvestmentSimulationStep,
} from '../types'

export interface InvestmentSimulationActionHandler {
  handle(
    context: InvestmentSimulationContext,
    step: InvestmentSimulationStep,
  ): InvestmentSimulationContext
}

export class BuySimulationActionHandler implements InvestmentSimulationActionHandler {
  handle(
    context: InvestmentSimulationContext,
    step: InvestmentSimulationStep,
  ): InvestmentSimulationContext {
    void step

    return context
  }
}

export class SellSimulationActionHandler implements InvestmentSimulationActionHandler {
  handle(
    context: InvestmentSimulationContext,
    step: InvestmentSimulationStep,
  ): InvestmentSimulationContext {
    void step

    return context
  }
}

export class DepositSimulationActionHandler implements InvestmentSimulationActionHandler {
  handle(
    context: InvestmentSimulationContext,
    step: InvestmentSimulationStep,
  ): InvestmentSimulationContext {
    void step

    return context
  }
}

export class WithdrawSimulationActionHandler implements InvestmentSimulationActionHandler {
  handle(
    context: InvestmentSimulationContext,
    step: InvestmentSimulationStep,
  ): InvestmentSimulationContext {
    void step

    return context
  }
}

const actionHandlers: Record<InvestmentSimulationAction['type'], InvestmentSimulationActionHandler> = {
  buy: new BuySimulationActionHandler(),
  sell: new SellSimulationActionHandler(),
  deposit: new DepositSimulationActionHandler(),
  withdraw: new WithdrawSimulationActionHandler(),
}

export function getInvestmentSimulationActionHandler(
  actionType: InvestmentSimulationAction['type'],
): InvestmentSimulationActionHandler {
  return actionHandlers[actionType]
}
