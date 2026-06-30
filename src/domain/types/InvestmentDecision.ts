import type { InvestmentDiagnosis } from './InvestmentDiagnosis'
import type { InvestmentHealth } from './InvestmentHealth'
import type { InvestmentImpact } from './InvestmentImpact'
import type { Recommendation } from './Recommendation'

export type InvestmentDecision = {
  readonly health: InvestmentHealth
  readonly recommendation?: Recommendation
  readonly diagnosis: InvestmentDiagnosis
  readonly impact?: InvestmentImpact
}
