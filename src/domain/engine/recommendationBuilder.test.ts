import { describe, expect, it, vi } from 'vitest'
import type { InvestmentRule, Recommendation, RuleResult } from '../types'
import { buildRecommendations } from './recommendationBuilder'

function createRuleResult(ruleId: string, status: RuleResult['status'] = 'fail'): RuleResult {
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
  buildRecommendation?: InvestmentRule['buildRecommendation'],
): InvestmentRule {
  return {
    id: ruleId,
    title: `Rule ${ruleId}`,
    description: '',
    severity: 'warning',
    category: 'policy',
    evaluate: vi.fn(() => createRuleResult(ruleId)),
    buildRecommendation,
  }
}

describe('buildRecommendations', () => {
  it('returns an empty recommendation list when no results or rules are provided', () => {
    expect(buildRecommendations([], [])).toEqual([])
  })

  it('calls buildRecommendation with the result for the same rule', () => {
    const result = createRuleResult('cash-rule', 'fail')
    const buildRecommendation = vi.fn(() => createRecommendation('cash-rule'))
    const rule = createRule('cash-rule', buildRecommendation)

    expect(buildRecommendations([result], [rule])).toEqual([createRecommendation('cash-rule')])
    expect(buildRecommendation).toHaveBeenCalledTimes(1)
    expect(buildRecommendation).toHaveBeenCalledWith(result)
  })

  it('does not evaluate rules', () => {
    const result = createRuleResult('cash-rule', 'fail')
    const rule = createRule('cash-rule', () => createRecommendation('cash-rule'))

    buildRecommendations([result], [rule])

    expect(rule.evaluate).not.toHaveBeenCalled()
  })

  it('preserves rule order instead of result order', () => {
    const firstRecommendation = createRecommendation('first-rule')
    const secondRecommendation = createRecommendation('second-rule')
    const thirdRecommendation = createRecommendation('third-rule')

    const recommendations = buildRecommendations(
      [
        createRuleResult('third-rule'),
        createRuleResult('first-rule'),
        createRuleResult('second-rule'),
      ],
      [
        createRule('first-rule', () => firstRecommendation),
        createRule('second-rule', () => secondRecommendation),
        createRule('third-rule', () => thirdRecommendation),
      ],
    )

    expect(recommendations).toEqual([
      firstRecommendation,
      secondRecommendation,
      thirdRecommendation,
    ])
  })

  it('skips rules without a matching result', () => {
    const buildRecommendation = vi.fn(() => createRecommendation('missing-result-rule'))

    expect(
      buildRecommendations([], [createRule('missing-result-rule', buildRecommendation)]),
    ).toEqual([])
    expect(buildRecommendation).not.toHaveBeenCalled()
  })

  it('skips rules without a recommendation builder', () => {
    expect(buildRecommendations([createRuleResult('no-builder-rule')], [
      createRule('no-builder-rule'),
    ])).toEqual([])
  })

  it('filters out null recommendations returned by rules', () => {
    const recommendation = createRecommendation('actionable-rule')

    expect(
      buildRecommendations(
        [createRuleResult('passing-rule', 'pass'), createRuleResult('actionable-rule', 'fail')],
        [
          createRule('passing-rule', () => null),
          createRule('actionable-rule', () => recommendation),
        ],
      ),
    ).toEqual([recommendation])
  })

  it('does not mutate the input lists', () => {
    const results = [createRuleResult('first-rule'), createRuleResult('second-rule')]
    const rules = [
      createRule('first-rule', () => createRecommendation('first-rule')),
      createRule('second-rule', () => null),
    ]
    const originalResults = results.map((result) => ({ ...result }))
    const originalRuleIds = rules.map((rule) => rule.id)

    buildRecommendations(results, rules)

    expect(results).toEqual(originalResults)
    expect(rules.map((rule) => rule.id)).toEqual(originalRuleIds)
  })
})
