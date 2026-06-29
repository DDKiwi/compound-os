import type { InvestmentPolicy } from './InvestmentPolicy'
import type { PortfolioMetrics } from './PortfolioMetrics'
import type { PortfolioSnapshot } from './PortfolioSnapshot'

export type InvestmentContext = {
  readonly policy: InvestmentPolicy
  readonly snapshot: PortfolioSnapshot
  readonly metrics: PortfolioMetrics
}
