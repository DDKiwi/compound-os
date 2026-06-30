import { describe, expect, it } from 'vitest'
import type {
  InvestmentSimulationAction,
  InvestmentSimulationStep,
  Portfolio,
} from '../types'
import { createPortfolioTransactionFromSimulationStep } from './PortfolioTransactionFactory'

const portfolio: Portfolio = {
  id: 'portfolio-1',
  holdings: [],
  cashBalance: 0,
  watchlist: [],
  journalEntries: [],
  dividendProjection: [],
}

const date = new Date('2026-06-30T12:00:00.000Z')

function createStep(action: InvestmentSimulationAction): InvestmentSimulationStep {
  return {
    date,
    action,
    portfolio,
  }
}

describe('PortfolioTransactionFactory', () => {
  it('creates deposit transactions from simulation steps', () => {
    const transaction = createPortfolioTransactionFromSimulationStep(
      createStep({
        type: 'deposit',
        amount: 10_000,
        currency: 'SEK',
      }),
    )

    expect(transaction).toEqual({
      id: 'deposit-2026-06-30T12:00:00.000Z',
      type: 'deposit',
      date,
      amount: 10_000,
      currency: 'SEK',
      origin: 'simulation',
    })
  })

  it('creates withdraw transactions from simulation steps', () => {
    const transaction = createPortfolioTransactionFromSimulationStep(
      createStep({
        type: 'withdraw',
        amount: 5_000,
      }),
    )

    expect(transaction).toEqual({
      id: 'withdraw-2026-06-30T12:00:00.000Z',
      type: 'withdraw',
      date,
      amount: 5_000,
      origin: 'simulation',
    })
  })

  it('sets simulation origin for transactions', () => {
    const transaction = createPortfolioTransactionFromSimulationStep(
      createStep({
        type: 'deposit',
      }),
    )

    expect(transaction.origin).toBe('simulation')
  })

  it('keeps amount as the monetary value in the transaction currency', () => {
    const transaction = createPortfolioTransactionFromSimulationStep(
      createStep({
        type: 'buy',
        amount: 12_500,
        ticker: 'INVE B',
        quantity: 10,
        price: 1_250,
        currency: 'SEK',
      }),
    )

    expect(transaction).toMatchObject({
      type: 'buy',
      amount: 12_500,
      ticker: 'INVE B',
      quantity: 10,
      price: 1_250,
      currency: 'SEK',
      origin: 'simulation',
    })
  })
})
