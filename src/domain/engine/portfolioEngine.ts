import type {
  AccountType,
  CountryExposure,
  Holding,
  HoldingClassification,
  Portfolio,
  PortfolioStats,
  PortfolioTransaction,
  PortfolioTransactionType,
} from '../types'
import { investmentGoal } from '../config/investmentRules'
import {
  BuyPortfolioTransactionHandler,
  DepositPortfolioTransactionHandler,
  NoopPortfolioTransactionHandler,
  SellPortfolioTransactionHandler,
  type PortfolioTransactionHandler,
  WithdrawPortfolioTransactionHandler,
} from './portfolio-transactions'

type AllocationItem<TName extends string> = {
  name: TName
  value: number
  weight: number
}

function sumMarketValue(holdings: Holding[]) {
  return holdings.reduce((sum, holding) => sum + holding.marketValue, 0)
}

function isCashHolding(holding: Holding) {
  return holding.accountType === 'Cash' || holding.assetType === 'Cash' || holding.portfolioRole === 'CashReserve'
}

function getInvestedHoldings(holdings: Holding[]) {
  return getActiveHoldings(holdings).filter((holding) => !isCashHolding(holding))
}

function groupHoldingsBy<TKey extends string>(
  holdings: Holding[],
  getKey: (holding: Holding) => TKey,
) {
  return holdings.reduce<Record<TKey, Holding[]>>(
    (groups, holding) => {
      const key = getKey(holding)
      groups[key] = [...(groups[key] ?? []), holding]
      return groups
    },
    {} as Record<TKey, Holding[]>,
  )
}

function getAllocationFromGroups<TKey extends string>(
  groups: Record<TKey, Holding[]>,
  holdings: Holding[],
): Array<AllocationItem<TKey>> {
  const totalMarketValue = getTotalMarketValue(holdings)

  return Object.entries(groups)
    .map(([name, groupHoldings]) => {
      const value = sumMarketValue(groupHoldings as Holding[])

      return {
        name: name as TKey,
        value,
        weight: totalMarketValue > 0 ? value / totalMarketValue : 0,
      }
    })
    .sort((a, b) => b.value - a.value)
}

export function getTotalMarketValue(holdings: Holding[]) {
  return sumMarketValue(getActiveHoldings(holdings))
}

export function getTotalInvestedCapital(holdings: Holding[]) {
  return sumMarketValue(getInvestedHoldings(holdings))
}

export function getCashValue(holdings: Holding[]) {
  return getActiveHoldings(holdings).filter(isCashHolding).reduce((sum, holding) => sum + holding.marketValue, 0)
}

export function getMonthlyContributionTotal(holdings: Holding[]) {
  return getActiveHoldings(holdings).reduce((sum, holding) => sum + holding.monthlyContribution, 0)
}

export function getHoldingsByAccountType(holdings: Holding[]) {
  return groupHoldingsBy(getActiveHoldings(holdings), (holding) => holding.accountType)
}

export function getHoldingsByClassification(holdings: Holding[]) {
  return groupHoldingsBy(getActiveHoldings(holdings), (holding) => holding.classification)
}

export function getHoldingsByCountryExposure(holdings: Holding[]) {
  return groupHoldingsBy(getActiveHoldings(holdings), (holding) => holding.countryExposure)
}

export function getAllocationByAccountType(holdings: Holding[]) {
  return getAllocationFromGroups(getHoldingsByAccountType(holdings), holdings)
}

export function getAllocationByClassification(holdings: Holding[]) {
  return getAllocationFromGroups(getHoldingsByClassification(holdings), holdings)
}

export function getAllocationByCountryExposure(holdings: Holding[]) {
  return getAllocationFromGroups(getHoldingsByCountryExposure(holdings), holdings)
}

export function getPortfolioWeight(holding: Holding, holdings: Holding[]) {
  if (holding.isWatchlist) {
    return 0
  }

  const totalMarketValue = getTotalMarketValue(holdings)
  return totalMarketValue > 0 ? holding.marketValue / totalMarketValue : 0
}

export function getLargestHoldings(holdings: Holding[], limit: number) {
  return [...getInvestedHoldings(holdings)].sort((a, b) => b.marketValue - a.marketValue).slice(0, Math.max(limit, 0))
}

