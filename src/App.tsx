import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Bell,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  Gauge,
  Globe2,
  LayoutDashboard,
  LineChart,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Target,
  WalletCards,
  X,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { create } from 'zustand'
import './App.css'

type PageId =
  | 'dashboard'
  | 'portfolio'
  | 'watchlist'
  | 'dividends'
  | 'journal'
  | 'settings'

type Holding = {
  name: string
  ticker: string
  account: 'ISK' | 'KF' | 'Fond'
  region: 'Global' | 'Sverige' | 'USA' | 'Kanada' | 'Norden'
  category: 'Global index' | 'Investmentbolag' | 'Bank' | 'Fastigheter' | 'Compounder' | 'Dividend' | 'High risk'
  value: number
  returnPct: number
  dividendYield: number
  monthlyDividend: number
  risk: 'Bas' | 'Kvalitet' | 'Utdelning' | 'Hög risk'
}

type WatchItem = {
  name: string
  ticker: string
  note: string
  priority: 'Hög' | 'Medel' | 'Låg'
  target: string
}

type JournalEntry = {
  date: string
  title: string
  tag: string
  body: string
}

type AppState = {
  mobileOpen: boolean
  focusMode: boolean
  setMobileOpen: (open: boolean) => void
  toggleFocusMode: () => void
}

const useAppStore = create<AppState>((set) => ({
  mobileOpen: false,
  focusMode: false,
  setMobileOpen: (mobileOpen) => set({ mobileOpen }),
  toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
}))

const holdings: Holding[] = [
  {
    name: 'LF Global',
    ticker: 'LFGL',
    account: 'Fond',
    region: 'Global',
    category: 'Global index',
    value: 520000,
    returnPct: 11.8,
    dividendYield: 0,
    monthlyDividend: 0,
    risk: 'Bas',
  },
  {
    name: 'Investor',
    ticker: 'INVE B',
    account: 'ISK',
    region: 'Sverige',
    category: 'Investmentbolag',
    value: 185000,
    returnPct: 9.4,
    dividendYield: 1.6,
    monthlyDividend: 247,
    risk: 'Kvalitet',
  },
  {
    name: 'Handelsbanken',
    ticker: 'SHB A',
    account: 'ISK',
    region: 'Sverige',
    category: 'Bank',
    value: 112000,
    returnPct: 4.9,
    dividendYield: 6.2,
    monthlyDividend: 579,
    risk: 'Utdelning',
  },
  {
    name: 'Sagax D',
    ticker: 'SAGA D',
    account: 'ISK',
    region: 'Sverige',
    category: 'Fastigheter',
    value: 68000,
    returnPct: 2.1,
    dividendYield: 7.1,
    monthlyDividend: 402,
    risk: 'Utdelning',
  },
  {
    name: 'T1 Energy',
    ticker: 'TE',
    account: 'ISK',
    region: 'Norden',
    category: 'High risk',
    value: 62500,
    returnPct: -6.8,
    dividendYield: 0,
    monthlyDividend: 0,
    risk: 'Hög risk',
  },
  {
    name: 'Realty Income',
    ticker: 'O',
    account: 'KF',
    region: 'USA',
    category: 'Dividend',
    value: 98000,
    returnPct: 3.2,
    dividendYield: 5.8,
    monthlyDividend: 474,
    risk: 'Utdelning',
  },
  {
    name: 'Enbridge',
    ticker: 'ENB',
    account: 'KF',
    region: 'Kanada',
    category: 'Dividend',
    value: 87000,
    returnPct: 5.5,
    dividendYield: 6.4,
    monthlyDividend: 464,
    risk: 'Utdelning',
  },
  {
    name: 'Johnson & Johnson',
    ticker: 'JNJ',
    account: 'KF',
    region: 'USA',
    category: 'Compounder',
    value: 76000,
    returnPct: 1.9,
    dividendYield: 3.1,
    monthlyDividend: 196,
    risk: 'Kvalitet',
  },
  {
    name: 'Procter & Gamble',
    ticker: 'PG',
    account: 'KF',
    region: 'USA',
    category: 'Compounder',
    value: 73500,
    returnPct: 4.1,
    dividendYield: 2.5,
    monthlyDividend: 153,
    risk: 'Kvalitet',
  },
  {
    name: 'Keurig Dr Pepper',
    ticker: 'KDP',
    account: 'KF',
    region: 'USA',
    category: 'Compounder',
    value: 45500,
    returnPct: -1.3,
    dividendYield: 2.9,
    monthlyDividend: 110,
    risk: 'Kvalitet',
  },
  {
    name: 'Canadian National Railway',
    ticker: 'CNR',
    account: 'KF',
    region: 'Kanada',
    category: 'Compounder',
    value: 69000,
    returnPct: 6.8,
    dividendYield: 2.2,
    monthlyDividend: 127,
    risk: 'Kvalitet',
  },
  {
    name: 'Waste Management',
    ticker: 'WM',
    account: 'KF',
    region: 'USA',
    category: 'Compounder',
    value: 78500,
    returnPct: 8.6,
    dividendYield: 1.5,
    monthlyDividend: 98,
    risk: 'Kvalitet',
  },
  {
    name: 'Fastenal',
    ticker: 'FAST',
    account: 'KF',
    region: 'USA',
    category: 'Compounder',
    value: 56500,
    returnPct: 7.4,
    dividendYield: 2.1,
    monthlyDividend: 99,
    risk: 'Kvalitet',
  },
]

