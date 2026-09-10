import { Link } from 'react-router-dom'
import type { Ticket } from '../../types/ticket'
import { StatusBadge, PriorityBadge } from '../common/Badges'
import { formatDate } from '../../utils/date'
import { EmptyState } from '../common/States'

export function TicketTable({ tickets, showRequester = true }: { tickets: Ticket[]; showRequester?: boolean }) {
  if (tickets.length === 0) {
    return <EmptyState title="No tickets found" description="Try adjusting your search or filters." />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-400">
            <th className="px-4 py-3">Ticket</th>
            {showRequester && <th className="px-4 py-3 hidden md:table-cell">Requester</th>}
            <th className="px-4 py-3 hidden lg:table-cell">Agent</th>
            <th className="px-4 py-3 hidden sm:table-cell">Category</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 hidden md:table-cell">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {tickets.map((t) => (
            <tr key={t.id} className="hover:bg-ink-50">
              <td className="px-4 py-3">
                <Link to={`/tickets/${t.id}`} className="block max-w-xs">
                  <span className="font-mono text-xs text-ink-400">{t.ticketNumber}</span>
                  <p className="font-medium text-ink-800 truncate">{t.subject}</p>
                </Link>
              </td>
              {showRequester && <td className="px-4 py-3 hidden md:table-cell text-ink-600">{t.createdByName}</td>}
              <td className="px-4 py-3 hidden lg:table-cell text-ink-600">{t.assignedAgentName || '—'}</td>
              <td className="px-4 py-3 hidden sm:table-cell text-ink-600">{t.category}</td>
              <td className="px-4 py-3">
                <PriorityBadge priority={t.priority} />
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3 hidden md:table-cell text-ink-400">{formatDate(t.updatedDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
