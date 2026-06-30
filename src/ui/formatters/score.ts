export function formatScore(value: number): string {
  return `${Math.round(value)}/100`
}

export function formatRuleStatus(passed: number, warnings: number, failed: number): string {
  return `${passed} godkända, ${warnings} varningar, ${failed} stopp`
}