const watchlist: WatchItem[] = [
  {
    name: 'Microsoft',
    ticker: 'MSFT',
    note: 'Kvalitetscompounder, bevaka värdering.',
    priority: 'Hög',
    target: 'Under 30x FCF',
  },
  {
    name: 'LVMH',
    ticker: 'MC',
    note: 'Globalt varumärkesbolag för KF-listan.',
    priority: 'Medel',
    target: 'Svag lyxcykel',
  },
  {
    name: 'Novo Nordisk',
    ticker: 'NOVO B',
    note: 'Nordisk kvalitet men koncentrationsrisk.',
    priority: 'Låg',
    target: 'Större nedgång',
  },
]

const journalEntries: JournalEntry[] = [
  {
    date: '2026-06-25',
    title: 'Portföljregel uppdaterad',
    tag: 'Policy',
    body: 'Global index förblir basen. Nya KF-köp måste stärka utdelning eller långsiktig compounder-kvalitet.',
  },
  {
    date: '2026-06-18',
    title: 'T1 Energy storlek kontrollerad',
    tag: 'Risk',
    body: 'High-risk-case hålls inom spannet 50 000-75 000 kr och under 2 % av investerat kapital.',
  },
  {
    date: '2026-06-03',
    title: 'Utdelningsmål',
    tag: 'Mål',
    body: 'Fokus är 10 000 kr per månad, inte att maximera direktavkastning på bekostnad av kvalitet.',
  },
]

const dividendProjection = [
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

const navItems: Array<{ id: PageId; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', label: 'Översikt', icon: LayoutDashboard },
  { id: 'portfolio', label: 'Portfölj', icon: BriefcaseBusiness },
  { id: 'watchlist', label: 'Bevakning', icon: Star },
  { id: 'dividends', label: 'Utdelningsmål', icon: Target },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'settings', label: 'Inställningar', icon: Settings },
]

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    maximumFractionDigits: 0,
  }).format(value)

const formatPercent = (value: number) =>
  new Intl.NumberFormat('sv-SE', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 1,
  }).format(value)

const routeFromHash = (): PageId => {
  const route = window.location.hash.replace('#/', '')
  return navItems.some((item) => item.id === route) ? (route as PageId) : 'dashboard'
}

const getMockData = async () => ({
  holdings,
  watchlist,
  journalEntries,
  dividendProjection,
})

function useMockData() {
  return useQuery({
    queryKey: ['compound-os-mock-data'],
    queryFn: getMockData,
    staleTime: Number.POSITIVE_INFINITY,
  })
}

