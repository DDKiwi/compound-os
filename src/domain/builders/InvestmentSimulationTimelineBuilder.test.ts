import { afterEach, describe, expect, it, vi } from 'vitest'
import type { InvestmentPolicy, InvestmentSimulationContext, Portfolio } from '../types'
import { buildInvestmentSimulationTimeline } from './InvestmentSimulationTimelineBuilder'

const date = new Date('2026-06-30T12:00:00.000Z')

const portfolio: Portfolio = {
  id: 'portfolio-1',
  holdings: [],
  cashBalance: 0,
  watchlist: [],
  journalEntries: [],
  dividendProjection: [],
}

const policy: InvestmentPolicy = {
  id: 'policy-1',
  name: 'Long-term policy',
  philosophy: {
    text: 'Own durable compounders.',
  },
  riskTolerance: 'balanced',
  allocationRules: [],
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
  rebalancingRule: {
    id: 'rebalancing-threshold',
    driftThreshold: 0.1,
  },
}

function createContext(): InvestmentSimulationContext {
  return {
    input: {
      portfolio,
      policy,
      action: {
        type: 'deposit',
        amount: 10_000,
      },
    },
    portfolio,
  }
}

describe('buildInvestmentSimulationTimeline', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('builds a simulation timeline with one step from the context', () => {
    vi.useFakeTimers()
    vi.setSystemTime(date)

    expect(buildInvestmentSimulationTimeline(createContext())).toEqual({
      steps: [
        {
          date,
          action: {
            type: 'deposit',
            amount: 10_000,
          },
          portfolio,
        },
      ],
    })
  })
})
