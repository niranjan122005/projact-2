import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useUsers } from '../../hooks/useUsers'
import { useCategories } from '../../hooks/useCategories'
import { ticketService } from '../../services/ticketService'
import { commentService } from '../../services/commentService'
import { getErrorMessage } from '../../services/api'
import type { Ticket, TicketPriority, TicketStatus } from '../../types/ticket'
import type { Comment } from '../../types/comment'
import { Loader, ErrorState } from '../../components/common/States'
import { StatusBadge, PriorityBadge } from '../../components/common/Badges'
import { formatDate, formatDateTime } from '../../utils/date'
import { Modal, ConfirmModal } from '../../components/common/Modal'
import { TicketForm, type TicketFormValues } from '../../components/Tickets/TicketForm'
import { AssignmentModal } from '../../components/Tickets/AssignmentModal'
import { ResolutionModal } from '../../components/Tickets/ResolutionModal'
import { StatusActions } from '../../components/Tickets/StatusActions'
import { ActivityTimeline } from '../../components/Tickets/ActivityTimeline'
import { CommentSection } from '../../components/Comments/CommentSection'
import {
  canAddComment,
  canAddResolution,
  canAssignTickets,
  canDeleteTicket,
  canEditTicket,
  canUpdatePriority,
  canViewTicket,
  getAllowedNextStatuses,
} from '../../utils/permissions'

