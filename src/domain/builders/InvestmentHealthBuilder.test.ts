import { describe, expect, it } from 'vitest'
import type { InvestmentAnalysisSummary } from '../types'
import { buildInvestmentHealth } from './InvestmentHealthBuilder'

function createSummary(ruleScore: number): InvestmentAnalysisSummary {
  return {
    sessionId: 'session-1',
    generatedAt: new Date('2026-06-30T12:00:00.000Z'),
    totalValue: 100_000,
    cash: 10_000,
    investedValue: 90_000,
    cashReserveRatio: 0.1,
    ruleScore,
    passedRules: 4,
    failedRules: 0,
    warningRules: 0,
    recommendationCount: 0,
    insightCount: 0,
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
