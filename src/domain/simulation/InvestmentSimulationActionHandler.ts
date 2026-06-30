import type {
  InvestmentSimulationAction,
  InvestmentSimulationContext,
  InvestmentSimulationStep,
  PortfolioTransaction,
} from '../types'
import * as portfolioEngine from '../engine/portfolioEngine'

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

    const transaction: PortfolioTransaction = {
      id: `${step.action.type}-${step.date.toISOString()}`,
      type: 'deposit',
      date: step.date,
      amount: step.action.amount ?? 0,
    }

    return {
      ...context,
      portfolio: portfolioEngine.applyPortfolioTransaction(context.portfolio, transaction),
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

    const transaction: PortfolioTransaction = {
      id: `${step.action.type}-${step.date.toISOString()}`,
      type: 'withdraw',
      date: step.date,
      amount: step.action.amount ?? 0,
    }

    return {
      ...context,
      portfolio: portfolioEngine.applyPortfolioTransaction(context.portfolio, transaction),
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
