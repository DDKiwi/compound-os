import type { RuleResult, RuleSummary } from '../types'

function getStatusScore(status: RuleResult['status']): number {
  if (status === 'pass') {
    return 100
  }

  if (status === 'warning') {
    return 50
  }

  return 0
}

export function buildRuleSummary(results: readonly RuleResult[]): RuleSummary {
  const total = results.length
  let passed = 0
  let warnings = 0
  let failed = 0
  let scoreTotal = 0

  for (const result of results) {
    if (result.status === 'pass') {
      passed += 1
    }

    if (result.status === 'warning') {
      warnings += 1
    }

    if (result.status === 'fail') {
      failed += 1
    }

    scoreTotal += getStatusScore(result.status)
  }

  return {
    total,
    passed,
    warnings,
    failed,
    score: total === 0 ? 100 : scoreTotal / total,
    criticalFailures: 0,
  }
}
