import { describe, expect, it } from 'vitest'
import type { Insight, Recommendation } from '../types'
import { buildInvestmentDiagnosis } from './InvestmentDiagnosisBuilder'

function createInsight(id: string): Insight {
  return {
    id,
    title: `Insight ${id}`,
    description: `Description for ${id}`,
    category: 'health',
    importance: 'medium',
  }
}

function createRecommendation(id: string): Recommendation {
  return {
    id,
    ruleId: `${id}-rule`,
    title: `Recommendation ${id}`,
    message: `Message for ${id}`,
    severity: 'warning',
    confidence: 'high',
    expectedImpact: `Impact for ${id}`,
  }
}

describe('buildInvestmentDiagnosis', () => {
  it('builds an empty diagnosis for an empty analysis', () => {
    expect(buildInvestmentDiagnosis([], [])).toEqual({
      strengths: [],
      weaknesses: [],
      opportunities: [],
    })
  })

  it('classifies positive insights as strengths', () => {
    const strength = createInsight('portfolio-health-above-90')

    expect(buildInvestmentDiagnosis([strength], [])).toEqual({
      strengths: [strength],
      weaknesses: [],
      opportunities: [],
    })
  })

  it('classifies warning insights as weaknesses', () => {
    const weakness = createInsight('dividend-forecast-concentrated-month')

    expect(buildInvestmentDiagnosis([weakness], [])).toEqual({
      strengths: [],
      weaknesses: [weakness],
      opportunities: [],
    })
  })

  it('builds strengths, weaknesses and opportunities from existing analysis outputs', () => {
    const strength = createInsight('portfolio-no-failed-rules')
    const weakness = createInsight('dividend-forecast-no-payments')
    const opportunity = createRecommendation('cash-reserve')

    expect(buildInvestmentDiagnosis([strength, weakness], [opportunity])).toEqual({
      strengths: [strength],
      weaknesses: [weakness],
      opportunities: [opportunity],
    })
  })
})
