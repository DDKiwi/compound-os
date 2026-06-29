import { describe, expect, it } from 'vitest'
import type { DividendForecast, RuleResult, RuleSummary } from '../types'
import { buildInsights } from './insightBuilder'

function createDividendForecast(
  months: DividendForecast['months'] = [],
  totalAmount = months.reduce((sum, month) => sum + month.totalAmount, 0),
): DividendForecast {
  return {
    totalAmount,
    currency: 'SEK',
    months,
  }
}

function createDividendMonth(
  month: string,
  totalAmount: number,
  paymentCount = 1,
): DividendForecast['months'][number] {
  return {
    month,
    totalAmount,
    currency: 'SEK',
    payments: Array.from({ length: paymentCount }, (_, index) => ({
      holdingId: `holding-${index}`,
      holdingName: `Holding ${index}`,
      paymentDate: `${month}-25`,
      amount: totalAmount / paymentCount,
      currency: 'SEK',
    })),
  }
}

function createRuleSummary(overrides: Partial<RuleSummary> = {}): RuleSummary {
  return {
    total: 3,
    passed: 2,
    warnings: 1,
    failed: 0,
    score: 80,
    criticalFailures: 0,
    ...overrides,
  }
}

function createRuleResult(ruleId: string, status: RuleResult['status'] = 'pass'): RuleResult {
  return {
    ruleId,
    title: `Rule ${ruleId}`,
    status,
    message: `Result for ${ruleId}`,
  }
}

describe('buildInsights', () => {
  it('returns insights for a healthy portfolio with no failed rules', () => {
    const insights = buildInsights(createDividendForecast([createDividendMonth('2026-01', 100)]), createRuleSummary({ score: 95 }), [
      createRuleResult('first-rule'),
      createRuleResult('second-rule'),
    ])

    expect(insights).toEqual([
      {
        id: 'portfolio-no-failed-rules',
        title: 'Portfolio has no failed rules',
        description: 'All 2 evaluated rules are currently free from failures.',
        category: 'policy',
        importance: 'medium',
      },
      {
        id: 'portfolio-health-above-90',
        title: 'Portfolio health exceeds 90',
        description: 'The current rule summary score is 95.',
        category: 'health',
        importance: 'high',
      },
      {
        id: 'dividend-forecast-concentrated-month',
        title: 'More than 50% of dividends occur in one month',
        description: '2026-01 contains more than half of the forecast dividend amount.',
        category: 'dividend',
        importance: 'high',
      },
    ])
  })

  it('does not create the no failed rules insight when any rule has failed', () => {
    const insights = buildInsights(
      createDividendForecast([createDividendMonth('2026-01', 100)]),
      createRuleSummary({ failed: 1, score: 60 }),
      [createRuleResult('failed-rule', 'fail')],
    )

    expect(insights.map((insight) => insight.id)).not.toContain('portfolio-no-failed-rules')
  })

  it('creates an insight when the dividend forecast contains no payments', () => {
    const insights = buildInsights(
      createDividendForecast([
        {
          month: '2026-01',
          totalAmount: 0,
          currency: 'SEK',
          payments: [],
        },
      ]),
      createRuleSummary(),
      [],
    )

    expect(insights).toContainEqual({
      id: 'dividend-forecast-no-payments',
      title: 'Dividend forecast contains no payments',
      description: 'No dividend payments are present in the current forecast.',
      category: 'dividend',
      importance: 'medium',
    })
  })

  it('creates a concentration insight when one month contains more than half of dividends', () => {
    const insights = buildInsights(
      createDividendForecast([
        createDividendMonth('2026-01', 49),
        createDividendMonth('2026-02', 51),
      ]),
      createRuleSummary(),
      [],
    )

    expect(insights).toContainEqual({
      id: 'dividend-forecast-concentrated-month',
      title: 'More than 50% of dividends occur in one month',
      description: '2026-02 contains more than half of the forecast dividend amount.',
      category: 'dividend',
      importance: 'high',
    })
  })

  it('does not create a concentration insight when the largest month is exactly half', () => {
    const insights = buildInsights(
      createDividendForecast([
        createDividendMonth('2026-01', 50),
        createDividendMonth('2026-02', 50),
      ]),
      createRuleSummary(),
      [],
    )

    expect(insights.map((insight) => insight.id)).not.toContain(
      'dividend-forecast-concentrated-month',
    )
  })

  it('keeps a deterministic insight order', () => {
    const insights = buildInsights(
      createDividendForecast([
        createDividendMonth('2026-01', 60),
        createDividendMonth('2026-02', 40),
      ]),
      createRuleSummary({ score: 95 }),
      [createRuleResult('first-rule')],
    )

    expect(insights.map((insight) => insight.id)).toEqual([
      'portfolio-no-failed-rules',
      'portfolio-health-above-90',
      'dividend-forecast-concentrated-month',
    ])
  })

  it('does not mutate inputs', () => {
    const forecast = createDividendForecast([
      createDividendMonth('2026-01', 60),
      createDividendMonth('2026-02', 40),
    ])
    const summary = createRuleSummary({ score: 95 })
    const results = [createRuleResult('first-rule')]
    const originalForecast = structuredClone(forecast)
    const originalSummary = { ...summary }
    const originalResults = results.map((result) => ({ ...result }))

    buildInsights(forecast, summary, results)

    expect(forecast).toEqual(originalForecast)
    expect(summary).toEqual(originalSummary)
    expect(results).toEqual(originalResults)
  })
})
