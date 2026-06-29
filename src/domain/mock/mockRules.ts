import type { InvestmentRule, RuleCategory, RuleSeverity } from '../types'

type MockRuleInput = {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly severity: RuleSeverity
  readonly category: RuleCategory
}

function createMockRule(rule: MockRuleInput): InvestmentRule {
  return {
    ...rule,
    evaluate: () => ({
      ruleId: rule.id,
      title: rule.title,
      status: 'pass',
      message: 'Rule is not implemented yet.',
    }),
  }
}

export const mockRules: InvestmentRule[] = [
  createMockRule({
    id: 'global-index-base',
    title: 'Global index är basen',
    description: 'Portföljen ska ha global indexexponering som stabil kärna innan satelliter byggs ut.',
    severity: 'info',
    category: 'allocation',
  }),
  createMockRule({
    id: 'kf-international-compounders',
    title: 'KF för internationella compounders och utdelare',
    description: 'KF används främst för internationella bolag med kvalitet, utdelning eller långsiktig compounding.',
    severity: 'warning',
    category: 'tax',
  }),
  createMockRule({
    id: 'high-risk-limit',
    title: 'Max ett high-risk-case',
    description: 'Spekulativ exponering ska begränsas till ett case, 50 000-75 000 kr eller max 2 % av kapitalet.',
    severity: 'critical',
    category: 'risk',
  }),
  createMockRule({
    id: 'dividend-goal',
    title: '10 000 kr/mån i utdelningar',
    description: 'Målet är uthålligt kassaflöde utan att offra bolagskvalitet.',
    severity: 'info',
    category: 'dividend',
  }),
]
