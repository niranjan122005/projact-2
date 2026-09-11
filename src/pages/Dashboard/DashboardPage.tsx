import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTickets } from '../../hooks/useTickets'
import { StatCard } from '../../components/Dashboard/StatCard'
import { Loader, ErrorState, EmptyState } from '../../components/common/States'
import { StatusBadge, PriorityBadge } from '../../components/common/Badges'
import { formatDate } from '../../utils/date'

export function DashboardPage() {
  const { user } = useAuth()
  const { tickets, loading, error, reload } = useTickets()

  const scoped = useMemo(() => {
    if (!user) return []
    if (user.role === 'Admin') return tickets
    if (user.role === 'Support Agent') return tickets.filter((t) => t.assignedAgentId === user.id)
    return tickets.filter((t) => t.createdById === user.id)
  }, [tickets, user])

  if (loading) return <Loader label="Loading dashboard…" />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!user) return null

  const count = (pred: (t: (typeof tickets)[number]) => boolean) => scoped.filter(pred).length

  const stats =
    user.role === 'Admin'
      ? [
          { label: 'Total Tickets', value: scoped.length, accent: 'ink' as const },
          { label: 'Open', value: count((t) => t.status === 'Open'), accent: 'ink' as const },
          { label: 'Assigned', value: count((t) => t.status === 'Assigned'), accent: 'indigo' as const },
          { label: 'In Progress', value: count((t) => t.status === 'In Progress'), accent: 'amber' as const },
          { label: 'Pending', value: count((t) => t.status === 'Pending'), accent: 'amber' as const },
          { label: 'Resolved', value: count((t) => t.status === 'Resolved'), accent: 'teal' as const },
          { label: 'Closed', value: count((t) => t.status === 'Closed'), accent: 'ink' as const },
          { label: 'Critical', value: count((t) => t.priority === 'Critical'), accent: 'rust' as const },
          { label: 'Unassigned', value: count((t) => !t.assignedAgentId && t.status !== 'Cancelled'), accent: 'rust' as const },
        ]
      : user.role === 'Support Agent'
        ? [
            { label: 'My Assigned Tickets', value: scoped.length, accent: 'ink' as const },
            { label: 'New Tickets', value: count((t) => t.status === 'Assigned'), accent: 'indigo' as const },
            { label: 'In Progress', value: count((t) => t.status === 'In Progress'), accent: 'amber' as const },
            { label: 'Pending', value: count((t) => t.status === 'Pending'), accent: 'amber' as const },
            { label: 'Resolved', value: count((t) => t.status === 'Resolved'), accent: 'teal' as const },
            { label: 'High Priority', value: count((t) => t.priority === 'High' || t.priority === 'Critical'), accent: 'rust' as const },
          ]
        : [
            { label: 'My Total Tickets', value: scoped.length, accent: 'ink' as const },
            { label: 'Open', value: count((t) => t.status === 'Open'), accent: 'ink' as const },
            { label: 'In Progress', value: count((t) => t.status === 'In Progress' || t.status === 'Assigned'), accent: 'amber' as const },
            { label: 'Resolved', value: count((t) => t.status === 'Resolved'), accent: 'teal' as const },
            { label: 'Closed', value: count((t) => t.status === 'Closed'), accent: 'ink' as const },
          ]

  const recent = [...scoped]
    .sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime())
    .slice(0, 6)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-50">
            {user.role === 'Employee' ? 'My Dashboard' : `${user.role} Dashboard`}
          </h1>
          <p className="text-sm text-ink-400">Here's what's happening across your tickets.</p>
        </div>
        {(user.role === 'Employee' || user.role === 'Admin') && (
          <Link
            to="/tickets/new"
            className="rounded-md bg-ink-900 dark:bg-ink-100 dark:text-ink-900 text-white text-sm font-medium px-4 py-2 hover:bg-ink-800 dark:hover:bg-ink-300 focus-ring"
          >
            + Create Ticket
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100 dark:border-ink-800">
          <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Recently updated</h2>
          <Link to="/tickets" className="text-xs font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-50">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No tickets yet" description="Tickets will show up here once they're created." />
        ) : (
          <ul className="divide-y divide-ink-100 dark:divide-ink-800">
            {recent.map((t) => (
              <li key={t.id}>
                <Link to={`/tickets/${t.id}`} className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-ink-50 dark:hover:bg-ink-800">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-800 dark:text-ink-100 truncate">
                      <span className="font-mono text-ink-400 mr-2">{t.ticketNumber}</span>
                      {t.subject}
                    </p>
                    <p className="text-xs text-ink-400 mt-0.5">Updated {formatDate(t.updatedDate)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <PriorityBadge priority={t.priority} />
                    <StatusBadge status={t.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