function useHashRoute() {
  const [page, setPage] = useStateFromHash()
  const navigate = (nextPage: PageId) => {
    window.location.hash = `/${nextPage}`
    setPage(nextPage)
    useAppStore.getState().setMobileOpen(false)
  }

  return { page, navigate }
}

function useStateFromHash() {
  const [page, setPage] = useState<PageId>(routeFromHash)

  useEffect(() => {
    const syncRoute = () => setPage(routeFromHash())
    window.addEventListener('hashchange', syncRoute)
    return () => window.removeEventListener('hashchange', syncRoute)
  }, [])

  return [page, setPage] as const
}

function App() {
  const { page, navigate } = useHashRoute()
  const query = useMockData()
  const mobileOpen = useAppStore((state) => state.mobileOpen)
  const setMobileOpen = useAppStore((state) => state.setMobileOpen)

  if (!query.data) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-100">
        <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
          Laddar Compound OS...
        </div>
      </div>
    )
  }

  const data = query.data
  const activeItem = navItems.find((item) => item.id === page) ?? navItems[0]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(39,39,42,0.7),transparent_34%),linear-gradient(180deg,#09090b,#0c0c0f)]" />
      <div className="flex min-h-screen">
        <Sidebar page={page} navigate={navigate} open={mobileOpen} />
        <div className="min-w-0 flex-1 lg:pl-72">
          <Topbar title={activeItem.label} onMenu={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            {page === 'dashboard' && <Dashboard data={data} navigate={navigate} />}
            {page === 'portfolio' && <PortfolioPage holdings={data.holdings} />}
            {page === 'watchlist' && <WatchlistPage items={data.watchlist} />}
            {page === 'dividends' && (
              <DividendGoalPage holdings={data.holdings} projection={data.dividendProjection} />
            )}
            {page === 'journal' && <JournalPage entries={data.journalEntries} />}
            {page === 'settings' && <SettingsPage />}
          </main>
        </div>
      </div>
    </div>
  )
}

