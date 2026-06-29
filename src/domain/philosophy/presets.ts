import type { PhilosophyPreset, PhilosophyProfileInput, PhilosophyRule, RuleSeverity } from './types'

function rule(
  id: string,
  type: PhilosophyRule['type'],
  title: string,
  description: string,
  severity: RuleSeverity,
  condition: PhilosophyRule['condition'],
): PhilosophyRule {
  return {
    id,
    type,
    title,
    description,
    severity,
    condition,
  }
}

function targetRange(targetPercent: number, tolerancePercent: number) {
  return {
    minPercent: Math.max(targetPercent - tolerancePercent, 0),
    maxPercent: Math.min(targetPercent + tolerancePercent, 100),
    targetPercent,
    tolerancePercent,
  }
}

export const LongTermCompounder: PhilosophyPreset = {
  id: 'long-term-compounder',
  name: 'Long Term Compounder',
  description: 'Prioritizes durable compounders, concentration control, and quality over near-term yield.',
  createRules: (input: PhilosophyProfileInput) => [
    rule(
      'long-term-core-min',
      'min_allocation',
      'Minimum core allocation',
      'Core holdings should represent the majority of the portfolio.',
      'critical',
      {
        dimension: 'portfolioRole',
        target: 'Core',
        minPercent: input.targetCoreAllocationPercent ?? 55,
      },
    ),
    rule(
      'long-term-quality',
      'quality_priority',
      'Quality priority',
      'Average moat score should stay high enough for a compounder portfolio.',
      'critical',
      {
        minAverageMoatScore: input.minAverageMoatScore ?? 3.5,
      },
    ),
    rule(
      'long-term-single-position-max',
      'max_allocation',
      'Single holding concentration limit',
      'No active non-cash holding should dominate the portfolio.',
      'warning',
      {
        dimension: 'portfolioRole',
        maxPercent: input.maxSingleHoldingPercent ?? 25,
      },
    ),
    rule(
      'long-term-speculative-max',
      'max_allocation',
      'Speculative allocation limit',
      'Speculative growth exposure should stay small.',
      'critical',
      {
        dimension: 'classification',
        target: 'SpeculativeGrowth',
        maxPercent: input.maxSpeculativePercent ?? 5,
      },
    ),
  ],
}

export const DividendGrowth: PhilosophyPreset = {
  id: 'dividend-growth',
  name: 'Dividend Growth',
  description: 'Balances current income with dividend growth and reinvestment discipline.',
  createRules: (input: PhilosophyProfileInput) => [
    rule(
      'dividend-growth-income-min',
      'min_allocation',
      'Minimum income allocation',
      'Income holdings should be a meaningful part of the portfolio.',
      'warning',
      {
        dimension: 'portfolioRole',
        target: 'Income',
        minPercent: input.targetIncomeAllocationPercent ?? 30,
      },
    ),
    rule(
      'dividend-growth-goal',
      'dividend_goal',
      'Monthly dividend goal',
      'Expected monthly dividends should progress toward the profile goal.',
      'critical',
      {
        minMonthlyDividend: input.targetMonthlyDividend,
      },
    ),
    rule(
      'dividend-growth-rate',
      'quality_priority',
      'Dividend growth quality',
      'Dividend holdings should retain a healthy expected dividend growth rate.',
      'warning',
      {
        minAverageDividendGrowthPercent: input.minAverageDividendGrowthPercent ?? 5,
      },
    ),
    rule(
      'dividend-growth-reinvestment',
      'reinvest_dividends',
      'Dividend reinvestment',
      'Dividends should be reinvested while the accumulation plan is active.',
      'info',
      {
        requireEnabled: input.reinvestDividends ?? true,
      },
    ),
  ],
}

