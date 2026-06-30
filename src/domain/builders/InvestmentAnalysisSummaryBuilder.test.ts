import { describe, expect, it } from 'vitest'
import type { InvestmentAnalysisSession, Recommendation } from '../types'
import { buildInvestmentAnalysisSummary } from './InvestmentAnalysisSummaryBuilder'

const generatedAt = new Date('2026-06-29T12:00:00.000Z')

const topRecommendation: Recommendation = {
  id: 'cash-rule-recommendation',
  ruleId: 'cash-rule',
  title: 'Deploy excess cash',
  message: 'Cash is above the policy target.',
  severity: 'warning',
  confidence: 'high',
  expectedImpact: 'Improves portfolio alignment.',
}

function createSession(): InvestmentAnalysisSession {
  return {
    id: 'session-1',
    createdAt: new Date('2026-06-29T12:01:00.000Z'),
    portfolio: {
      id: 'portfolio-1',
      holdings: [],
      watchlist: [],
      journalEntries: [],
      dividendProjection: [],
    },
    policy: {
      id: 'policy-1',
      name: 'Long-term policy',
      philosophy: {
        text: 'Own durable compounders.',
      },
      riskTolerance: 'balanced',
      allocationRules: [],
      maxHoldingWeight: 0.25,
      positionRule: {
        id: 'max-position-size',
        maxWeight: 0.25,
      },
      exposureRule: {
        id: 'max-sector-exposure',
        exposureType: 'sector',
        maxWeight: 0.4,
      },
      dividendPolicy: {
        preference: 'growth',
      },
      cashReserve: 0.1,
      rebalancingRule: {
        id: 'rebalancing-threshold',
        driftThreshold: 0.1,
      },
    },
    report: {
      generatedAt,
      snapshot: {
        totalValue: 100_000,
        cashValue: 15_000,
        cashWeight: 0.15,
      },
      allocation: {
        holdings: [],
        sectors: [],
        countries: [],
        currencies: [],
        assetClasses: [],
      },
      metrics: {
        cashWeight: 0.15,
      },
      dividendForecast: {
        totalAmount: 3_600,
        currency: 'SEK',
        months: [],
      },
      summary: {
        total: 4,
        passed: 2,
        warnings: 1,
        failed: 1,
        score: 62.5,
        criticalFailures: 0,
      },
      ruleResults: [],
      recommendations: [topRecommendation],
      insights: [
        {
          id: 'portfolio-health',
          title: 'Portfolio health',
          description: 'Rule score is above 60.',
          category: 'health',
          importance: 'medium',
        },
        {
          id: 'cash-reserve',
          title: 'Cash reserve',
          description: 'Cash reserve is within range.',
          category: 'policy',
          importance: 'low',
        },
      ],
    },
    version: '1',
  }
}

describe('buildInvestmentAnalysisSummary', () => {
  it('builds a compact UI summary from an investment analysis session report', () => {
    expect(buildInvestmentAnalysisSummary(createSession())).toEqual({
      sessionId: 'session-1',
      generatedAt,
      totalValue: 100_000,
      cash: 15_000,
      investedValue: 85_000,
      cashReserveRatio: 0.15,
      expectedAnnualDividend: 3_600,
      expectedMonthlyDividend: 300,
      dividendYield: 0.036,
      ruleScore: 62.5,
      passedRules: 2,
      failedRules: 1,
      warningRules: 1,
      recommendationCount: 1,
      topRecommendation,
      insightCount: 2,
    })
  })

  it('omits dividend values when the report has no dividend forecast', () => {
    const session = createSession()
    const { dividendForecast: _dividendForecast, ...reportWithoutForecast } = session.report

    expect(
      buildInvestmentAnalysisSummary({
        ...session,
        report: reportWithoutForecast,
      }),
    ).toMatchObject({
      expectedAnnualDividend: undefined,
      expectedMonthlyDividend: undefined,
      dividendYield: undefined,
    })
  })
})
