import type { Holding } from './Holding'
import type { JournalEntry } from './JournalEntry'

export type WatchPriority = 'Hög' | 'Medel' | 'Låg'

export type WatchItem = {
  name: string
  ticker: string
  note: string
  priority: WatchPriority
  target: string
}

export type DividendPoint = {
  month: string
  amount: number
}

export type AllocationKey =
  | 'accountType'
  | 'assetType'
  | 'classification'
  | 'portfolioRole'
  | 'countryExposure'

export type AllocationItem = {
  name: string
  value: number
  weight: number
}

export type PortfolioStats = {
  totalValue: number
  monthlyDividend: number
  annualDividend: number
  dividendProgressPct: number
  globalIndexWeightPct: number
  kfWeightPct: number
  averageMoatScore: number
  averageDividendGrowthPct: number
}

export type Portfolio = {
  holdings: Holding[]
  watchlist: WatchItem[]
  journalEntries: JournalEntry[]
  dividendProjection: DividendPoint[]
}
