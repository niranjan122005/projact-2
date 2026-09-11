import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTickets } from '../../hooks/useTickets'
import { useCategories } from '../../hooks/useCategories'
import { useUsers } from '../../hooks/useUsers'
import { usePagination } from '../../hooks/usePagination'
import { TicketTable } from '../../components/Tickets/TicketTable'
import { TicketFilters, defaultFilters, applyTicketFilters, type TicketFilterState } from '../../components/Tickets/TicketFilters'
import { Loader, ErrorState } from '../../components/common/States'
import { Pagination } from '../../components/common/Pagination'
import { canCreateTicket } from '../../utils/permissions'

export function TicketsListPage() {
  const { user } = useAuth()
  const { tickets, loading, error, reload } = useTickets()
  const { categories } = useCategories()
  const { users } = useUsers()
  const [filters, setFilters] = useState<TicketFilterState>(defaultFilters)

  const agents = useMemo(() => users.filter((u) => u.role === 'Support Agent'), [users])

  const scoped = useMemo(() => {
    if (!user) return []
    if (user.role === 'Admin') return tickets
    if (user.role === 'Support Agent') return tickets.filter((t) => t.assignedAgentId === user.id)
    return tickets.filter((t) => t.createdById === user.id)
  }, [tickets, user])

  const filtered = useMemo(() => applyTicketFilters(scoped, filters), [scoped, filters])
  const { page, setPage, totalPages, pageItems } = usePagination(filtered, 8)

  if (loading) return <Loader label="Loading tickets…" />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!user) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-50">{user.role === 'Admin' ? 'All Tickets' : 'My Tickets'}</h1>
          <p className="text-sm text-ink-400">{filtered.length} ticket{filtered.length === 1 ? '' : 's'}</p>
        </div>
        {canCreateTicket(user.role) && (
          <Link to="/tickets/new" className="rounded-md bg-ink-900 dark:bg-ink-100 dark:text-ink-900 text-white text-sm font-medium px-4 py-2 hover:bg-ink-800 dark:hover:bg-ink-300 focus-ring">
            + Create Ticket
          </Link>
        )}
      </div>

      <div className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-4">
        <TicketFilters value={filters} onChange={setFilters} categories={categories} agents={agents} showAgentFilter={user.role === 'Admin'} />
      </div>

      <div className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900">
        <TicketTable tickets={pageItems} showRequester={user.role !== 'Employee'} />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  )
}
