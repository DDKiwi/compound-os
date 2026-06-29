import { describe, expect, it, vi } from 'vitest'
import type { DividendForecast, InvestmentContext, InvestmentPolicy, InvestmentRule, Recommendation, RuleResult } from '../types'
import type { InvestmentAnalysisInput } from './investmentAnalysisEngine'
import { analyzeInvestment } from './investmentAnalysisEngine'

const generatedAt = new Date('2026-06-29T12:00:00.000Z')

const policy: InvestmentPolicy = {
  id: 'long-term-policy',
  name: 'Long-term policy',
  philosophy: {
    text: 'Own durable compounders and rebalance with discipline.',
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
}

const dividendForecast: DividendForecast = {
  totalAmount: 1_000,
  currency: 'SEK',
  months: [
    {
      month: '2026-01',
      totalAmount: 1_000,
      currency: 'SEK',
      payments: [
        {
          holdingId: 'compounder-ab',
          holdingName: 'Compounder AB',
          paymentDate: '2026-01-25',
          amount: 1_000,
          currency: 'SEK',
        },
      ],
    },
  ],
}

function createRuleResult(ruleId: string, status: RuleResult['status'] = 'pass'): RuleResult {
  return {
    ruleId,
    title: `Rule ${ruleId}`,
    status,
    message: `Result for ${ruleId}`,
  }
}

function createRecommendation(ruleId: string): Recommendation {
  return {
    id: `${ruleId}-recommendation`,
    ruleId,
    title: `Recommendation for ${ruleId}`,
    message: `Message for ${ruleId}`,
    severity: 'warning',
    confidence: 'high',
    expectedImpact: `Impact for ${ruleId}`,
  }
}

function createRule(
  ruleId: string,
  result: RuleResult = createRuleResult(ruleId),
  buildRecommendation?: InvestmentRule['buildRecommendation'],
): InvestmentRule {
  return {
    id: ruleId,
    title: `Rule ${ruleId}`,
    description: '',
    severity: 'warning',
    category: 'policy',
    evaluate: vi.fn(() => result),
    buildRecommendation,
  }
}

function createInput(rules: readonly InvestmentRule[] = []): InvestmentAnalysisInput {
  return {
    policy,
    generatedAt,
    snapshotInput: {
      totalValue: 100_000,
      cashValue: 15_000,
    },
    allocationInput: {
      holdings: [
        {
          id: 'compounder-ab',
          name: 'Compounder AB',
          value: 60_000,
          weight: 0.6,
        },
      ],
      sectors: [
        {
          id: 'software',
          name: 'Software',
          value: 60_000,
          weight: 0.6,
        },
      ],
      countries: [
        {
          id: 'sweden',
          name: 'Sweden',
          value: 60_000,
          weight: 0.6,
        },
      ],
      currencies: [
        {
          id: 'sek',
          name: 'SEK',
          value: 100_000,
          weight: 1,
        },
      ],
      assetClasses: [
        {
          id: 'equity',
          name: 'Equity',
          value: 85_000,
          weight: 0.85,
        },
      ],
    },
    dividendForecast,
    rules,
  }
}

describe('analyzeInvestment', () => {
  it('returns an investment analysis report', () => {
    const report = analyzeInvestment(createInput())

    expect(report).toEqual({
      generatedAt,
      snapshot: {
        totalValue: 100_000,
        cashValue: 15_000,
        cashWeight: 0.15,
      },
      allocation: {
        holdings: [
          {
            id: 'compounder-ab',
            name: 'Compounder AB',
            value: 60_000,
            weight: 0.6,
          },
        ],
        sectors: [
          {
            id: 'software',
            name: 'Software',
            value: 60_000,
            weight: 0.6,
          },
        ],
        countries: [
          {
            id: 'sweden',
            name: 'Sweden',
            value: 60_000,
            weight: 0.6,
          },
        ],
        currencies: [
          {
            id: 'sek',
            name: 'SEK',
            value: 100_000,
            weight: 1,
          },
        ],
        assetClasses: [
          {
            id: 'equity',
            name: 'Equity',
            value: 85_000,
            weight: 0.85,
          },
        ],
      },
      metrics: {
        cashWeight: 0.15,
      },
      dividendForecast,
      summary: {
        total: 0,
        passed: 0,
        warnings: 0,
        failed: 0,
        score: 100,
        criticalFailures: 0,
      },
      ruleResults: [],
      recommendations: [],
      insights: [
        {
          id: 'portfolio-no-failed-rules',
          title: 'Portfolio has no failed rules',
          description: 'All 0 evaluated rules are currently free from failures.',
          category: 'policy',
          importance: 'medium',
        },
        {
          id: 'portfolio-health-above-90',
          title: 'Portfolio health exceeds 90',
          description: 'The current rule summary score is 100.',
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
      ],
    })
  })

  it('populates generatedAt when not supplied', () => {
    const { generatedAt: _generatedAt, ...inputWithoutGeneratedAt } = createInput()
    const report = analyzeInvestment(inputWithoutGeneratedAt)

    expect(report.generatedAt).toBeInstanceOf(Date)
  })

  it('returns an immutable report object', () => {
    const report = analyzeInvestment(createInput())

    expect(Object.isFrozen(report)).toBe(true)
    expect(Object.isFrozen(report.ruleResults)).toBe(true)
    expect(Object.isFrozen(report.recommendations)).toBe(true)
    expect(Object.isFrozen(report.insights)).toBe(true)
  })

  it('evaluates rules with the internal investment context', () => {
    const firstResult = createRuleResult('cash-rule', 'warning')
    const secondResult = createRuleResult('allocation-rule', 'fail')
    const firstRule = createRule('cash-rule', firstResult)
    const secondRule = createRule('allocation-rule', secondResult)
    const report = analyzeInvestment(createInput([firstRule, secondRule]))
    const expectedContext: InvestmentContext = {
      policy,
      snapshot: report.snapshot,
      allocation: report.allocation,
      metrics: report.metrics,
    }

    expect(report.ruleResults).toEqual([firstResult, secondResult])
    expect(firstRule.evaluate).toHaveBeenCalledTimes(1)
    expect(secondRule.evaluate).toHaveBeenCalledTimes(1)
    expect(firstRule.evaluate).toHaveBeenCalledWith(expectedContext)
    expect(secondRule.evaluate).toHaveBeenCalledWith(expectedContext)
  })

  it('builds a rule summary without changing scoring logic', () => {
    const report = analyzeInvestment(
      createInput([
        createRule('passing-rule', createRuleResult('passing-rule', 'pass')),
        createRule('warning-rule', createRuleResult('warning-rule', 'warning')),
        createRule('failed-rule', createRuleResult('failed-rule', 'fail')),
      ]),
    )

    expect(report.summary).toEqual({
      total: 3,
      passed: 1,
      warnings: 1,
      failed: 1,
      score: 50,
      criticalFailures: 0,
    })
  })

  it('builds recommendations from rule results and rules', () => {
    const recommendation = createRecommendation('cash-rule')
    const rule = createRule('cash-rule', createRuleResult('cash-rule', 'fail'), () => recommendation)

    expect(analyzeInvestment(createInput([rule])).recommendations).toEqual([recommendation])
  })

  it('builds insights from the analysis sections', () => {
    const report = analyzeInvestment(createInput([createRule('passing-rule')]))

    expect(report.insights.map((insight) => insight.id)).toEqual([
      'portfolio-no-failed-rules',
      'portfolio-health-above-90',
      'dividend-forecast-concentrated-month',
    ])
  })

  it('supports an empty rules list', () => {
    const report = analyzeInvestment(createInput())

    expect(report.ruleResults).toEqual([])
    expect(report.summary).toEqual({
      total: 0,
      passed: 0,
      warnings: 0,
      failed: 0,
      score: 100,
      criticalFailures: 0,
    })
    expect(report.recommendations).toEqual([])
  })

  it('omits optional dividend forecast when not provided', () => {
    const { dividendForecast: _dividendForecast, ...inputWithoutDividendForecast } = createInput()
    const report = analyzeInvestment(inputWithoutDividendForecast)

    expect(report.dividendForecast).toBeUndefined()
    expect(report.insights.map((insight) => insight.id)).toEqual([
      'portfolio-no-failed-rules',
      'portfolio-health-above-90',
    ])
  })

  it('does not mutate the input', () => {
    const rule = createRule('cash-rule', createRuleResult('cash-rule', 'warning'), () =>
      createRecommendation('cash-rule'),
    )
    const input = createInput([rule])
    const originalInput = {
      policy: {
        ...input.policy,
        philosophy: { ...input.policy.philosophy },
        allocationRules: [...input.policy.allocationRules],
        positionRule: { ...input.policy.positionRule },
        exposureRule: { ...input.policy.exposureRule },
        dividendPolicy: { ...input.policy.dividendPolicy },
        rebalancingRule: { ...input.policy.rebalancingRule },
      },
      snapshotInput: { ...input.snapshotInput },
      allocationInput: {
        holdings: input.allocationInput.holdings?.map((weight) => ({ ...weight })),
        sectors: input.allocationInput.sectors?.map((weight) => ({ ...weight })),
        countries: input.allocationInput.countries?.map((weight) => ({ ...weight })),
        currencies: input.allocationInput.currencies?.map((weight) => ({ ...weight })),
        assetClasses: input.allocationInput.assetClasses?.map((weight) => ({ ...weight })),
      },
      dividendForecast: structuredClone(input.dividendForecast),
      ruleIds: input.rules.map((inputRule) => inputRule.id),
    }

    analyzeInvestment(input)

    expect(input.policy).toEqual(originalInput.policy)
    expect(input.snapshotInput).toEqual(originalInput.snapshotInput)
    expect(input.allocationInput).toEqual(originalInput.allocationInput)
    expect(input.dividendForecast).toEqual(originalInput.dividendForecast)
    expect(input.rules.map((inputRule) => inputRule.id)).toEqual(originalInput.ruleIds)
  })

  it('propagates errors from the snapshot builder', () => {
    expect(() =>
      analyzeInvestment({
        ...createInput(),
        snapshotInput: {
          totalValue: 100_000,
          cashValue: 100_001,
        },
      }),
    ).toThrow('Portfolio cash value cannot exceed total value.')
  })

  it('propagates errors from the allocation builder', () => {
    expect(() =>
      analyzeInvestment({
        ...createInput(),
        allocationInput: {
          holdings: [
            {
              id: 'invalid-holding',
              name: 'Invalid Holding',
              value: 10_000,
              weight: 1.1,
            },
          ],
        },
      }),
    ).toThrow('Allocation weight cannot exceed 1.')
  })

  it('is deterministic for the same input', () => {
    const input = createInput([
      createRule('cash-rule', createRuleResult('cash-rule', 'warning'), () =>
        createRecommendation('cash-rule'),
      ),
    ])

    expect(analyzeInvestment(input)).toEqual(analyzeInvestment(input))
  })
})
