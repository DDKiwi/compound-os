import type {
  AccountType,
  AssetType,
  CountryExposure,
  Goal,
  Holding,
  HoldingClassification,
  PortfolioRole,
} from '../types'

export type PhilosophyRuleType =
  | 'min_allocation'
  | 'max_allocation'
  | 'target_allocation_range'
  | 'max_count'
  | 'min_cash_buffer'
  | 'dividend_goal'
  | 'reinvest_dividends'
  | 'quality_priority'

export type RuleSeverity = 'info' | 'warning' | 'critical'

export type AllocationDimension =
  | 'accountType'
  | 'assetType'
  | 'classification'
  | 'countryExposure'
  | 'portfolioRole'

export type AllocationTarget =
  | AccountType
  | AssetType
  | HoldingClassification
  | CountryExposure
  | PortfolioRole

export type RuleCondition = {
  dimension?: AllocationDimension
  target?: AllocationTarget
  minPercent?: number
  maxPercent?: number
  targetPercent?: number
  tolerancePercent?: number
  maxCount?: number
  minAmount?: number
  minMonthlyDividend?: number
  minAverageDividendGrowthPercent?: number
  minAverageMoatScore?: number
  requireEnabled?: boolean
  includeCash?: boolean
}

export type PhilosophyRule = {
  id: string
  type: PhilosophyRuleType
  title: string
  description: string
  severity: RuleSeverity
  condition: RuleCondition
}

export type InvestmentPhilosophy = {
  id: string
  presetId: string
  name: string
  description: string
  createdAt: string
  rules: PhilosophyRule[]
  metadata?: Record<string, string | number | boolean>
}

export type PhilosophyProfileInput = {
  id?: string
  name?: string
  description?: string
  targetNetWorth?: number
  targetCashBuffer?: number
  targetMonthlyDividend?: number
  targetCoreAllocationPercent?: number
  targetIndexAllocationPercent?: number
  targetIncomeAllocationPercent?: number
  maxSingleHoldingPercent?: number
  maxSpeculativePercent?: number
  maxHoldingCount?: number
  minAverageMoatScore?: number
  minAverageDividendGrowthPercent?: number
  reinvestDividends?: boolean
  createdAt?: string
}

export type PhilosophyPreset = {
  id: string
  name: string
  description: string
  createRules: (input: PhilosophyProfileInput) => PhilosophyRule[]
}

export type RuleStatus = 'pass' | 'warning' | 'fail'

export type RuleEvaluation = {
  ruleId: string
  ruleType: PhilosophyRuleType
  title: string
  severity: RuleSeverity
  status: RuleStatus
  message: string
  actualValue?: number | boolean
  expectedValue?: number | boolean
}

export type PhilosophyEvaluationResult = {
  score: number
  passedRules: PhilosophyRule[]
  warningRules: PhilosophyRule[]
  failedRules: PhilosophyRule[]
  evaluations: RuleEvaluation[]
}

export type PhilosophyHoldingsInput = Holding[]

export type PhilosophyGoalsInput = Goal
