import type { InvestmentPhilosophy } from '../philosophy'

export const mockPhilosophy: InvestmentPhilosophy = {
  id: 'mock-compound-os-philosophy',
  presetId: 'index-core-quality-income',
  name: 'Compound OS Strategy',
  description: 'Global index base, controlled speculation, cash resilience, income progress, and quality before yield.',
  createdAt: '2026-06-29T00:00:00.000Z',
  metadata: {
    targetBuffer: 80000,
    monthlyDividendGoal: 10000,
    reinvestDividends: true,
  },
  rules: [
    {
      id: 'philosophy-global-index-base',
      type: 'min_allocation',
      title: 'Global index as base',
      description: 'Global index exposure should remain the portfolio base before satellites are expanded.',
      severity: 'critical',
      condition: {
        dimension: 'classification',
        target: 'GlobalIndex',
        minPercent: 40,
      },
    },
    {
      id: 'philosophy-max-one-speculative',
      type: 'max_count',
      title: 'Max one speculative holding',
      description: 'Speculative holdings should be limited to one active position.',
      severity: 'critical',
      condition: {
        dimension: 'classification',
        target: 'SpeculativeGrowth',
        maxCount: 1,
      },
    },
    {
      id: 'philosophy-speculative-exposure',
      type: 'max_allocation',
      title: 'Max speculative exposure',
      description: 'Speculative exposure should not exceed 2 percent of the portfolio.',
      severity: 'critical',
      condition: {
        dimension: 'classification',
        target: 'SpeculativeGrowth',
        maxPercent: 2,
      },
    },
    {
      id: 'philosophy-cash-buffer',
      type: 'min_cash_buffer',
      title: 'Target cash buffer',
      description: 'Cash reserve should reach the 80 000 SEK strategy buffer.',
      severity: 'warning',
      condition: {
        minAmount: 80000,
      },
    },
    {
      id: 'philosophy-monthly-dividend-goal',
      type: 'dividend_goal',
      title: 'Monthly dividend goal',
      description: 'Expected dividends should progress toward 10 000 SEK per month.',
      severity: 'warning',
      condition: {
        minMonthlyDividend: 10000,
      },
    },
    {
      id: 'philosophy-quality-before-yield',
      type: 'quality_priority',
      title: 'Quality before yield',
      description: 'Portfolio quality should stay ahead of yield chasing.',
      severity: 'critical',
      condition: {
        minAverageMoatScore: 3.5,
      },
    },
    {
      id: 'philosophy-reinvest-dividends',
      type: 'reinvest_dividends',
      title: 'Reinvest dividends',
      description: 'Dividends are reinvested while the compounding plan is active.',
      severity: 'info',
      condition: {
        requireEnabled: true,
      },
    },
  ],
}
