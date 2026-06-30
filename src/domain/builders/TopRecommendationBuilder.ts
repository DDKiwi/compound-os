import type { Recommendation } from '../types'

const severityRank: Record<Recommendation['severity'], number> = {
  info: 1,
  warning: 2,
  critical: 3,
}

const confidenceRank: Record<Recommendation['confidence'], number> = {
  low: 1,
  medium: 2,
  high: 3,
}

function compareRecommendationPriority(
  recommendation: Recommendation,
  topRecommendation: Recommendation,
): number {
  const severityDifference =
    severityRank[recommendation.severity] - severityRank[topRecommendation.severity]

  if (severityDifference !== 0) {
    return severityDifference
  }

  return confidenceRank[recommendation.confidence] - confidenceRank[topRecommendation.confidence]
}

export function buildTopRecommendation(
  recommendations: readonly Recommendation[],
): Recommendation | undefined {
  return recommendations.reduce<Recommendation | undefined>((topRecommendation, recommendation) => {
    if (topRecommendation === undefined) {
      return recommendation
    }

    return compareRecommendationPriority(recommendation, topRecommendation) > 0
      ? recommendation
      : topRecommendation
  }, undefined)
}
