import type { Goal, GoalProgress, Holding } from '../types'
import { investmentGoal } from '../config/investmentRules'
import { getActiveHoldings } from './portfolioEngine'

export type DividendForecastParams = {
  startingCapital: number
  monthlyContribution: number
  expectedAnnualReturn: number
  expectedDividendYield: number
  expectedDividendGrowth: number
  years: number
  monthlyGoal?: number
}

export type DividendForecastYear = {
  year: number
  capital: number
  yearlyDividend: number
  monthlyDividend: number
  progressToGoal: number
}

function asRate(percent: number) {
  return percent / 100
}

export function getExpectedYearlyDividend(holding: Holding) {
  return holding.marketValue * asRate(holding.expectedDividendYield)
}

export function getExpectedMonthlyDividend(holding: Holding) {
  return getExpectedYearlyDividend(holding) / 12
}

export function getPortfolioExpectedYearlyDividend(holdings: Holding[]) {
  return getActiveHoldings(holdings).reduce((sum, holding) => sum + getExpectedYearlyDividend(holding), 0)
}

export function getPortfolioExpectedMonthlyDividend(holdings: Holding[]) {
  return getPortfolioExpectedYearlyDividend(holdings) / 12
}

export function getRequiredCapitalForMonthlyDividendGoal(monthlyGoal: number, dividendYield: number) {
  if (dividendYield <= 0) {
    return 0
  }

  return (monthlyGoal * 12) / asRate(dividendYield)
}

export function getProgressToMonthlyDividendGoal(holdings: Holding[], monthlyGoal: number) {
  if (monthlyGoal <= 0) {
    return 0
  }

  return getPortfolioExpectedMonthlyDividend(holdings) / monthlyGoal
}

export function createDividendForecast(params: DividendForecastParams): DividendForecastYear[] {
  const forecast: DividendForecastYear[] = []
  const yearlyContribution = params.monthlyContribution * 12
  const monthlyGoal = params.monthlyGoal ?? investmentGoal.monthlyDividendGoal
  let capital = params.startingCapital
  let dividendYield = params.expectedDividendYield

  for (let year = 1; year <= Math.max(params.years, 0); year += 1) {
    capital = capital * (1 + asRate(params.expectedAnnualReturn)) + yearlyContribution

    const yearlyDividend = capital * asRate(dividendYield)
    const monthlyDividend = yearlyDividend / 12

    forecast.push({
      year,
      capital,
      yearlyDividend,
      monthlyDividend,
      progressToGoal: monthlyGoal > 0 ? monthlyDividend / monthlyGoal : 0,
    })

    dividendYield += params.expectedDividendGrowth
  }

  return forecast
}

export function getDividendProgress(holdings: Holding[], goal: Goal = investmentGoal): GoalProgress {
  const currentAmount = getPortfolioExpectedMonthlyDividend(holdings)
  const remainingAmount = Math.max(goal.monthlyDividendGoal - currentAmount, 0)
  const progressPct =
    goal.monthlyDividendGoal > 0 ? Math.round((currentAmount / goal.monthlyDividendGoal) * 100) : 0

  return {
    label: '10 000 kr/mån i utdelningar',
    currentAmount,
    targetAmount: goal.monthlyDividendGoal,
    remainingAmount,
    progressPct,
    status: progressPct >= 75 ? 'on-track' : progressPct >= 40 ? 'at-risk' : 'behind',
  }
}

export function getDividendHoldings(holdings: Holding[]) {
  return getActiveHoldings(holdings)
    .filter((holding) => getExpectedMonthlyDividend(holding) > 0)
    .sort((a, b) => getExpectedMonthlyDividend(b) - getExpectedMonthlyDividend(a))
}
