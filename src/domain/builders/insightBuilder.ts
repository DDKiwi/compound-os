import type { DividendForecast, Insight, RuleResult, RuleSummary } from '../types'

function hasNoDividendPayments(forecast: DividendForecast): boolean {
  return forecast.months.every((month) => month.payments.length === 0)
}

function getDominantDividendMonth(forecast: DividendForecast) {
  if (forecast.totalAmount <= 0) {
    return null
  }

  let dominantMonth: DividendForecast['months'][number] | null = null

  for (const month of forecast.months) {
    if (dominantMonth === null || month.totalAmount > dominantMonth.totalAmount) {
      dominantMonth = month
    }
  }

  if (dominantMonth === null || dominantMonth.totalAmount / forecast.totalAmount <= 0.5) {
    return null
  }

  return dominantMonth
}

export function buildInsights(
  dividendForecast: DividendForecast | undefined,
  ruleSummary: RuleSummary,
  ruleResults: readonly RuleResult[],
): Insight[] {
  const insights: Insight[] = []

  if (ruleSummary.failed === 0) {
    insights.push({
      id: 'portfolio-no-failed-rules',
      title: 'Portfolio has no failed rules',
      description: `All ${ruleResults.length} evaluated rules are currently free from failures.`,
      category: 'policy',
      importance: 'medium',
    })
  }

  if (ruleSummary.score > 90) {
    insights.push({
      id: 'portfolio-health-above-90',
      title: 'Portfolio health exceeds 90',
      description: `The current rule summary score is ${ruleSummary.score}.`,
      category: 'health',
      importance: 'high',
    })
  }

  if (dividendForecast === undefined) {
    return insights
  }

  if (hasNoDividendPayments(dividendForecast)) {
    insights.push({
      id: 'dividend-forecast-no-payments',
      title: 'Dividend forecast contains no payments',
      description: 'No dividend payments are present in the current forecast.',
      category: 'dividend',
      importance: 'medium',
    })
  }

  const dominantDividendMonth = getDominantDividendMonth(dividendForecast)

  if (dominantDividendMonth !== null) {
    insights.push({
      id: 'dividend-forecast-concentrated-month',
      title: 'More than 50% of dividends occur in one month',
      description: `${dominantDividendMonth.month} contains more than half of the forecast dividend amount.`,
      category: 'dividend',
      importance: 'high',
    })
  }

  return insights
}
