import type { InvestmentScenarioResult } from '../../domain/types'
import { formatCurrency, formatNumber } from '../formatters'

export type InvestmentScenarioCardViewModel = {
  readonly title: string
  readonly expectedValue: string
  readonly investedCapital: string
  readonly expectedProfit: string
  readonly expectedDividendIncome: string
  readonly simulationCount: string
  readonly topRecommendation?: string
}

export function buildInvestmentScenarioCardViewModel(
  scenarioResult: InvestmentScenarioResult,
  topRecommendation?: string,
): InvestmentScenarioCardViewModel {
  const { summary } = scenarioResult

  return {
    title: scenarioResult.scenario.name,
    expectedValue: formatCurrency(summary.expectedValue),
    investedCapital: formatCurrency(summary.investedCapital),
    expectedProfit: formatCurrency(summary.expectedProfit),
    expectedDividendIncome: formatCurrency(summary.expectedDividendIncome),
    simulationCount: formatNumber(scenarioResult.simulations.length),
    ...(topRecommendation === undefined ? {} : { topRecommendation }),
  }
}
