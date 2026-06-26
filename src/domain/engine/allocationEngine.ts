import type { AllocationItem, AllocationKey, Holding } from '../types'
import { getActiveHoldings, getPortfolioValue } from './portfolioEngine'

export function getAllocation(holdings: Holding[], key: AllocationKey): AllocationItem[] {
  const activeHoldings = getActiveHoldings(holdings)
  const totalValue = getPortfolioValue(activeHoldings)
  const allocation = activeHoldings.reduce<Record<string, number>>((acc, holding) => {
    acc[String(holding[key])] = (acc[String(holding[key])] ?? 0) + holding.marketValue
    return acc
  }, {})

  return Object.entries(allocation)
    .map(([name, value]) => ({
      name,
      value,
      weight: totalValue > 0 ? value / totalValue : 0,
    }))
    .sort((a, b) => b.value - a.value)
}

export function getGlobalIndexWeightPct(holdings: Holding[]) {
  const globalIndexWeight = getAllocation(holdings, 'classification').find((item) => item.name === 'GlobalIndex')?.weight ?? 0

  return globalIndexWeight * 100
}
