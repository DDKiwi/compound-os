export type AccountType = 'ISK' | 'KF' | 'Tjanstepension' | 'IPS' | 'Cash'

export type AssetType = 'Fund' | 'Stock' | 'REIT' | 'PreferredShare' | 'Cash'

export type HoldingClassification =
  | 'GlobalIndex'
  | 'SuperCompounder'
  | 'DefensiveCompounder'
  | 'ConsumerCompounder'
  | 'IncomeCompounder'
  | 'YieldInstrument'
  | 'SpeculativeGrowth'

export type PortfolioRole = 'Core' | 'Growth' | 'Income' | 'Stability' | 'CashReserve' | 'Watchlist'

export type CountryExposure = 'Global' | 'Sweden' | 'USA' | 'Canada' | 'Other'

export type Currency = 'SEK' | 'USD' | 'CAD' | 'EUR' | 'GBP'

export type MoatScore = 0 | 1 | 2 | 3 | 4 | 5

export type DividendFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual' | 'none'

export type Holding = {
  id: string
  name: string
  ticker: string
  sector?: string
  accountType: AccountType
  marketValue: number
  monthlyContribution: number
  assetType: AssetType
  classification: HoldingClassification
  portfolioRole: PortfolioRole
  moatScore: MoatScore
  countryExposure: CountryExposure
  currency: Currency
  expectedDividendYield: number
  expectedDividendGrowth: number
  dividendMonths?: number[]
  dividendFrequency?: DividendFrequency
  isWatchlist: boolean
  isSpeculative: boolean
  notes: string
}
