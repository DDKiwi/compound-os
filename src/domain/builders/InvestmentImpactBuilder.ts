import type { InvestmentAnalysisSummary, InvestmentImpact, Recommendation } from '../types'

export function buildInvestmentImpact(
  summary: InvestmentAnalysisSummary,
  recommendation: Recommendation,
): InvestmentImpact {
  // TODO: Simulate dividend, cash and health changes from the recommendation and current summary.
  // TODO: Estimate risk impact when the domain exposes comparable risk metrics.
  void summary
  void recommendation

  return {}
}
