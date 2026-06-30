import { describe, expect, it } from 'vitest'
import type { Insight, InvestmentAnalysisSummary, Recommendation } from '../types'
import { buildInvestmentDecision } from './InvestmentDecisionBuilder'

const recommendation: Recommendation = {
  id: 'cash-rule-recommendation',
  ruleId: 'cash-rule',
  title: 'Deploy excess cash',
  message: 'Cash is above the policy target.',
  severity: 'warning',
  confidence: 'high',
  expectedImpact: 'Improves portfolio alignment.',
}

const strength: Insight = {
  id: 'portfolio-no-failed-rules',
  title: 'Portfolio has no failed rules',
  description: 'All evaluated rules are currently free from failures.',
  category: 'policy',
  importance: 'medium',
}

function createSummary(topRecommendation?: Recommendation): InvestmentAnalysisSummary {
  return {
    sessionId: 'session-1',
    generatedAt: new Date('2026-06-30T12:00:00.000Z'),
    totalValue: 100_000,
    cash: 10_000,
    investedValue: 90_000,
    cashReserveRatio: 0.1,
    ruleScore: 90,
    health: {
      score: 90,
      label: 'Excellent',
      status: 'excellent',
    },
    passedRules: 4,
    failedRules: 0,
    warningRules: 0,
    recommendationCount: topRecommendation === undefined ? 0 : 1,
    topRecommendation,
    insightCount: 1,
  }
}

describe('buildInvestmentDecision', () => {
  it('builds a decision with recommendation and impact', () => {
    expect(buildInvestmentDecision(createSummary(recommendation), { insights: [strength] })).toEqual({
      health: {
        score: 90,
        label: 'Excellent',
        status: 'excellent',
      },
      recommendation,
      diagnosis: {
        strengths: [strength],
        weaknesses: [],
        opportunities: [recommendation],
      },
      impact: {},
    })
  })

  it('builds a decision without recommendation', () => {
    expect(buildInvestmentDecision(createSummary())).toEqual({
      health: {
        score: 90,
        label: 'Excellent',
        status: 'excellent',
      },
      recommendation: undefined,
      diagnosis: {
        strengths: [],
        weaknesses: [],
        opportunities: [],
      },
      impact: undefined,
    })
  })

  it('always includes health', () => {
    expect(buildInvestmentDecision(createSummary()).health).toEqual({
      score: 90,
      label: 'Excellent',
      status: 'excellent',
    })
  })

  it('only includes impact when a recommendation exists', () => {
    expect(buildInvestmentDecision(createSummary(recommendation)).impact).toEqual({})
    expect(buildInvestmentDecision(createSummary()).impact).toBeUndefined()
  })
})
