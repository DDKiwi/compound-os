import { describe, expect, it } from 'vitest'
import type { Recommendation } from '../types'
import { buildTopRecommendation } from './TopRecommendationBuilder'

function createRecommendation(
  id: string,
  overrides: Partial<Pick<Recommendation, 'confidence' | 'severity'>> = {},
): Recommendation {
  return {
    id,
    ruleId: `${id}-rule`,
    title: `Recommendation ${id}`,
    message: `Message for ${id}`,
    severity: 'warning',
    confidence: 'high',
    expectedImpact: `Impact for ${id}`,
    ...overrides,
  }
}

describe('buildTopRecommendation', () => {
  it('returns undefined when no recommendations are provided', () => {
    expect(buildTopRecommendation([])).toBeUndefined()
  })

  it('selects higher severity before lower severity', () => {
    const warningRecommendation = createRecommendation('warning', { severity: 'warning' })
    const criticalRecommendation = createRecommendation('critical', { severity: 'critical' })

    expect(buildTopRecommendation([warningRecommendation, criticalRecommendation])).toBe(
      criticalRecommendation,
    )
  })

  it('uses confidence when severity is tied', () => {
    const mediumConfidenceRecommendation = createRecommendation('medium-confidence', {
      confidence: 'medium',
      severity: 'warning',
    })
    const highConfidenceRecommendation = createRecommendation('high-confidence', {
      confidence: 'high',
      severity: 'warning',
    })

    expect(
      buildTopRecommendation([mediumConfidenceRecommendation, highConfidenceRecommendation]),
    ).toBe(highConfidenceRecommendation)
  })

  it('keeps the first recommendation when priority is tied', () => {
    const firstRecommendation = createRecommendation('first', {
      confidence: 'medium',
      severity: 'warning',
    })
    const secondRecommendation = createRecommendation('second', {
      confidence: 'medium',
      severity: 'warning',
    })

    expect(buildTopRecommendation([firstRecommendation, secondRecommendation])).toBe(
      firstRecommendation,
    )
  })

  it('does not let confidence outrank severity', () => {
    const highConfidenceWarning = createRecommendation('warning', {
      confidence: 'high',
      severity: 'warning',
    })
    const lowConfidenceCritical = createRecommendation('critical', {
      confidence: 'low',
      severity: 'critical',
    })

    expect(buildTopRecommendation([highConfidenceWarning, lowConfidenceCritical])).toBe(
      lowConfidenceCritical,
    )
  })
})
