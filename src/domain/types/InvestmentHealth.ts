export type InvestmentHealthStatus = 'excellent' | 'good' | 'fair' | 'poor'

export type InvestmentHealth = {
  readonly score: number
  readonly label: string
  readonly status: InvestmentHealthStatus
}
