import { useMemo } from 'react'
import { useTickets } from '../../hooks/useTickets'
import { Loader, ErrorState } from '../../components/common/States'
import { StatCard } from '../../components/Dashboard/StatCard'

export function ReportsPage() {
  const { tickets, loading, error, reload } = useTickets()

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    tickets.forEach((t) => map.set(t.category, (map.get(t.category) || 0) + 1))
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [tickets])

  const byAgent = useMemo(() => {
    const map = new Map<string, number>()
    tickets.forEach((t) => {
      const name = t.assignedAgentName || 'Unassigned'
      map.set(name, (map.get(name) || 0) + 1)
    })
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [tickets])

  const avgResolutionDays = useMemo(() => {
    const resolved = tickets.filter((t) => t.resolutionDate)
    if (resolved.length === 0) return null
    const totalDays = resolved.reduce((sum, t) => {
      const created = new Date(t.createdDate).getTime()
      const resolvedAt = new Date(t.resolutionDate!).getTime()
      return sum + (resolvedAt - created) / (1000 * 60 * 60 * 24)
    }, 0)
    return (totalDays / resolved.length).toFixed(1)
  }, [tickets])

  if (loading) return <Loader label="Building report…" />
  if (error) return <ErrorState message={error} onRetry={reload} />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-ink-900">Reports</h1>
        <p className="text-sm text-ink-400">A quick read on ticket volume and resolution performance.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard label="Total Tickets" value={tickets.length} />
        <StatCard label="Resolved" value={tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length} accent="teal" />
        <StatCard label="Avg. Resolution (days)" value={avgResolutionDays ? Number(avgResolutionDays) : 0} accent="indigo" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-lg border border-ink-100 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink-800 mb-3">Tickets by category</h2>
          <ul className="space-y-2">
            {byCategory.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{name}</span>
                <span className="font-medium text-ink-800">{count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-ink-100 bg-white p-5">
          <h2 className="text-sm font-semibold text-ink-800 mb-3">Tickets by agent</h2>
          <ul className="space-y-2">
            {byAgent.map(([name, count]) => (
              <li key={name} className="flex items-center justify-between text-sm">
                <span className="text-ink-600">{name}</span>
                <span className="font-medium text-ink-800">{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
