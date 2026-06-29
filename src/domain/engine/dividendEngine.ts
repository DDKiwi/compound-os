import type { Goal, GoalProgress, Holding } from '../types'
import { investmentGoal } from '../config/investmentRules'
import { getActiveHoldings } from './portfolioEngine'

export type DividendCalendarHolding = {
  ticker: string
  name: string
  expectedDividend: number
  accountType: Holding['accountType']
  classification: Holding['classification']
}

export type DividendCalendarMonth = {
  month: number
  monthName: string
  expectedDividend: number
  holdings: DividendCalendarHolding[]
}

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

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec']

export function getExpectedYearlyDividend(holding: Holding) {
  return holding.marketValue * asRate(holding.expectedDividendYield)
}

export function getExpectedMonthlyDividend(holding: Holding) {
  return getExpectedYearlyDividend(holding) / 12
}

export function getDividendPerPayment(holding: Holding) {
  if (holding.isWatchlist || holding.dividendFrequency === 'none' || !holding.dividendMonths?.length) {
    return 0
  }

  return getExpectedYearlyDividend(holding) / holding.dividendMonths.length
}

export function getDividendCalendarForHolding(holding: Holding): DividendCalendarMonth[] {
  const calendar = createEmptyDividendCalendar()
  const dividendPerPayment = getDividendPerPayment(holding)

  if (dividendPerPayment <= 0) {
    return calendar
  }

  holding.dividendMonths
    ?.filter((month) => month >= 1 && month <= 12)
    .forEach((month) => {
      const calendarMonth = calendar[month - 1]

      calendarMonth.expectedDividend += dividendPerPayment
      calendarMonth.holdings.push({
        ticker: holding.ticker,
        name: holding.name,
        expectedDividend: dividendPerPayment,
        accountType: holding.accountType,
        classification: holding.classification,
      })
    })

  return calendar
}

export function getPortfolioDividendCalendar(holdings: Holding[]): DividendCalendarMonth[] {
  const calendar = createEmptyDividendCalendar()

  getActiveHoldings(holdings).forEach((holding) => {
    const dividendPerPayment = getDividendPerPayment(holding)

    if (dividendPerPayment <= 0) {
      return
    }

    holding.dividendMonths
      ?.filter((month) => month >= 1 && month <= 12)
      .forEach((month) => {
        const calendarMonth = calendar[month - 1]

        calendarMonth.expectedDividend += dividendPerPayment
        calendarMonth.holdings.push({
          ticker: holding.ticker,
          name: holding.name,
          expectedDividend: dividendPerPayment,
          accountType: holding.accountType,
          classification: holding.classification,
        })
      })
  })

  return calendar
}

function createEmptyDividendCalendar(): DividendCalendarMonth[] {
  return monthNames.map((monthName, index) => ({
    month: index + 1,
    monthName,
    expectedDividend: 0,
    holdings: [],
  }))
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
