import type { InvestmentAnalysisSummary, InvestmentHealth } from '../types'

export function buildInvestmentHealth(
  summary: Pick<InvestmentAnalysisSummary, 'ruleScore'>,
): InvestmentHealth {
  const score = summary.ruleScore

  if (score >= 90) {
    return {
      score,
      label: 'Excellent',
      status: 'excellent',
    }
  }

  if (score >= 75) {
    return {
      score,
      label: 'Good',
      status: 'good',
    }
  }

  if (score >= 60) {
    return {
      score,
      label: 'Fair',
      status: 'fair',
    }
  }

  return {
    score,
    label: 'Poor',
    status: 'poor',
  }
}
