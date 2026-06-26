import { mockPortfolioHoldings } from '../domain/mock/mockPortfolio'
import type { DividendPoint, JournalEntry, MockData, WatchItem } from '../types/investment'

export const holdings = mockPortfolioHoldings

export const watchlist: WatchItem[] = [
  { name: 'Microsoft', ticker: 'MSFT', note: 'Kvalitetscompounder, bevaka värdering.', priority: 'Hög', target: 'Under 30x FCF' },
  { name: 'LVMH', ticker: 'MC', note: 'Globalt varumärkesbolag för KF-listan.', priority: 'Medel', target: 'Svag lyxcykel' },
  { name: 'Novo Nordisk', ticker: 'NOVO B', note: 'Nordisk kvalitet men koncentrationsrisk.', priority: 'Låg', target: 'Större nedgång' },
]

export const journalEntries: JournalEntry[] = [
  { id: 'journal-2026-06-25', date: '2026-06-25', ticker: 'PORTFÖLJ', amount: 0, reason: 'Global index förblir basen. Nya KF-köp måste stärka utdelning eller långsiktig compounder-kvalitet.', risk: 'Policyavvikelse', exitRule: 'Om basvikten blir för låg prioriteras indexköp.' },
  { id: 'journal-2026-06-18', date: '2026-06-18', ticker: 'TE', amount: 62500, reason: 'T1 Energy storlek kontrollerad mot high-risk-regeln.', risk: 'Spekulativ tillväxt och hög volatilitet.', exitRule: 'Ingen ökning över 75 000 kr eller om ytterligare spekulativt case läggs till.' },
  { id: 'journal-2026-06-03', date: '2026-06-03', ticker: 'UTDELNING', amount: 10000, reason: 'Fokus är 10 000 kr per månad utan att maximera direktavkastning på bekostnad av kvalitet.', risk: 'Yield trap och svag utdelningstillväxt.', exitRule: 'Sänk vikt i innehav där utdelningen saknar täckning.' },
]

export const dividendProjection: DividendPoint[] = [
  { month: 'Jan', amount: 2300 },
  { month: 'Feb', amount: 2550 },
  { month: 'Mar', amount: 3100 },
  { month: 'Apr', amount: 3450 },
  { month: 'Maj', amount: 3900 },
  { month: 'Jun', amount: 4250 },
  { month: 'Jul', amount: 4550 },
  { month: 'Aug', amount: 4900 },
  { month: 'Sep', amount: 5400 },
  { month: 'Okt', amount: 5900 },
  { month: 'Nov', amount: 6400 },
  { month: 'Dec', amount: 7000 },
]

export const mockData: MockData = {
  holdings,
  watchlist,
  journalEntries,
  dividendProjection,
}
