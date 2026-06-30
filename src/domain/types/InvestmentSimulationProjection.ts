export type InvestmentSimulationProjection = {
  readonly date: Date
  readonly portfolioValue: number
  readonly investedCapital: number
  readonly expectedProfit: number
  readonly expectedDividendIncome?: number
}
