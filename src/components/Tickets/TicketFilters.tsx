import type { Category } from '../../types/category'
import type { User } from '../../types/user'

export interface TicketFilterState {
  search: string
  status: string
  priority: string
  category: string
  agent: string
  createdAfter: string
  sort: 'newest' | 'oldest' | 'priority' | 'updated'
}

export const defaultFilters: TicketFilterState = {
  search: '',
  status: '',
  priority: '',
  category: '',
  agent: '',
  createdAfter: '',
  sort: 'newest',
}

const selectClass =
  'rounded-md border border-ink-200 dark:border-ink-700 px-2.5 py-2 text-sm text-ink-700 dark:text-ink-300 bg-white dark:bg-ink-900 focus-ring'

export function TicketFilters({
  value,
  onChange,
  categories,
  agents,
  showAgentFilter = true,
}: {
  value: TicketFilterState
  onChange: (v: TicketFilterState) => void
  categories: Category[]
  agents: User[]
  showAgentFilter?: boolean
}) {
  function set<K extends keyof TicketFilterState>(key: K, v: TicketFilterState[K]) {
    onChange({ ...value, [key]: v })
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <input
        type="search"
        placeholder="Search by ID, subject, requester, agent…"
        value={value.search}
        onChange={(e) => set('search', e.target.value)}
        className="w-full sm:w-72 rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm placeholder:text-ink-300 dark:placeholder:text-ink-600 focus-ring"
      />
      <select className={selectClass} value={value.status} onChange={(e) => set('status', e.target.value)}>
        <option value="">All statuses</option>
        {['Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Cancelled'].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <select className={selectClass} value={value.priority} onChange={(e) => set('priority', e.target.value)}>
        <option value="">All priorities</option>
        {['Low', 'Medium', 'High', 'Critical'].map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <select className={selectClass} value={value.category} onChange={(e) => set('category', e.target.value)}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      {showAgentFilter && (
        <select className={selectClass} value={value.agent} onChange={(e) => set('agent', e.target.value)}>
          <option value="">All agents</option>
          <option value="__unassigned">Unassigned</option>
          {agents.map((a) => (
            <option key={a.id} value={a.id}>
              {a.fullName}
            </option>
          ))}
        </select>
      )}
      <label className="flex items-center gap-1.5 text-xs text-ink-400">
        Created after
        <input
          type="date"
          value={value.createdAfter}
          onChange={(e) => set('createdAfter', e.target.value)}
          className="rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-2 py-1.5 text-sm text-ink-700 dark:text-ink-300 focus-ring"
        />
      </label>
      <select className={selectClass} value={value.sort} onChange={(e) => set('sort', e.target.value as TicketFilterState['sort'])}>
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="priority">Highest priority</option>
        <option value="updated">Recently updated</option>
      </select>
    </div>
  )
}

export function applyTicketFilters<T extends {
  ticketNumber: string
  subject: string
  createdByName: string
  assignedAgentName: string | null
  assignedAgentId: string | null
  status: string
  priority: string
  category: string
  createdDate: string
  updatedDate: string
}>(tickets: T[], f: TicketFilterState): T[] {
  const priorityRank: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 }
  let result = tickets.filter((t) => {
    const q = f.search.trim().toLowerCase()
    const matchesSearch =
      !q ||
      t.ticketNumber.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.createdByName.toLowerCase().includes(q) ||
      (t.assignedAgentName || '').toLowerCase().includes(q)
    const matchesStatus = !f.status || t.status === f.status
    const matchesPriority = !f.priority || t.priority === f.priority
    const matchesCategory = !f.category || t.category === f.category
    const matchesAgent =
      !f.agent || (f.agent === '__unassigned' ? !t.assignedAgentId : t.assignedAgentId === f.agent)
    const matchesCreatedAfter = !f.createdAfter || new Date(t.createdDate) >= new Date(f.createdAfter)
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAgent && matchesCreatedAfter
  })

  result = [...result].sort((a, b) => {
    if (f.sort === 'newest') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    if (f.sort === 'oldest') return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
    if (f.sort === 'priority') return priorityRank[b.priority] - priorityRank[a.priority]
    return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
  })

  return result
}
