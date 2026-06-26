import { BookOpen, BriefcaseBusiness, LayoutDashboard, Settings, Star, Target } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { MockData, PageId } from '../types/investment'
import { DashboardPage } from '../pages/DashboardPage'
import { DividendGoalPage } from '../pages/DividendGoalPage'
import { JournalPage } from '../pages/JournalPage'
import { PortfolioPage } from '../pages/PortfolioPage'
import { SettingsPage } from '../pages/SettingsPage'
import { WatchlistPage } from '../pages/WatchlistPage'

export const navItems: Array<{ id: PageId; label: string; icon: LucideIcon }> = [
  { id: 'dashboard', label: 'Översikt', icon: LayoutDashboard },
  { id: 'portfolio', label: 'Portfölj', icon: BriefcaseBusiness },
  { id: 'watchlist', label: 'Bevakning', icon: Star },
  { id: 'dividends', label: 'Utdelningsmål', icon: Target },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'settings', label: 'Inställningar', icon: Settings },
]

export function renderRoute(page: PageId, data: MockData, navigate: (page: PageId) => void) {
  if (page === 'dashboard') {
    return <DashboardPage data={data} navigate={navigate} />
  }

  if (page === 'portfolio') {
    return <PortfolioPage />
  }

  if (page === 'watchlist') {
    return <WatchlistPage items={data.watchlist} />
  }

  if (page === 'dividends') {
    return <DividendGoalPage holdings={data.holdings} projection={data.dividendProjection} />
  }

  if (page === 'journal') {
    return <JournalPage entries={data.journalEntries} />
  }

  return <SettingsPage />
}
