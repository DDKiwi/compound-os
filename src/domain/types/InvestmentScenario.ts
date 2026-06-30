import type { InvestmentSimulationAction } from './InvestmentSimulationInput'

export type InvestmentScenario = {
  readonly id: string
  readonly name: string
  readonly description?: string
  readonly startDate: Date
  readonly endDate?: Date
  readonly actions: readonly InvestmentSimulationAction[]
  readonly assumptions?: InvestmentScenarioAssumptions
}

export type InvestmentScenarioAssumptions = {
  readonly expectedAnnualReturn?: number
  readonly inflationRate?: number
  readonly dividendGrowthRate?: number
  readonly reinvestDividends?: boolean
}
