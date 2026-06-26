import { SectionCard as Card } from '../components/ui/Card'
import { SettingRow } from '../components/ui/SettingRow'
import { useAppStore } from '../stores/appStore'

export function SettingsPage() {
  const focusMode = useAppStore((state) => state.focusMode)
  const toggleFocusMode = useAppStore((state) => state.toggleFocusMode)

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Card title="MVP-inställningar" action="Lokalt">
        <div className="space-y-4">
          <SettingRow label="Mörkt tema" value="Aktivt" />
          <SettingRow label="Datakälla" value="Mockdata" />
          <SettingRow label="Supabase" value="Ej anslutet" />
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-card p-4">
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
            <div key={title} className="rounded-lg border border-white/10 bg-card p-4">
              <p className="text-sm font-medium">{title}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
