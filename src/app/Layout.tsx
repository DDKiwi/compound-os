import type { ReactNode } from 'react'
import { Bell, ChevronRight, CircleDollarSign, Menu, Search, ShieldCheck, X } from 'lucide-react'
import { navItems } from './routes'
import { Button } from '../components/ui/Button'
import { useAppStore } from '../stores/appStore'
import type { PageId } from '../types/investment'

export function Layout({
  page,
  navigate,
  children,
}: {
  page: PageId
  navigate: (page: PageId) => void
  children: ReactNode
}) {
  const mobileOpen = useAppStore((state) => state.mobileOpen)
  const setMobileOpen = useAppStore((state) => state.setMobileOpen)
  const activeItem = navItems.find((item) => item.id === page) ?? navItems[0]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_30%),linear-gradient(180deg,#09090b,#09090b)]" />
      <div className="flex min-h-screen">
        <Sidebar page={page} navigate={navigate} open={mobileOpen} />
        <div className="min-w-0 flex-1 lg:pl-72">
          <Topbar title={activeItem.label} onMenu={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">{children}</main>
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
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-background/95 px-3 py-4 shadow-2xl shadow-black/40 backdrop-blur transition-transform lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/25 bg-accent/10 text-accent">
              <CircleDollarSign size={19} />
            </div>
            <div>
              <p className="text-sm font-semibold">Compound OS</p>
              <p className="text-xs text-zinc-500">Kapital, kassaflöde, disciplin</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-zinc-500 lg:hidden"
            aria-label="Stäng meny"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = item.id === page
            return (
              <Button
                key={item.id}
                type="button"
                variant={active ? 'default' : 'ghost'}
                size="nav"
                onClick={() => navigate(item.id)}
                className={
                  active
                    ? 'justify-start bg-primary text-primary-foreground shadow-sm'
                    : 'justify-start text-zinc-400 hover:bg-primary/10 hover:text-zinc-100'
                }
              >
                <Icon size={17} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={15} />}
              </Button>
            )
          })}
        </nav>

        <div className="mt-auto rounded-lg border border-accent/20 bg-accent/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-accent">
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
    <header className="sticky top-0 z-30 border-b border-white/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Button type="button" onClick={onMenu} variant="ghost" size="icon" className="lg:hidden" aria-label="Öppna meny">
          <Menu size={19} />
        </Button>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">MVP</p>
          <h1 className="text-base font-semibold sm:text-lg">{title}</h1>
        </div>
        <div className="ml-auto hidden min-w-72 items-center gap-2 rounded-lg border border-white/10 bg-card px-3 py-2 text-sm text-zinc-500 md:flex">
          <Search size={16} />
          Sök innehav, regler, anteckningar
        </div>
        <Button type="button" variant="outline" size="icon" className="ml-auto md:ml-0" aria-label="Aviseringar">
          <Bell size={18} />
        </Button>
      </div>
    </header>
  )
}
