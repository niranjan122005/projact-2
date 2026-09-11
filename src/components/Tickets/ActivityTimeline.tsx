import type { ActivityEntry } from '../../types/ticket'
import { formatDateTime } from '../../utils/date'

export function ActivityTimeline({ activity }: { activity: ActivityEntry[] }) {
  const sorted = [...activity].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  if (sorted.length === 0) {
    return <p className="text-sm text-ink-400">No activity recorded yet.</p>
  }

  return (
    <ol className="relative border-l border-ink-200 dark:border-ink-700 ml-2 space-y-5">
      {sorted.map((entry) => (
        <li key={entry.id} className="ml-4">
          <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-ink-400 dark:bg-ink-500 ring-4 ring-white" />
          <p className="text-sm text-ink-800 dark:text-ink-100">{entry.action}</p>
          <p className="text-xs text-ink-400 mt-0.5">
            {entry.actorName} · {formatDateTime(entry.timestamp)}
          </p>
        </li>
      ))}
    </ol>
  )
}