function Sidebar({
  page,
  navigate,
  open,
}: {
  page: PageId
  navigate: (page: PageId) => void
  open: boolean
}) {
  const setMobileOpen = useAppStore((state) => state.setMobileOpen)

  return (
    <>
      <button
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        type="button"
        aria-label="Stäng meny"
        onClick={() => setMobileOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0d0d10]/95 px-3 py-4 shadow-2xl shadow-black/40 backdrop-blur transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white text-zinc-950">
              <CircleDollarSign size={19} />
            </div>
            <div>
              <p className="text-sm font-semibold">Compound OS</p>
              <p className="text-xs text-zinc-500">Kapital, kassaflöde, disciplin</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-zinc-500 hover:bg-white/5 hover:text-zinc-100 lg:hidden"
            aria-label="Stäng meny"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.id === page
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  active
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                }`}
              >
                <Icon size={17} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={15} />}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <ShieldCheck size={16} />
            Filosofi
          </div>
          <ul className="space-y-2 text-xs leading-5 text-zinc-400">
            <li>Global index är basen.</li>
            <li>KF används för internationella utdelare och compounders.</li>
            <li>Max ett high-risk-case: 50 000-75 000 kr eller max 2 %.</li>
          </ul>
        </div>
      </aside>
    </>
  )
}

function Topbar({ title, onMenu }: { title: string; onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[#09090b]/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenu}
          className="rounded-md p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-100 lg:hidden"
          aria-label="Öppna meny"
        >
          <Menu size={19} />
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">MVP</p>
          <h1 className="text-base font-semibold sm:text-lg">{title}</h1>
        </div>
        <div className="ml-auto hidden min-w-72 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-zinc-500 md:flex">
          <Search size={16} />
          Sök innehav, regler, anteckningar
        </div>
        <button
          type="button"
          className="ml-auto rounded-md border border-white/10 p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-100 md:ml-0"
          aria-label="Aviseringar"
        >
          <Bell size={18} />
        </button>
      </div>
    </header>
  )
}

function Dashboard({
  data,
  navigate,
}: {
  data: Awaited<ReturnType<typeof getMockData>>
  navigate: (page: PageId) => void
}) {
  const stats = usePortfolioStats(data.holdings)
  const allocation = useAllocation(data.holdings, 'category')

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={WalletCards} label="Portföljvärde" value={formatCurrency(stats.total)} helper="+6,4 % YTD" />
        <MetricCard icon={Target} label="Utdelning/mån" value={formatCurrency(stats.monthlyDividend)} helper={`${stats.dividendProgress}% av målet`} />
        <MetricCard icon={Globe2} label="Global index-bas" value={`${stats.indexWeight}%`} helper="Mål: basen ska dominera" />
        <MetricCard icon={Gauge} label="High risk" value={`${stats.highRiskWeight}%`} helper={stats.highRiskOk ? 'Inom regel' : 'Över regel'} tone={stats.highRiskOk ? 'good' : 'bad'} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <Card title="Utdelningsresa" action="10 000 kr/mån">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dividendProjection} margin={{ left: -24, right: 8, top: 16, bottom: 0 }}>
                <defs>
                  <linearGradient id="dividendGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#fafafa" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#fafafa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="amount" stroke="#fafafa" fill="url(#dividendGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Allokering" action="Mock">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocation} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={2}>
                  {allocation.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {allocation.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="h-2 w-2 rounded-full" style={{ background: chartColors[index] }} />
                <span className="truncate">{item.name}</span>
                <span className="ml-auto">{Math.round((item.value / stats.total) * 100)}%</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Nästa beslut" action="Policy">
          <div className="grid gap-3">
            {[
              ['Bas först', 'Nytt kapital går först mot global index om basvikten faller.'],
              ['KF-filter', 'Internationella aktier ska vara utdelare eller compounders.'],
              ['Risktak', 'T1 Energy är enda high-risk-case och får inte byggas ut över regeln.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{text}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Snabbåtkomst" action="Navigera">
          <div className="grid gap-2">
            {navItems.slice(1, 5).map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/[0.06]"
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto text-zinc-600" size={16} />
                </button>
              )
            })}
          </div>
        </Card>
      </section>
    </div>
  )
}

function PortfolioPage({ holdings }: { holdings: Holding[] }) {
  const stats = usePortfolioStats(holdings)
  const regions = useAllocation(holdings, 'region')

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={BriefcaseBusiness} label="Innehav" value={String(holdings.length)} helper="Seedad MVP-portfölj" />
        <MetricCard icon={Globe2} label="KF-andel" value={`${stats.kfWeight}%`} helper="Internationella aktier" />
        <MetricCard icon={LineChart} label="Snittavkastning" value={`${stats.averageReturn}%`} helper="Mockad utveckling" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.42fr]">
        <Card title="Innehav" action="Mockdata">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.14em] text-zinc-500">
                <tr>
                  <th className="py-3 pr-4 font-medium">Namn</th>
                  <th className="py-3 pr-4 font-medium">Konto</th>
                  <th className="py-3 pr-4 font-medium">Kategori</th>
                  <th className="py-3 pr-4 text-right font-medium">Värde</th>
                  <th className="py-3 pr-4 text-right font-medium">Direktavk.</th>
                  <th className="py-3 text-right font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {holdings.map((holding) => (
                  <tr key={holding.ticker} className="text-zinc-300">
                    <td className="py-4 pr-4">
                      <div className="font-medium text-zinc-100">{holding.name}</div>
                      <div className="text-xs text-zinc-500">{holding.ticker}</div>
                    </td>
                    <td className="py-4 pr-4">{holding.account}</td>
                    <td className="py-4 pr-4">{holding.category}</td>
                    <td className="py-4 pr-4 text-right">{formatCurrency(holding.value)}</td>
                    <td className="py-4 pr-4 text-right">{formatPercent(holding.dividendYield)}%</td>
                    <td className="py-4 text-right">
                      <Badge tone={holding.risk === 'Hög risk' ? 'bad' : holding.risk === 'Bas' ? 'neutral' : 'good'}>
                        {holding.risk}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card title="Regioner" action="Vikt">
          <div className="space-y-4">
            {regions.map((region) => (
              <ProgressRow key={region.name} label={region.name} value={region.value} total={stats.total} />
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

function WatchlistPage({ items }: { items: WatchItem[] }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-6 text-zinc-400">
          Bevakningslistan är avsedd för framtida köp, inte impulsaffärer. Varje rad kräver en tydlig trigger.
        </p>
        <button type="button" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-zinc-950">
          <Plus size={16} />
          Ny kandidat
        </button>
      </div>
      <section className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <Card key={item.ticker} title={item.name} action={item.ticker}>
            <div className="space-y-4">
              <Badge tone={item.priority === 'Hög' ? 'good' : 'neutral'}>{item.priority} prioritet</Badge>
              <p className="text-sm leading-6 text-zinc-400">{item.note}</p>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">Köptrigger</p>
                <p className="mt-1 text-sm text-zinc-200">{item.target}</p>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}

function DividendGoalPage({
  holdings,
  projection,
}: {
  holdings: Holding[]
  projection: typeof dividendProjection
}) {
  const stats = usePortfolioStats(holdings)
  const remaining = 10000 - stats.monthlyDividend
  const dividendHoldings = holdings.filter((holding) => holding.monthlyDividend > 0)

  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={Target} label="Mål" value="10 000 kr/mån" helper="Utdelningskassaflöde" />
        <MetricCard icon={CircleDollarSign} label="Nuvarande" value={formatCurrency(stats.monthlyDividend)} helper={`${stats.dividendProgress}% klart`} />
        <MetricCard icon={WalletCards} label="Kvar" value={formatCurrency(remaining)} helper="Innan målet är nått" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Prognos" action="Månadsvis">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projection} margin={{ left: -24, right: 8, top: 16, bottom: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} fill="#fafafa" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Största bidrag" action="Per månad">
          <div className="space-y-3">
            {dividendHoldings
              .sort((a, b) => b.monthlyDividend - a.monthlyDividend)
              .slice(0, 7)
              .map((holding) => (
                <ProgressRow
                  key={holding.ticker}
                  label={holding.name}
                  value={holding.monthlyDividend}
                  total={stats.monthlyDividend}
                  suffix={formatCurrency(holding.monthlyDividend)}
                />
              ))}
          </div>
        </Card>
      </section>
    </div>
  )
}

function JournalPage({ entries }: { entries: JournalEntry[] }) {
  return (
    <div className="space-y-5">
      <Card title="Investeringsjournal" action={`${entries.length} anteckningar`}>
        <div className="space-y-4">
          {entries.map((entry) => (
            <article key={entry.date} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="neutral">{entry.tag}</Badge>
                <time className="text-xs text-zinc-500">{entry.date}</time>
              </div>
              <h2 className="mt-3 text-base font-semibold">{entry.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{entry.body}</p>
            </article>
          ))}
        </div>
      </Card>
    </div>
  )
}

function SettingsPage() {
  const focusMode = useAppStore((state) => state.focusMode)
  const toggleFocusMode = useAppStore((state) => state.toggleFocusMode)

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card title="MVP-inställningar" action="Lokalt">
        <div className="space-y-4">
          <SettingRow label="Mörkt tema" value="Aktivt" />
          <SettingRow label="Datakälla" value="Mockdata" />
          <SettingRow label="Supabase" value="Ej anslutet" />
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <span>
              <span className="block text-sm font-medium">Fokusläge</span>
              <span className="text-sm text-zinc-500">Dölj brus när vyerna växer.</span>
            </span>
            <input type="checkbox" checked={focusMode} onChange={toggleFocusMode} className="h-5 w-5 accent-white" />
          </label>
        </div>
      </Card>

      <Card title="Nästa integrationer" action="Roadmap">
        <div className="grid gap-3">
          {[
            ['Supabase schema', 'holdings, transactions, dividends, watchlist, journal_entries'],
            ['Importflöde', 'CSV eller manuell transaktion per konto.'],
            ['Regelmotor', 'Automatiska varningar för high-risk, KF och målallokering.'],
          ].map(([title, text]) => (
            <div key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  tone = 'neutral',
}: {
  icon: typeof LayoutDashboard
  label: string
  value: string
  helper: string
  tone?: 'neutral' | 'good' | 'bad'
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-sm shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-zinc-500">{label}</span>
        <span className={`rounded-md border p-1.5 ${toneClass(tone)}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="text-2xl font-semibold tracking-normal text-zinc-50">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </div>
  )
}