export function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { users } = useUsers()
  const { categories } = useCategories()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [resolveOpen, setResolveOpen] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const [t, c] = await Promise.all([ticketService.getById(id), commentService.getByTicket(id)])
      setTicket(t)
      setComments(c)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  if (loading) return <Loader label="Loading ticket…" />
  if (error) return <ErrorState message={error} onRetry={load} />
  if (!ticket || !user) return null

  if (!canViewTicket(user.role, user.id, ticket)) {
    return <ErrorState message="You don't have permission to view this ticket." />
  }

  const agents = users.filter((u) => u.role === 'Support Agent' && u.status === 'Active')
  const allowedStatuses = getAllowedNextStatuses(user.role, user.id, ticket)

  async function handleStatusChange(status: TicketStatus) {
    if (!ticket || !user) return
    if (status === 'Resolved') {
      setResolveOpen(true)
      return
    }
    try {
      const updated = await ticketService.changeStatus(ticket, status, user.fullName)
      setTicket(updated)
      showToast(`Ticket marked as ${status}.`)
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleEditSubmit(values: TicketFormValues) {
    if (!ticket || !user) return
    try {
      const updated = await ticketService.update(ticket.id, values)
      const withActivity = await ticketService.logActivity(updated, user.fullName, 'Ticket details updated')
      setTicket(withActivity)
      showToast('Ticket updated.')
      setEditOpen(false)
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handlePriorityChange(priority: TicketPriority) {
    if (!ticket || !user) return
    try {
      const updated = await ticketService.update(ticket.id, { priority })
      const withActivity = await ticketService.logActivity(updated, user.fullName, `Priority changed to ${priority}`)
      setTicket(withActivity)
      showToast('Priority updated.')
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleAssign(agentId: string) {
    if (!ticket || !user) return
    const agent = users.find((u) => u.id === agentId)
    if (!agent) return
    try {
      const updated = await ticketService.assign(ticket, { id: agent.id, name: agent.fullName }, user.fullName)
      setTicket(updated)
      showToast(`Ticket assigned to ${agent.fullName}.`)
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleUnassign() {
    if (!ticket || !user) return
    try {
      const updated = await ticketService.unassign(ticket, user.fullName)
      setTicket(updated)
      showToast('Ticket unassigned.')
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleResolve(values: { resolution: string; resolutionNotes: string }) {
    if (!ticket || !user) return
    try {
      const updated = await ticketService.resolve(ticket, values, user.fullName)
      setTicket(updated)
      const comment = await commentService.create({
        ticketId: ticket.id,
        userId: user.id,
        userName: user.fullName,
        comment: `Resolved the task: ${values.resolution}`,
      })
      setComments((prev) => [...prev, comment])
      showToast('Ticket resolved.')
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleDelete() {
    if (!ticket) return
    try {
      await ticketService.remove(ticket.id)
      showToast('Ticket deleted.')
      navigate('/tickets')
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  async function handleAddComment(text: string) {
    if (!ticket || !user) return
    try {
      const comment = await commentService.create({ ticketId: ticket.id, userId: user.id, userName: user.fullName, comment: text })
      setComments((prev) => [...prev, comment])
      const updated = await ticketService.logActivity(ticket, user.fullName, 'Comment added')
      setTicket(updated)
    } catch (e) {
      showToast(getErrorMessage(e), 'error')
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <Link to="/tickets" className="text-xs font-medium text-ink-400 hover:text-ink-700 dark:hover:text-ink-200">
            ← Back to tickets
          </Link>
          <h1 className="text-lg font-semibold text-ink-900 dark:text-ink-50 mt-1">
            <span className="font-mono text-ink-400 mr-2">{ticket.ticketNumber}</span>
            {ticket.subject}
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="text-xs text-ink-400">Updated {formatDateTime(ticket.updatedDate)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canEditTicket(user.role, user.id, ticket) && (
            <button onClick={() => setEditOpen(true)} className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 focus-ring">
              Edit
            </button>
          )}
          {canAssignTickets(user.role) && (
            <button onClick={() => setAssignOpen(true)} className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm font-medium text-ink-700 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-800 focus-ring">
              {ticket.assignedAgentId ? 'Reassign' : 'Assign'}
            </button>
          )}
          {canDeleteTicket(user.role) && (
            <button onClick={() => setDeleteOpen(true)} className="rounded-md border border-signal-rust/30 px-3 py-2 text-sm font-medium text-signal-rust hover:bg-signal-rust/10 focus-ring">
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
            <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100 mb-3">Description</h2>
            <p className="text-sm text-ink-600 dark:text-ink-400 whitespace-pre-wrap">{ticket.description}</p>
          </section>

          {allowedStatuses.length > 0 && (
            <section className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
              <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100 mb-3">Update status</h2>
              <StatusActions options={allowedStatuses} onSelect={handleStatusChange} />
            </section>
          )}

          {(ticket.resolution || canAddResolution(user.role, user.id, ticket)) && (
            <section className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100">Resolution</h2>
                {canAddResolution(user.role, user.id, ticket) && !ticket.resolution && ticket.status !== 'Closed' && (
                  <button onClick={() => setResolveOpen(true)} className="text-xs font-medium text-signal-teal hover:underline">
                    Add resolution
                  </button>
                )}
              </div>
              {ticket.resolution ? (
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-ink-800 dark:text-ink-100">{ticket.resolution}</p>
                  <p className="text-ink-600 dark:text-ink-400 whitespace-pre-wrap">{ticket.resolutionNotes}</p>
                  <p className="text-xs text-ink-400">Resolved {formatDateTime(ticket.resolutionDate)}</p>
                </div>
              ) : (
                <p className="text-sm text-ink-400">No resolution added yet.</p>
              )}
            </section>
          )}

          <section className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
            <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100 mb-3">Comments</h2>
            <CommentSection comments={comments} canComment={canAddComment(user.role, user.id, ticket)} onAdd={handleAddComment} />
          </section>

          <section className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
            <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100 mb-3">Activity history</h2>
            <ActivityTimeline activity={ticket.activity} />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5 text-sm">
            <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100 mb-3">Ticket details</h2>
            <dl className="space-y-3">
              <Row label="Created by" value={ticket.createdByName} />
              <Row label="Assigned agent" value={ticket.assignedAgentName || 'Unassigned'} />
              <Row label="Category" value={ticket.category} />
              <Row label="Preferred contact" value={ticket.preferredContact} />
              <Row label="Created" value={formatDate(ticket.createdDate)} />
              <Row label="Due" value={formatDate(ticket.dueDate)} />
            </dl>
          </section>

          {canUpdatePriority(user.role, user.id, ticket) && (
            <section className="rounded-lg border border-ink-100 dark:border-ink-800 bg-white dark:bg-ink-900 p-5">
              <h2 className="text-sm font-semibold text-ink-800 dark:text-ink-100 mb-3">Priority</h2>
              <select
                value={ticket.priority}
                onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                className="w-full rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 px-3 py-2 text-sm focus-ring"
              >
                {(['Low', 'Medium', 'High', 'Critical'] as TicketPriority[]).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </section>
          )}
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Ticket" size="lg">
        <TicketForm initial={ticket} categories={categories} submitLabel="Save Changes" onSubmit={handleEditSubmit} onCancel={() => setEditOpen(false)} />
      </Modal>

      <AssignmentModal open={assignOpen} onClose={() => setAssignOpen(false)} ticket={ticket} agents={agents} onAssign={handleAssign} onUnassign={handleUnassign} />

      <ResolutionModal open={resolveOpen} onClose={() => setResolveOpen(false)} onSubmit={handleResolve} />

      <ConfirmModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete this ticket?"
        message={`This will permanently delete ${ticket.ticketNumber}. This action cannot be undone.`}
      />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-ink-400">{label}</dt>
      <dd className="font-medium text-ink-800 dark:text-ink-100 text-right">{value}</dd>
    </div>
  )
}