export function getWatchlistHoldings(holdings: Holding[]) {
  return holdings.filter((holding) => holding.isWatchlist)
}

export function getActiveHoldings(holdings: Holding[]) {
  return holdings.filter((holding) => !holding.isWatchlist)
}

export function getPortfolioValue(holdings: Holding[]) {
  return getTotalMarketValue(holdings)
}

const noopPortfolioTransactionHandler = new NoopPortfolioTransactionHandler()

const portfolioTransactionHandlers: Record<PortfolioTransactionType, PortfolioTransactionHandler> = {
  deposit: new DepositPortfolioTransactionHandler(),
  withdraw: new WithdrawPortfolioTransactionHandler(),
  buy: new BuyPortfolioTransactionHandler(),
  sell: new SellPortfolioTransactionHandler(),
  dividend: noopPortfolioTransactionHandler,
  fee: noopPortfolioTransactionHandler,
  tax: noopPortfolioTransactionHandler,
}

export function applyPortfolioTransaction(
  portfolio: Portfolio,
  transaction: PortfolioTransaction,
): Portfolio {
  return portfolioTransactionHandlers[transaction.type].apply(portfolio, transaction)
}

export function getExpectedAnnualDividend(holding: Holding) {
  return holding.marketValue * (holding.expectedDividendYield / 100)
}

export function getExpectedMonthlyDividend(holding: Holding) {
  return getExpectedAnnualDividend(holding) / 12
}

export function getMonthlyDividend(holdings: Holding[]) {
  return getActiveHoldings(holdings).reduce((sum, holding) => sum + getExpectedMonthlyDividend(holding), 0)
}

export function getAnnualDividend(holdings: Holding[]) {
  return getActiveHoldings(holdings).reduce((sum, holding) => sum + getExpectedAnnualDividend(holding), 0)
}

export function getWeightedValueByClassification(
  holdings: Holding[],
  classification: HoldingClassification,
) {
  return getHoldingsByClassification(holdings)[classification]?.reduce(
    (sum, holding) => sum + holding.marketValue,
    0,
  ) ?? 0
}

export function getWeightedValueByAccount(holdings: Holding[], accountType: AccountType) {
  return getHoldingsByAccountType(holdings)[accountType]?.reduce(
    (sum, holding) => sum + holding.marketValue,
    0,
  ) ?? 0
}

export function getWeightedValueByCountryExposure(
  holdings: Holding[],
  countryExposure: CountryExposure,
) {
  return getHoldingsByCountryExposure(holdings)[countryExposure]?.reduce(
    (sum, holding) => sum + holding.marketValue,
    0,
  ) ?? 0
}

export function getAverageMoatScore(holdings: Holding[]) {
  const investedHoldings = getInvestedHoldings(holdings)

  if (investedHoldings.length === 0) {
    return 0
  }

  return investedHoldings.reduce((sum, holding) => sum + holding.moatScore, 0) / investedHoldings.length
}

export function getAverageDividendGrowthPct(holdings: Holding[]) {
  const investedHoldings = getInvestedHoldings(holdings)

  if (investedHoldings.length === 0) {
    return 0
  }

  return investedHoldings.reduce((sum, holding) => sum + holding.expectedDividendGrowth, 0) / investedHoldings.length
}

export function getPortfolioStats(holdings: Holding[]): PortfolioStats {
  const totalValue = getTotalMarketValue(holdings)
  const monthlyDividend = getMonthlyDividend(holdings)
  const globalIndexValue = getWeightedValueByClassification(holdings, 'GlobalIndex')
  const kfValue = getWeightedValueByAccount(holdings, 'KF')

  return {
    totalValue,
    monthlyDividend,
    annualDividend: monthlyDividend * 12,
    dividendProgressPct:
      investmentGoal.monthlyDividendGoal > 0
        ? Math.round((monthlyDividend / investmentGoal.monthlyDividendGoal) * 100)
        : 0,
    globalIndexWeightPct: totalValue > 0 ? Math.round((globalIndexValue / totalValue) * 100) : 0,
    kfWeightPct: totalValue > 0 ? Math.round((kfValue / totalValue) * 100) : 0,
    averageMoatScore: getAverageMoatScore(holdings),
    averageDividendGrowthPct: getAverageDividendGrowthPct(holdings),
  }
}