function Card({
  title,
  action,
  children,
}: {
  title: string
  action?: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-4 shadow-sm shadow-black/20 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
        {action && <span className="text-xs text-zinc-500">{action}</span>}
      </div>
      {children}
    </section>
  )
}

function Badge({ children, tone }: { children: React.ReactNode; tone: 'neutral' | 'good' | 'bad' }) {
  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${toneClass(tone)}`}>
      {children}
    </span>
  )
}

function ProgressRow({
  label,
  value,
  total,
  suffix,
}: {
  label: string
  value: number
  total: number
  suffix?: string
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div>
      <div className="mb-2 flex items-center gap-3 text-sm">
        <span className="truncate text-zinc-300">{label}</span>
        <span className="ml-auto text-zinc-500">{suffix ?? `${percentage}%`}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] p-4">
      <span className="text-sm text-zinc-300">{label}</span>
      <span className="text-sm text-zinc-500">{value}</span>
    </div>
  )
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string }>; label?: string }) {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border border-white/10 bg-zinc-950/95 px-3 py-2 text-sm shadow-xl">
      <p className="font-medium text-zinc-100">{label ?? payload[0].name}</p>
      <p className="text-zinc-400">{formatCurrency(Number(payload[0].value))}</p>
    </div>
  )
}

function usePortfolioStats(portfolio: Holding[]) {
  return useMemo(() => {
    const total = portfolio.reduce((sum, holding) => sum + holding.value, 0)
    const monthlyDividend = portfolio.reduce((sum, holding) => sum + holding.monthlyDividend, 0)
    const highRiskValue = portfolio
      .filter((holding) => holding.category === 'High risk')
      .reduce((sum, holding) => sum + holding.value, 0)
    const highRiskCount = portfolio.filter((holding) => holding.category === 'High risk').length
    const indexValue = portfolio
      .filter((holding) => holding.category === 'Global index')
      .reduce((sum, holding) => sum + holding.value, 0)
    const kfValue = portfolio
      .filter((holding) => holding.account === 'KF')
      .reduce((sum, holding) => sum + holding.value, 0)
    const averageReturn = portfolio.reduce((sum, holding) => sum + holding.returnPct, 0) / portfolio.length
    const highRiskWeight = total > 0 ? (highRiskValue / total) * 100 : 0

    return {
      total,
      monthlyDividend,
      dividendProgress: Math.round((monthlyDividend / 10000) * 100),
      highRiskWeight: formatPercent(highRiskWeight),
      highRiskOk: highRiskCount <= 1 && (highRiskValue <= 75000 || highRiskWeight <= 2),
      indexWeight: Math.round((indexValue / total) * 100),
      kfWeight: Math.round((kfValue / total) * 100),
      averageReturn: formatPercent(averageReturn),
    }
  }, [portfolio])
}

function useAllocation(portfolio: Holding[], key: 'category' | 'region') {
  return useMemo(() => {
    const allocation = portfolio.reduce<Record<string, number>>((acc, holding) => {
      acc[holding[key]] = (acc[holding[key]] ?? 0) + holding.value
      return acc
    }, {})

    return Object.entries(allocation)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [key, portfolio])
}

function toneClass(tone: 'neutral' | 'good' | 'bad') {
  if (tone === 'good') {
    return 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300'
  }

  if (tone === 'bad') {
    return 'border-rose-400/20 bg-rose-400/10 text-rose-300'
  }

  return 'border-white/10 bg-white/[0.04] text-zinc-300'
}

const chartColors = ['#fafafa', '#a1a1aa', '#71717a', '#52525b', '#3f3f46', '#d4d4d8']

export default App
