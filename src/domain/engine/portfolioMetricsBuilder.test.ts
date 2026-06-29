import { describe, expect, it } from 'vitest'
import type { PortfolioSnapshot } from '../types'
import { buildPortfolioMetrics } from './portfolioMetricsBuilder'

describe('buildPortfolioMetrics', () => {
  it('builds portfolio metrics from a portfolio snapshot', () => {
    expect(
      buildPortfolioMetrics({
        totalValue: 100_000,
        cashValue: 15_000,
        cashWeight: 0.15,
      }),
    ).toEqual({
      cashWeight: 0.15,
    })
  })

  it('does not mutate the snapshot', () => {
    const snapshot: PortfolioSnapshot = {
      totalValue: 100_000,
      cashValue: 20_000,
      cashWeight: 0.2,
    }

    const metrics = buildPortfolioMetrics(snapshot)

    expect(snapshot).toEqual({
      totalValue: 100_000,
      cashValue: 20_000,
      cashWeight: 0.2,
    })
    expect(metrics).not.toBe(snapshot)
  })

  it('is deterministic for the same snapshot', () => {
    const snapshot: PortfolioSnapshot = {
      totalValue: 100_000,
      cashValue: 10_000,
      cashWeight: 0.1,
    }

    expect(buildPortfolioMetrics(snapshot)).toEqual(buildPortfolioMetrics(snapshot))
  })
})
