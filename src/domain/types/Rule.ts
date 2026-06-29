import type { InvestmentContext } from './InvestmentContext'

export type RuleSeverity = 'info' | 'warning' | 'critical'

export type RuleStatus = 'pass' | 'warning' | 'fail'

export type RuleCategory =
  | 'allocation'
  | 'risk'
  | 'dividend'
  | 'tax'
  | 'valuation'
  | 'cash'
  | 'quality'
  | 'policy'

export type RuleResult = {
  readonly ruleId: string
  readonly title: string
  readonly status: RuleStatus
  readonly message: string
  readonly score?: number
  readonly details?: readonly string[]
}

export interface  InvestmentRule {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly severity: RuleSeverity
  readonly category: RuleCategory

  evaluate(context: InvestmentContext): RuleResult
}
