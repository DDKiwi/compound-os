import { describe, expect, it } from 'vitest'
import { buildPortfolioSnapshot } from './portfolioSnapshotBuilder'

describe('buildPortfolioSnapshot', () => {
  it('builds a portfolio snapshot with cash weight', () => {
    expect(
      buildPortfolioSnapshot({
        totalValue: 100_000,
        cashValue: 15_000,
      }),
    ).toEqual({
      totalValue: 100_000,
      cashValue: 15_000,
      cashWeight: 0.15,
    })
  })

  it('sets cash weight to zero when total value is zero', () => {
    expect(
      buildPortfolioSnapshot({
        totalValue: 0,
        cashValue: 0,
      }),
    ).toEqual({
      totalValue: 0,
      cashValue: 0,
      cashWeight: 0,
    })
  })

  it('supports a fully cash portfolio', () => {
    expect(
      buildPortfolioSnapshot({
        totalValue: 50_000,
        cashValue: 50_000,
      }),
    ).toEqual({
      totalValue: 50_000,
      cashValue: 50_000,
      cashWeight: 1,
    })
  })

  it('does not mutate the input', () => {
    const input = {
      totalValue: 100_000,
      cashValue: 20_000,
    }

    const snapshot = buildPortfolioSnapshot(input)

    expect(input).toEqual({
      totalValue: 100_000,
      cashValue: 20_000,
    })
    expect(snapshot).not.toBe(input)
  })

  it('rejects negative total value', () => {
    expect(() =>
      buildPortfolioSnapshot({
        totalValue: -1,
        cashValue: 0,
      }),
    ).toThrow('Portfolio total value cannot be negative.')
  })

  it('rejects negative cash value', () => {
    expect(() =>
      buildPortfolioSnapshot({
        totalValue: 100_000,
        cashValue: -1,
      }),
    ).toThrow('Portfolio cash value cannot be negative.')
  })

  it('rejects cash value greater than total value', () => {
    expect(() =>
      buildPortfolioSnapshot({
        totalValue: 100_000,
        cashValue: 100_001,
      }),
    ).toThrow('Portfolio cash value cannot exceed total value.')
  })
})
