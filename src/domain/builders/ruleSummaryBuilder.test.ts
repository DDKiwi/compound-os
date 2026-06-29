import { describe, expect, it } from 'vitest'
import type { RuleResult } from '../types'
import { buildRuleSummary } from './ruleSummaryBuilder'

function createRuleResult(ruleId: string, status: RuleResult['status']): RuleResult {
  return {
    ruleId,
    title: `Rule ${ruleId}`,
    status,
    message: `Result for ${ruleId}`,
  }
}

describe('buildRuleSummary', () => {
  it('returns an empty summary with a perfect score for an empty result list', () => {
    expect(buildRuleSummary([])).toEqual({
      total: 0,
      passed: 0,
      warnings: 0,
      failed: 0,
      score: 100,
      criticalFailures: 0,
    })
  })

  it('summarizes only passed results', () => {
    expect(
      buildRuleSummary([
        createRuleResult('first-rule', 'pass'),
        createRuleResult('second-rule', 'pass'),
      ]),
    ).toEqual({
      total: 2,
      passed: 2,
      warnings: 0,
      failed: 0,
      score: 100,
      criticalFailures: 0,
    })
  })

  it('summarizes warning results', () => {
    expect(buildRuleSummary([createRuleResult('warning-rule', 'warning')])).toEqual({
      total: 1,
      passed: 0,
      warnings: 1,
      failed: 0,
      score: 50,
      criticalFailures: 0,
    })
  })

  it('summarizes failed results', () => {
    expect(buildRuleSummary([createRuleResult('failed-rule', 'fail')])).toEqual({
      total: 1,
      passed: 0,
      warnings: 0,
      failed: 1,
      score: 0,
      criticalFailures: 0,
    })
  })

  it('summarizes mixed results', () => {
    expect(
      buildRuleSummary([
        createRuleResult('first-rule', 'pass'),
        createRuleResult('second-rule', 'warning'),
        createRuleResult('third-rule', 'fail'),
        createRuleResult('fourth-rule', 'pass'),
      ]),
    ).toEqual({
      total: 4,
      passed: 2,
      warnings: 1,
      failed: 1,
      score: 62.5,
      criticalFailures: 0,
    })
  })

  it('calculates a normalized score from statuses', () => {
    expect(
      buildRuleSummary([
        createRuleResult('first-rule', 'pass'),
        createRuleResult('second-rule', 'warning'),
        createRuleResult('third-rule', 'fail'),
      ]).score,
    ).toBe(50)
  })

  it('does not mutate the input', () => {
    const results: RuleResult[] = [
      createRuleResult('first-rule', 'pass'),
      createRuleResult('second-rule', 'warning'),
      createRuleResult('third-rule', 'fail'),
    ]
    const originalResults = results.map((result) => ({ ...result }))

    buildRuleSummary(results)

    expect(results).toEqual(originalResults)
  })
})
