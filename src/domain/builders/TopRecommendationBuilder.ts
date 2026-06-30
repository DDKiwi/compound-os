import type { Recommendation } from '../types'

type RecommendationWithRanking = Recommendation & {
  readonly priority?: 'low' | 'medium' | 'high'
  readonly score?: number
}

const priorityRank: Record<NonNullable<RecommendationWithRanking['priority']>, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

function getRecommendationRank(recommendation: Recommendation): number | undefined {
  const rankedRecommendation = recommendation as RecommendationWithRanking

  if (rankedRecommendation.priority !== undefined) {
    return priorityRank[rankedRecommendation.priority]
  }

  return rankedRecommendation.score
}

export function buildTopRecommendation(
  recommendations: readonly Recommendation[],
): Recommendation | undefined {
  const rankedRecommendations = recommendations
    .map((recommendation, index) => ({
      index,
      rank: getRecommendationRank(recommendation),
      recommendation,
    }))
    .filter((entry): entry is { index: number; rank: number; recommendation: Recommendation } => {
      return entry.rank !== undefined
    })

  if (rankedRecommendations.length > 0) {
    return rankedRecommendations.reduce((topRecommendation, recommendation) => {
      if (recommendation.rank > topRecommendation.rank) {
        return recommendation
      }

      if (recommendation.rank === topRecommendation.rank && recommendation.index < topRecommendation.index) {
        return recommendation
      }

      return topRecommendation
    }).recommendation
  }

  // TODO: Replace this fallback when Recommendation exposes an explicit priority or score.
  return recommendations[0]
}
