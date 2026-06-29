import type { PortfolioMetrics, PortfolioSnapshot } from '../types'

export function buildPortfolioMetrics(snapshot: PortfolioSnapshot): PortfolioMetrics {
  return {
    cashWeight: snapshot.cashWeight,
  }
}
