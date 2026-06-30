import { describe, expect, it } from 'vitest'
import type { InvestmentAnalysisSummary, Recommendation } from '../types'
import { buildInvestmentImpact } from './InvestmentImpactBuilder'

const summary: InvestmentAnalysisSummary = {
  sessionId: 'session-1',
  generatedAt: new Date('2026-06-30T12:00:00.000Z'),
  totalValue: 100_000,
  cash: 10_000,
  investedValue: 90_000,
  cashReserveRatio: 0.1,
  expectedAnnualDividend: 3_600,
  expectedMonthlyDividend: 300,
  dividendYield: 0.036,
  ruleScore: 75,
  health: {
    score: 75,
    label: 'Good',
    status: 'good',
  },
  passedRules: 3,
  failedRules: 0,
  warningRules: 1,
  recommendationCount: 1,
  insightCount: 0,
}

const recommendation: Recommendation = {
  id: 'cash-rule-recommendation',
  ruleId: 'cash-rule',
  title: 'Deploy excess cash',
  message: 'Cash is above the policy target.',
  severity: 'warning',
  confidence: 'high',
  expectedImpact: 'Improves portfolio alignment.',
}

describe('buildInvestmentImpact', () => {
  it('always returns an impact object', () => {
    expect(buildInvestmentImpact(summary, recommendation)).toEqual({})
  })

  it('does not set values without simulation support', () => {
    expect(buildInvestmentImpact(summary, recommendation)).toEqual({
      annualDividendChange: undefined,
      monthlyDividendChange: undefined,
      dividendYieldChange: undefined,
      cashChange: undefined,
      healthScoreChange: undefined,
      riskChange: undefined,
    })
  })

  it('is deterministic', () => {
    expect(buildInvestmentImpact(summary, recommendation)).toEqual(
      buildInvestmentImpact(summary, recommendation),
    )
  })
})
