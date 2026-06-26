export function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-card p-4">
      <span className="text-sm text-zinc-300">{label}</span>
      <span className="text-sm text-zinc-500">{value}</span>
    </div>
  )
}