export const IndexCore: PhilosophyPreset = {
  id: 'index-core',
  name: 'Index Core',
  description: 'Uses global index exposure as the portfolio anchor with tight limits on complexity.',
  createRules: (input: PhilosophyProfileInput) => [
    rule(
      'index-core-global-index-range',
      'target_allocation_range',
      'Global index target range',
      'Global index exposure should remain close to the selected core target.',
      'critical',
      {
        dimension: 'classification',
        target: 'GlobalIndex',
        ...targetRange(input.targetIndexAllocationPercent ?? 70, 10),
      },
    ),
    rule(
      'index-core-max-holdings',
      'max_count',
      'Holding count limit',
      'The portfolio should stay simple enough to maintain.',
      'warning',
      {
        maxCount: input.maxHoldingCount ?? 12,
      },
    ),
    rule(
      'index-core-speculative-max',
      'max_allocation',
      'Speculative allocation cap',
      'Speculative holdings should be minimal in an index-core philosophy.',
      'critical',
      {
        dimension: 'classification',
        target: 'SpeculativeGrowth',
        maxPercent: input.maxSpeculativePercent ?? 3,
      },
    ),
  ],
}

export const FIRE: PhilosophyPreset = {
  id: 'fire',
  name: 'FIRE',
  description: 'Focuses on resilience, cash buffer coverage, broad compounding, and income progress.',
  createRules: (input: PhilosophyProfileInput) => [
    rule(
      'fire-cash-buffer',
      'min_cash_buffer',
      'Minimum cash buffer',
      'Cash reserve should meet the target buffer before taking extra risk.',
      'critical',
      {
        minAmount: input.targetCashBuffer,
      },
    ),
    rule(
      'fire-core-min',
      'min_allocation',
      'Minimum core allocation',
      'Core and broad holdings should remain the foundation.',
      'critical',
      {
        dimension: 'portfolioRole',
        target: 'Core',
        minPercent: input.targetCoreAllocationPercent ?? 50,
      },
    ),
    rule(
      'fire-monthly-income',
      'dividend_goal',
      'Monthly passive income goal',
      'Expected monthly dividends should support the FIRE income target.',
      'warning',
      {
        minMonthlyDividend: input.targetMonthlyDividend,
      },
    ),
    rule(
      'fire-position-max',
      'max_allocation',
      'Position risk cap',
      'Single-position exposure should not threaten the plan.',
      'warning',
      {
        maxPercent: input.maxSingleHoldingPercent ?? 20,
      },
    ),
  ],
}

export const QualityIncome: PhilosophyPreset = {
  id: 'quality-income',
  name: 'Quality Income',
  description: 'Seeks income from higher-quality holdings while limiting yield traps and concentration.',
  createRules: (input: PhilosophyProfileInput) => [
    rule(
      'quality-income-income-range',
      'target_allocation_range',
      'Income allocation range',
      'Income exposure should be material but not consume the whole portfolio.',
      'warning',
      {
        dimension: 'portfolioRole',
        target: 'Income',
        ...targetRange(input.targetIncomeAllocationPercent ?? 45, 15),
      },
    ),
    rule(
      'quality-income-quality',
      'quality_priority',
      'Income quality floor',
      'Average moat score should protect income durability.',
      'critical',
      {
        minAverageMoatScore: input.minAverageMoatScore ?? 3,
      },
    ),
    rule(
      'quality-income-dividend-goal',
      'dividend_goal',
      'Income target',
      'Expected monthly dividends should meet the profile target.',
      'warning',
      {
        minMonthlyDividend: input.targetMonthlyDividend,
      },
    ),
    rule(
      'quality-income-reinvestment',
      'reinvest_dividends',
      'Reinvest dividends',
      'Income should compound while portfolio withdrawals are inactive.',
      'info',
      {
        requireEnabled: input.reinvestDividends ?? true,
      },
    ),
  ],
}

export const philosophyPresets = {
  LongTermCompounder,
  DividendGrowth,
  IndexCore,
  FIRE,
  QualityIncome,
} as const

export type PhilosophyPresetName = keyof typeof philosophyPresets

export function getPhilosophyPreset(preset: PhilosophyPreset | PhilosophyPresetName) {
  return typeof preset === 'string' ? philosophyPresets[preset] : preset
}
