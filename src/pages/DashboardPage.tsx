import { InvestmentDashboard } from '../components/dashboard/InvestmentDashboard'
import { buildInvestmentAnalysisSummary, InvestmentAnalysisEngine } from '../domain'
import { CashDragRule } from '../domain/rules/CashDragRule'
import { CashReserveRule } from '../domain/rules/CashReserveRule'
import { MaxHoldingRule } from '../domain/rules/MaxHoldingRule'
import type { DividendForecast, InvestmentAnalysisInput, InvestmentPolicy, Portfolio } from '../domain'
import type { MockData, PageId } from '../types/investment'

const demoPortfolio: Portfolio = {
  id: 'demo-portfolio',
  holdings: [],
  watchlist: [],
  journalEntries: [],
  dividendProjection: [],
}

const demoPolicy: InvestmentPolicy = {
  id: 'demo-policy',
  name: 'Compound OS demo policy',
  philosophy: {
    text: 'Own durable compounders with a measured cash reserve.',
  },
  riskTolerance: 'balanced',
  allocationRules: [],
  maxHoldingWeight: 0.35,
  positionRule: {
    id: 'max-position-size',
    maxWeight: 0.35,
  },
  exposureRule: {
    id: 'max-sector-exposure',
    exposureType: 'sector',
    maxWeight: 0.45,
  },
  dividendPolicy: {
    preference: 'balanced',
  },
  cashReserve: 0.1,
  rebalancingRule: {
    id: 'rebalance-drift',
    driftThreshold: 0.1,
  },
}

const demoDividendForecast: DividendForecast = {
  totalAmount: 42_000,
  currency: 'SEK',
  months: [
    {
      month: '2026-07',
      totalAmount: 3_500,
      currency: 'SEK',
      payments: [
        {
          holdingId: 'demo-compounder',
          holdingName: 'Demo Compounder',
          paymentDate: '2026-07-25',
          amount: 3_500,
          currency: 'SEK',
        },
      ],
    },
  ],
}

const demoAnalysisInput: InvestmentAnalysisInput = {
  portfolio: demoPortfolio,
  policy: demoPolicy,
  generatedAt: new Date('2026-06-30T08:00:00.000Z'),
  snapshotInput: {
    totalValue: 1_250_000,
    cashValue: 125_000,
  },
  allocationInput: {
    holdings: [
      {
        id: 'demo-compounder',
        name: 'Demo Compounder',
        value: 375_000,
        weight: 0.3,
      },
      {
        id: 'global-index',
        name: 'Global Index',
        value: 750_000,
        weight: 0.6,
      },
    ],
    sectors: [
      {
        id: 'software',
        name: 'Software',
        value: 375_000,
        weight: 0.3,
      },
      {
        id: 'global',
        name: 'Global diversified',
        value: 750_000,
        weight: 0.6,
      },
    ],
    countries: [
      {
        id: 'global',
        name: 'Global',
        value: 1_125_000,
        weight: 0.9,
      },
    ],
    currencies: [
      {
        id: 'sek',
        name: 'SEK',
        value: 1_250_000,
        weight: 1,
      },
    ],
    assetClasses: [
      {
        id: 'equity',
        name: 'Equity',
        value: 1_125_000,
        weight: 0.9,
      },
    ],
  },
  dividendForecast: demoDividendForecast,
  rules: [CashReserveRule, CashDragRule, MaxHoldingRule],
}

const demoSession = InvestmentAnalysisEngine.createSession(demoAnalysisInput)
const demoSummary = buildInvestmentAnalysisSummary(demoSession)

export function DashboardPage({
  data: _data,
  navigate: _navigate,
}: {
  data: MockData
  navigate: (page: PageId) => void
}) {
  return <InvestmentDashboard summary={demoSummary} />
}
