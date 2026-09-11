import { useMemo, useState } from 'react'
import { Modal } from '../common/Modal'
import type { User } from '../../types/user'
import type { Ticket } from '../../types/ticket'
import { formatDateTime } from '../../utils/date'

export function AssignmentModal({
  open,
  onClose,
  ticket,
  agents,
  onAssign,
  onUnassign,
}: {
  open: boolean
  onClose: () => void
  ticket: Ticket
  agents: User[]
  onAssign: (agentId: string) => Promise<void>
  onUnassign: () => Promise<void>
}) {
  const [selected, setSelected] = useState(ticket.assignedAgentId || '')
  const [submitting, setSubmitting] = useState(false)

  const lastAssignmentDate = useMemo(() => {
    const entry = [...ticket.activity]
      .reverse()
      .find((a) => a.action.toLowerCase().includes('assign'))
    return entry?.timestamp ?? null
  }, [ticket.activity])

  async function handleAssign() {
    if (!selected) return
    setSubmitting(true)
    try {
      await onAssign(selected)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUnassign() {
    setSubmitting(true)
    try {
      await onUnassign()
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={ticket.assignedAgentId ? 'Reassign Ticket' : 'Assign Ticket'} size="sm">
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-ink-500 dark:text-ink-400">
          <span>Ticket</span>
          <span className="font-medium text-ink-800 dark:text-ink-100">{ticket.ticketNumber}</span>
        </div>
        <div className="flex justify-between text-ink-500 dark:text-ink-400">
          <span>Current agent</span>
          <span className="font-medium text-ink-800 dark:text-ink-100">{ticket.assignedAgentName || 'Unassigned'}</span>
        </div>
        {lastAssignmentDate && (
          <div className="flex justify-between text-ink-500 dark:text-ink-400">
            <span>Assignment date</span>
            <span className="font-medium text-ink-800 dark:text-ink-100">{formatDateTime(lastAssignmentDate)}</span>
          </div>
        )}

        <div>
          <label htmlFor="agent" className="mb-1.5 block text-sm font-medium text-ink-700 dark:text-ink-300">
            Available support agents
          </label>
          <select
            id="agent"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm focus-ring"
          >
            <option value="">Select an agent</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.fullName} — {a.department}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex justify-between gap-2">
        {ticket.assignedAgentId ? (
          <button
            onClick={handleUnassign}
            disabled={submitting}
            className="rounded-md border border-signal-rust/30 text-signal-rust px-4 py-2 text-sm font-medium hover:bg-signal-rust/10 focus-ring"
          >
            Unassign
          </button>
        ) : (
          <span />
        )}
        <div className="flex gap-2">
          <button onClick={onClose} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 focus-ring">
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={submitting || !selected}
            className="rounded-md bg-ink-900 dark:bg-ink-100 dark:text-ink-900 text-white px-4 py-2 text-sm font-medium hover:bg-ink-800 dark:hover:bg-ink-300 disabled:opacity-50 focus-ring"
          >
            {ticket.assignedAgentId ? 'Reassign' : 'Assign'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
