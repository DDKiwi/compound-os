import type { PortfolioSnapshot } from '../types'

export type PortfolioSnapshotInput = {
  readonly totalValue: number
  readonly cashValue: number
}

export function buildPortfolioSnapshot(input: PortfolioSnapshotInput): PortfolioSnapshot {
  if (input.totalValue < 0) {
    throw new Error('Portfolio total value cannot be negative.')
  }

  if (input.cashValue < 0) {
    throw new Error('Portfolio cash value cannot be negative.')
  }

  if (input.cashValue > input.totalValue) {
    throw new Error('Portfolio cash value cannot exceed total value.')
  }

  return {
    totalValue: input.totalValue,
    cashValue: input.cashValue,
    cashWeight: input.totalValue === 0 ? 0 : input.cashValue / input.totalValue,
  }
}
