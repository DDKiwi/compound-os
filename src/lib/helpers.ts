import type { AccountType, CountryExposure, HoldingClassification, PortfolioRole } from '../domain'

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(value)

export const formatPercent = (value: number) =>
  new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)

export const chartColors = [
  'var(--accent)',
  'var(--warning)',
  'var(--border)',
  'var(--text-secondary)',
  'var(--border-muted)',
  'var(--foreground)',
]

export function toneClass(tone: 'neutral' | 'good' | 'bad') {
  if (tone === 'good') {
    return 'border-success/25 bg-success/10 text-success'
  }

  if (tone === 'bad') {
    return 'border-destructive/25 bg-destructive/10 text-destructive'
  }

  return 'border-border-muted bg-muted text-foreground'
}

export function classificationLabel(classification: HoldingClassification) {
  const labels: Record<HoldingClassification, string> = {
    GlobalIndex: 'Global index',
    SuperCompounder: 'Supercompounder',
    DefensiveCompounder: 'Defensiv compounder',
    ConsumerCompounder: 'Konsumentcompounder',
    IncomeCompounder: 'Utdelningscompounder',
    YieldInstrument: 'Yield-instrument',
    SpeculativeGrowth: 'Spekulativ tillväxt',
  }

  return labels[classification]
}

export function portfolioRoleLabel(role: PortfolioRole) {
  const labels: Record<PortfolioRole, string> = {
    Core: 'Kärna',
    Growth: 'Tillväxt',
    Income: 'Utdelning',
    Stability: 'Stabilitet',
    CashReserve: 'Kassa',
    Watchlist: 'Bevakning',
  }

  return labels[role]
}

export function countryExposureLabel(countryExposure: CountryExposure) {
  const labels: Record<CountryExposure, string> = {
    Global: 'Global',
    Sweden: 'Sverige',
    USA: 'USA',
    Canada: 'Kanada',
    Other: 'Övrigt',
  }

  return labels[countryExposure]
}

export function accountTypeLabel(accountType: AccountType) {
  const labels: Record<AccountType, string> = {
    ISK: 'ISK',
    KF: 'KF',
    Tjanstepension: 'Tjänstepension',
    IPS: 'IPS',
    Cash: 'Kassa',
  }

  return labels[accountType]
}
