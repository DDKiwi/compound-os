import type { InvestmentAnalysisSession, InvestmentAnalysisSummary } from '../types'

export function buildInvestmentAnalysisSummary(
  session: InvestmentAnalysisSession,
): InvestmentAnalysisSummary {
  const { report } = session
  const expectedAnnualDividend = report.dividendForecast?.totalAmount

  return {
    sessionId: session.id,
    generatedAt: report.generatedAt,
    totalValue: report.snapshot.totalValue,
    cash: report.snapshot.cashValue,
    investedValue: report.snapshot.totalValue - report.snapshot.cashValue,
    cashReserveRatio: report.metrics.cashWeight,
    expectedAnnualDividend,
    expectedMonthlyDividend:
      expectedAnnualDividend === undefined ? undefined : expectedAnnualDividend / 12,
    dividendYield:
      expectedAnnualDividend === undefined || report.snapshot.totalValue === 0
        ? undefined
        : expectedAnnualDividend / report.snapshot.totalValue,
    ruleScore: report.summary.score,
    passedRules: report.summary.passed,
    failedRules: report.summary.failed,
    warningRules: report.summary.warnings,
    recommendationCount: report.recommendations.length,
    topRecommendation: report.recommendations[0],
    insightCount: report.insights.length,
  }
}
