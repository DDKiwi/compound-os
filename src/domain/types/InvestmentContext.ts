import type { InvestmentPolicy } from './InvestmentPolicy'
import type { PortfolioSnapshot } from './PortfolioSnapshot'

export type InvestmentContext = {
  readonly policy: InvestmentPolicy
  readonly snapshot: PortfolioSnapshot
}
