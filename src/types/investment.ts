import type { DividendPoint, Holding, JournalEntry, WatchItem } from '../domain'

export type PageId =
  | 'dashboard'
  | 'portfolio'
  | 'watchlist'
  | 'dividends'
  | 'journal'
  | 'settings'

export type { DividendPoint, Holding, JournalEntry, WatchItem }

export type MockData = {
  holdings: Holding[]
  watchlist: WatchItem[]
  journalEntries: JournalEntry[]
  dividendProjection: DividendPoint[]
}
