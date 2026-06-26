import { getAllocation, getHighRiskExposure, getPortfolioStats as getDomainPortfolioStats } from '../domain'
import type { Holding } from '../types/investment'
import { formatPercent } from './helpers'

export function calculatePortfolioStats(portfolio: Holding[]) {
  const stats = getDomainPortfolioStats(portfolio)
  const highRiskExposure = getHighRiskExposure(portfolio)

  return {
    total: stats.totalValue,
    monthlyDividend: stats.monthlyDividend,
    dividendProgress: stats.dividendProgressPct,
    highRiskWeight: formatPercent(highRiskExposure.weightPct),
    highRiskOk: highRiskExposure.count <= 1 && (highRiskExposure.value <= 75000 || highRiskExposure.weightPct <= 2),
    indexWeight: stats.globalIndexWeightPct,
    kfWeight: stats.kfWeightPct,
    averageReturn: formatPercent(stats.averageDividendGrowthPct),
  }
}

export function calculateAllocation(portfolio: Holding[], key: 'classification' | 'countryExposure') {
  return getAllocation(portfolio, key)
}
