import type { InvestmentAnalysisReport } from './InvestmentAnalysisReport'
import type { InvestmentPolicy } from './InvestmentPolicy'
import type { Portfolio } from './Portfolio'

export type InvestmentAnalysisSession = {
  readonly id: string
  readonly createdAt: Date
  readonly portfolio: Portfolio
  readonly policy: InvestmentPolicy
  readonly report: InvestmentAnalysisReport
  readonly version: string
}
