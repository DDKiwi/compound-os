import type { Goal, Holding, InvestmentRule, RuleResult } from '../types'
import {
  getAllocationByAccountType,
  getAllocationByClassification,
  getAllocationByCountryExposure,
  getCashValue,
  getLargestHoldings,
  getMonthlyContributionTotal,
  getTotalInvestedCapital,
  getTotalMarketValue,
  getWatchlistHoldings,
} from './portfolioEngine'
import {
  getPortfolioExpectedMonthlyDividend,
  getPortfolioExpectedYearlyDividend,
  getProgressToMonthlyDividendGoal,
  getRequiredCapitalForMonthlyDividendGoal,
} from './dividendEngine'
import {
  evaluateInvestmentRules,
  getCashBufferProgress,
  getSpeculativeExposurePercent,
} from './riskEngine'

export type DashboardSummary = {
  totalMarketValue: number
  totalInvestedCapital: number
  cashValue: number
  monthlyContributionTotal: number
  expectedYearlyDividend: number
  expectedMonthlyDividend: number
  dividendGoalProgress: number
  requiredCapitalAt3Percent: number
  requiredCapitalAt35Percent: number
  requiredCapitalAt4Percent: number
  allocationByAccountType: ReturnType<typeof getAllocationByAccountType>
  allocationByClassification: ReturnType<typeof getAllocationByClassification>
  allocationByCountryExposure: ReturnType<typeof getAllocationByCountryExposure>
  largestHoldings: Holding[]
  watchlistHoldings: Holding[]
  speculativeExposurePercent: number
  cashBufferProgress: number
  ruleResults: RuleResult[]
}

export function createDashboardSummary(
  holdings: Holding[],
  goals: Goal,
  rules: InvestmentRule[],
): DashboardSummary {
  return {
    totalMarketValue: getTotalMarketValue(holdings),
    totalInvestedCapital: getTotalInvestedCapital(holdings),
    cashValue: getCashValue(holdings),
    monthlyContributionTotal: getMonthlyContributionTotal(holdings),
    expectedYearlyDividend: getPortfolioExpectedYearlyDividend(holdings),
    expectedMonthlyDividend: getPortfolioExpectedMonthlyDividend(holdings),
    dividendGoalProgress: getProgressToMonthlyDividendGoal(holdings, goals.monthlyDividendGoal),
    requiredCapitalAt3Percent: getRequiredCapitalForMonthlyDividendGoal(goals.monthlyDividendGoal, 3),
    requiredCapitalAt35Percent: getRequiredCapitalForMonthlyDividendGoal(goals.monthlyDividendGoal, 3.5),
    requiredCapitalAt4Percent: getRequiredCapitalForMonthlyDividendGoal(goals.monthlyDividendGoal, 4),
    allocationByAccountType: getAllocationByAccountType(holdings),
    allocationByClassification: getAllocationByClassification(holdings),
    allocationByCountryExposure: getAllocationByCountryExposure(holdings),
    largestHoldings: getLargestHoldings(holdings, 5),
    watchlistHoldings: getWatchlistHoldings(holdings),
    speculativeExposurePercent: getSpeculativeExposurePercent(holdings),
    cashBufferProgress: getCashBufferProgress(holdings, goals.targetBuffer),
    ruleResults: evaluateInvestmentRules(holdings, goals, rules),
  }
}
