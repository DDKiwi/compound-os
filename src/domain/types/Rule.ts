export type RuleSeverity = 'info' | 'warning' | 'critical'

export type InvestmentRule = {
  id: string
  title: string
  description: string
  severity: RuleSeverity
}

export type RuleStatus = 'pass' | 'warning' | 'fail'

export type RuleResult = {
  ruleId: string
  title: string
  status: RuleStatus
  message: string
}
