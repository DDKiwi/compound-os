import { describe, expect, it, vi } from 'vitest'
import type { InvestmentPolicy, InvestmentRule, Recommendation, RuleResult } from '../types'
import type { InvestmentAnalysisInput } from './investmentAnalysisEngine'
import { analyzeInvestment } from './investmentAnalysisEngine'

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
    rules,
  }
}

describe('analyzeInvestment', () => {
  it('builds a portfolio snapshot', () => {
    expect(analyzeInvestment(createInput()).snapshot).toEqual({
      totalValue: 100_000,
      cashValue: 15_000,
      cashWeight: 0.15,
    })
  })

  it('builds a portfolio allocation', () => {
    expect(analyzeInvestment(createInput()).allocation).toEqual({
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
    })
  })

  it('builds portfolio metrics from the snapshot', () => {
    const result = analyzeInvestment(createInput())

    expect(result.metrics).toEqual({
      cashWeight: 0.15,
    })
  })

  it('creates an investment context', () => {
    const result = analyzeInvestment(createInput())

    expect(result.context).toEqual({
      policy,
      snapshot: result.snapshot,
      allocation: result.allocation,
      metrics: result.metrics,
    })
  })

  it('evaluates rules with the investment context', () => {
    const firstResult = createRuleResult('cash-rule', 'warning')
    const secondResult = createRuleResult('allocation-rule', 'fail')
    const firstRule = createRule('cash-rule', firstResult)
    const secondRule = createRule('allocation-rule', secondResult)
    const result = analyzeInvestment(createInput([firstRule, secondRule]))

    expect(result.ruleResults).toEqual([firstResult, secondResult])
    expect(firstRule.evaluate).toHaveBeenCalledTimes(1)
    expect(secondRule.evaluate).toHaveBeenCalledTimes(1)
    expect(firstRule.evaluate).toHaveBeenCalledWith(result.context)
    expect(secondRule.evaluate).toHaveBeenCalledWith(result.context)
  })

  it('builds a rule summary', () => {
    const result = analyzeInvestment(
      createInput([
        createRule('passing-rule', createRuleResult('passing-rule', 'pass')),
        createRule('warning-rule', createRuleResult('warning-rule', 'warning')),
        createRule('failed-rule', createRuleResult('failed-rule', 'fail')),
      ]),
    )

    expect(result.summary).toEqual({
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

  it('supports an empty rules list', () => {
    const result = analyzeInvestment(createInput())

    expect(result.ruleResults).toEqual([])
    expect(result.summary).toEqual({
      total: 0,
      passed: 0,
      warnings: 0,
      failed: 0,
      score: 100,
      criticalFailures: 0,
    })
    expect(result.recommendations).toEqual([])
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
      ruleIds: input.rules.map((inputRule) => inputRule.id),
    }

    analyzeInvestment(input)

    expect(input.policy).toEqual(originalInput.policy)
    expect(input.snapshotInput).toEqual(originalInput.snapshotInput)
    expect(input.allocationInput).toEqual(originalInput.allocationInput)
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
