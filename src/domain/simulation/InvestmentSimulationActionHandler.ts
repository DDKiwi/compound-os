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
    if (step.action.type !== 'deposit') {
      return context
    }

    return {
      ...context,
      portfolio: {
        ...context.portfolio,
        cashBalance: context.portfolio.cashBalance + (step.action.amount ?? 0),
      },
    }
  }
}

export class WithdrawSimulationActionHandler implements InvestmentSimulationActionHandler {
  handle(
    context: InvestmentSimulationContext,
    step: InvestmentSimulationStep,
  ): InvestmentSimulationContext {
    if (step.action.type !== 'withdraw') {
      return context
    }

    return {
      ...context,
      portfolio: {
        ...context.portfolio,
        cashBalance: context.portfolio.cashBalance - (step.action.amount ?? 0),
      },
    }
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
