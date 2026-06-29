import type { Goal, Holding, InvestmentRule, RuleResult } from '../types'
import type { InvestmentPhilosophy, PhilosophyRule, RuleEvaluation } from '../philosophy'
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
  getPortfolioDividendCalendar,
  getPortfolioExpectedMonthlyDividend,
  getPortfolioExpectedYearlyDividend,
  getProgressToMonthlyDividendGoal,
  getRequiredCapitalForMonthlyDividendGoal,
} from './dividendEngine'
import {
  evaluateInvestmentRules,
  evaluateInvestmentPhilosophy,
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
  dividendCalendar: ReturnType<typeof getPortfolioDividendCalendar>
  bestDividendMonth: ReturnType<typeof getPortfolioDividendCalendar>[number]
  weakestDividendMonth: ReturnType<typeof getPortfolioDividendCalendar>[number]
  allocationByAccountType: ReturnType<typeof getAllocationByAccountType>
  allocationByClassification: ReturnType<typeof getAllocationByClassification>
  allocationByCountryExposure: ReturnType<typeof getAllocationByCountryExposure>
  largestHoldings: Holding[]
  watchlistHoldings: Holding[]
  speculativeExposurePercent: number
  cashBufferProgress: number
  ruleResults: RuleResult[]
  philosophyScore: number
  philosophyRuleEvaluations: RuleEvaluation[]
  topPhilosophyWarnings: RuleEvaluation[]
  topPhilosophyPassedRules: PhilosophyRule[]
}

export function createDashboardSummary(
  holdings: Holding[],
  goals: Goal,
  rules: InvestmentRule[],
  philosophy?: InvestmentPhilosophy,
): DashboardSummary {
  const philosophyEvaluation = philosophy ? evaluateInvestmentPhilosophy(philosophy, holdings, goals) : undefined
  const philosophyRuleEvaluations = philosophyEvaluation?.evaluations ?? []
  const dividendCalendar = getPortfolioDividendCalendar(holdings)
  const bestDividendMonth = [...dividendCalendar].sort((a, b) => b.expectedDividend - a.expectedDividend)[0]
  const weakestDividendMonth = [...dividendCalendar].sort((a, b) => a.expectedDividend - b.expectedDividend)[0]

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
    dividendCalendar,
    bestDividendMonth,
    weakestDividendMonth,
    allocationByAccountType: getAllocationByAccountType(holdings),
    allocationByClassification: getAllocationByClassification(holdings),
    allocationByCountryExposure: getAllocationByCountryExposure(holdings),
    largestHoldings: getLargestHoldings(holdings, 5),
    watchlistHoldings: getWatchlistHoldings(holdings),
    speculativeExposurePercent: getSpeculativeExposurePercent(holdings),
    cashBufferProgress: getCashBufferProgress(holdings, goals.targetBuffer),
    ruleResults: evaluateInvestmentRules(holdings, goals, rules),
    philosophyScore: philosophyEvaluation?.score ?? 100,
    philosophyRuleEvaluations,
    topPhilosophyWarnings: philosophyRuleEvaluations
      .filter((evaluation) => evaluation.status === 'warning' || evaluation.status === 'fail')
      .slice(0, 3),
    topPhilosophyPassedRules: philosophyEvaluation?.passedRules.slice(0, 3) ?? [],
  }
}
