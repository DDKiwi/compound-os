import { describe, expect, it } from 'vitest'
import type { InvestmentAnalysisSummary } from '../types'
import { buildInvestmentHealth } from './InvestmentHealthBuilder'

function createSummary(ruleScore: number): Pick<InvestmentAnalysisSummary, 'ruleScore'> {
  return {
    ruleScore,
  }
}

describe('buildInvestmentHealth', () => {
  it.each([
    [100, 'excellent', 'Excellent'],
    [90, 'excellent', 'Excellent'],
    [89, 'good', 'Good'],
    [75, 'good', 'Good'],
    [74, 'fair', 'Fair'],
    [60, 'fair', 'Fair'],
    [59, 'poor', 'Poor'],
    [0, 'poor', 'Poor'],
  ] as const)('maps rule score %s to %s health', (ruleScore, status, label) => {
    expect(buildInvestmentHealth(createSummary(ruleScore))).toEqual({
      score: ruleScore,
      label,
      status,
    })
  })
})
