import { describe, expect, it } from 'vitest'
import type { Holding } from '../types'
import {
  getExpectedMonthlyDividend,
  getExpectedYearlyDividend,
  getPortfolioExpectedMonthlyDividend,
  getProgressToMonthlyDividendGoal,
  getRequiredCapitalForMonthlyDividendGoal,
} from './dividendEngine'

const holding: Holding = {
  id: 'income',
  name: 'Realty Income',
  ticker: 'O',
  accountType: 'KF',
  marketValue: 120_000,
  monthlyContribution: 1_000,
  assetType: 'REIT',
  classification: 'IncomeCompounder',
  portfolioRole: 'Income',
  moatScore: 3,
  countryExposure: 'USA',
  currency: 'USD',
  expectedDividendYield: 6,
  expectedDividendGrowth: 3,
  isWatchlist: false,
  isSpeculative: false,
  notes: '',
}

describe('dividendEngine', () => {
  it('calculates expected yearly and monthly dividend for a holding', () => {
    expect(getExpectedYearlyDividend(holding)).toBe(7_200)
    expect(getExpectedMonthlyDividend(holding)).toBe(600)
  })

  it('calculates portfolio expected monthly dividend', () => {
    expect(getPortfolioExpectedMonthlyDividend([holding, { ...holding, id: 'income-2' }])).toBe(1_200)
  })

  it('calculates required capital for a monthly dividend goal', () => {
    expect(getRequiredCapitalForMonthlyDividendGoal(10_000, 4)).toBe(3_000_000)
  })

  it('calculates progress to dividend goal as a decimal', () => {
    expect(getProgressToMonthlyDividendGoal([holding], 10_000)).toBe(0.06)
  })
})
