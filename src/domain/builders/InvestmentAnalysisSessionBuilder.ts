import type { InvestmentAnalysisReport, InvestmentAnalysisSession, InvestmentPolicy, Portfolio } from '../types'

export type InvestmentAnalysisSessionBuilderInput = {
  readonly portfolio: Portfolio
  readonly policy: InvestmentPolicy
  readonly report: InvestmentAnalysisReport
}

const INVESTMENT_ANALYSIS_SESSION_VERSION = '1'

export function buildInvestmentAnalysisSession(
  input: InvestmentAnalysisSessionBuilderInput,
): InvestmentAnalysisSession {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    portfolio: input.portfolio,
    policy: input.policy,
    report: input.report,
    version: INVESTMENT_ANALYSIS_SESSION_VERSION,
  }
}
