import { describe, expect, it } from 'vitest'
import type { Recommendation } from '../types'
import { buildTopRecommendation } from './TopRecommendationBuilder'

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

describe('buildTopRecommendation', () => {
  it('returns undefined when no recommendations are provided', () => {
    expect(buildTopRecommendation([])).toBeUndefined()
  })

  it('falls back to the first recommendation when no ranking exists yet', () => {
    const firstRecommendation = createRecommendation('first')
    const secondRecommendation = createRecommendation('second')

    expect(buildTopRecommendation([firstRecommendation, secondRecommendation])).toBe(
      firstRecommendation,
    )
  })

  it('uses priority when recommendations provide it', () => {
    const lowPriorityRecommendation = {
      ...createRecommendation('low'),
      priority: 'low',
    } as Recommendation
    const highPriorityRecommendation = {
      ...createRecommendation('high'),
      priority: 'high',
    } as Recommendation

    expect(buildTopRecommendation([lowPriorityRecommendation, highPriorityRecommendation])).toBe(
      highPriorityRecommendation,
    )
  })

  it('uses score when recommendations provide it', () => {
    const lowScoreRecommendation = {
      ...createRecommendation('low-score'),
      score: 20,
    } as Recommendation
    const highScoreRecommendation = {
      ...createRecommendation('high-score'),
      score: 80,
    } as Recommendation

    expect(buildTopRecommendation([lowScoreRecommendation, highScoreRecommendation])).toBe(
      highScoreRecommendation,
    )
  })

  it('keeps the first recommendation when rankings are tied', () => {
    const firstRecommendation = {
      ...createRecommendation('first'),
      score: 80,
    } as Recommendation
    const secondRecommendation = {
      ...createRecommendation('second'),
      score: 80,
    } as Recommendation

    expect(buildTopRecommendation([firstRecommendation, secondRecommendation])).toBe(
      firstRecommendation,
    )
  })
})
