export type InvestmentPhilosophy = {
  text: string
}

export type RiskTolerance = 'conservative' | 'balanced' | 'growth' | 'aggressive'

export type AllocationType = 'asset' | 'sector' | 'country' | 'currency'

export type AllocationTarget = {
  name: string
  targetWeight: number
}

export type AllocationRule = {
  id: string
  name: string
  allocationType: AllocationType
  targets: AllocationTarget[]
}

export type PositionRule = {
  id: string
  maxWeight: number
}

export type ExposureRule = {
  id: string
  maxWeight: number
}

export type DividendPreference = 'income' | 'growth' | 'balanced' | 'none'

export type DividendPolicy = {
  preference: DividendPreference
  notes?: string
}

export type RebalancingRule = {
  id: string
  driftThreshold: number
}

export type InvestmentPolicy = {
  id: string
  name: string
  philosophy: InvestmentPhilosophy
  riskTolerance: RiskTolerance
  allocationRules: AllocationRule[]
  positionRule: PositionRule
  exposureRule: ExposureRule
  dividendPolicy: DividendPolicy
  rebalancingRule: RebalancingRule
}

export type PolicyRulePass = {
  ruleId: string
  message: string
}

export type PolicyViolation = {
  ruleId: string
  message: string
  actualWeight?: number
  limitWeight?: number
  targetWeight?: number
}

export type PolicyWarning = {
  ruleId: string
  message: string
  actualWeight?: number
  targetWeight?: number
  driftWeight?: number
}

export type SuggestedAction = {
  id: string
  ruleId: string
  type: 'buy' | 'sell' | 'rebalance' | 'review' | 'observe'
  priority: 'low' | 'medium' | 'high'
  message: string
}

export type PolicyEvaluation = {
  portfolioId: string
  policyId: string
  passedRules: PolicyRulePass[]
  warnings: PolicyWarning[]
  violations: PolicyViolation[]
  suggestedActions: SuggestedAction[]
}
