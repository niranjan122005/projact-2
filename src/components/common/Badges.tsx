import type { TicketPriority, TicketStatus } from '../../types/ticket'
import type { Role, UserStatus } from '../../types/user'
import type { CategoryStatus } from '../../types/category'

const statusStyles: Record<TicketStatus, string> = {
  Open: 'bg-ink-100 text-ink-700 border-ink-200',
  Assigned: 'bg-signal-indigo/10 text-signal-indigo border-signal-indigo/30',
  'In Progress': 'bg-signal-amber/10 text-signal-amber border-signal-amber/30',
  Pending: 'bg-ink-200/60 text-ink-700 border-ink-300',
  Resolved: 'bg-signal-teal/10 text-signal-teal border-signal-teal/30',
  Closed: 'bg-ink-800 text-white border-ink-800',
  Cancelled: 'bg-signal-rust/10 text-signal-rust border-signal-rust/30',
}

export function StatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  )
}

const priorityStyles: Record<TicketPriority, string> = {
  Low: 'bg-ink-100 text-ink-600 border-ink-200',
  Medium: 'bg-signal-indigo/10 text-signal-indigo border-signal-indigo/30',
  High: 'bg-signal-amber/10 text-signal-amber border-signal-amber/30',
  Critical: 'bg-signal-rust/10 text-signal-rust border-signal-rust/40',
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${priorityStyles[priority]}`}>
      {priority === 'Critical' && <span className="h-1.5 w-1.5 rounded-full bg-signal-rust" />}
      {priority}
    </span>
  )
}

const roleStyles: Record<Role, string> = {
  Admin: 'bg-ink-900 text-white',
  'Support Agent': 'bg-signal-indigo/15 text-signal-indigo',
  Employee: 'bg-ink-100 text-ink-700',
}

export function RoleBadge({ role }: { role: Role }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleStyles[role]}`}>{role}</span>
}

export function UserStatusBadge({ status }: { status: UserStatus | CategoryStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
        status === 'Active' ? 'bg-signal-teal/10 text-signal-teal' : 'bg-ink-100 text-ink-500'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status === 'Active' ? 'bg-signal-teal' : 'bg-ink-400'}`} />
      {status}
    </span>
  )
}
