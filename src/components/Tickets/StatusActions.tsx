import type { TicketStatus } from '../../types/ticket'

const labelFor: Record<TicketStatus, string> = {
  Open: 'Reopen',
  Assigned: 'Mark Assigned',
  'In Progress': 'Start Progress',
  Pending: 'Mark Pending',
  Resolved: 'Resolve',
  Closed: 'Close',
  Cancelled: 'Cancel',
}

const styleFor: Record<TicketStatus, string> = {
  Open: 'border-ink-200 text-ink-700 hover:bg-ink-50',
  Assigned: 'border-signal-indigo/30 text-signal-indigo hover:bg-signal-indigo/10',
  'In Progress': 'border-signal-amber/30 text-signal-amber hover:bg-signal-amber/10',
  Pending: 'border-ink-300 text-ink-700 hover:bg-ink-50',
  Resolved: 'border-signal-teal/30 text-signal-teal hover:bg-signal-teal/10',
  Closed: 'border-ink-800 text-ink-800 hover:bg-ink-100',
  Cancelled: 'border-signal-rust/30 text-signal-rust hover:bg-signal-rust/10',
}

export function StatusActions({
  options,
  onSelect,
}: {
  options: TicketStatus[]
  onSelect: (status: TicketStatus) => void
}) {
  if (options.length === 0) return null
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((status) => (
        <button
          key={status}
          onClick={() => onSelect(status)}
          className={`rounded-md border px-3 py-1.5 text-sm font-medium focus-ring ${styleFor[status]}`}
        >
          {status === 'Open' ? 'Reopen Ticket' : labelFor[status]}
        </button>
      ))}
    </div>
  )
}
