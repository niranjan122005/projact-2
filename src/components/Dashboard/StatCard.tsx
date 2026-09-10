export function StatCard({
  label,
  value,
  accent = 'ink',
}: {
  label: string
  value: number
  accent?: 'ink' | 'teal' | 'amber' | 'rust' | 'indigo'
}) {
  const accentClass: Record<string, string> = {
    ink: 'text-ink-900',
    teal: 'text-signal-teal',
    amber: 'text-signal-amber',
    rust: 'text-signal-rust',
    indigo: 'text-signal-indigo',
  }
  return (
    <div className="rounded-lg border border-ink-100 bg-white p-4">
      <p className="text-xs font-medium text-ink-400 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${accentClass[accent]}`}>{value}</p>
    </div>
  )
}
