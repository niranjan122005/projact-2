import { api } from './api'
import type { ActivityEntry, Ticket, TicketCreateInput, TicketUpdateInput, TicketStatus } from '../types/ticket'
import { nowIso, daysFromNow } from '../utils/date'

function activityEntry(actorName: string, action: string): ActivityEntry {
  return { id: crypto.randomUUID(), timestamp: nowIso(), actorName, action }
}

function nextTicketNumber(existing: Ticket[]): string {
  const max = existing.reduce((m, t) => {
    const n = parseInt(t.ticketNumber?.replace('TCK-', '') || '0', 10)
    return Number.isNaN(n) ? m : Math.max(m, n)
  }, 1000)
  return `TCK-${max + 1}`
}

export const ticketService = {
  async getAll(): Promise<Ticket[]> {
    const { data } = await api.get<Ticket[]>('/tickets')
    return data
  },

  async getById(id: string): Promise<Ticket> {
    const { data } = await api.get<Ticket>(`/tickets/${id}`)
    return data
  },

  async create(input: TicketCreateInput, creator: { id: string; name: string }): Promise<Ticket> {
    const existing = await this.getAll()
    const now = nowIso()
    const payload: Omit<Ticket, 'id'> = {
      ticketNumber: nextTicketNumber(existing),
      subject: input.subject.trim(),
      description: input.description.trim(),
      createdById: creator.id,
      createdByName: creator.name,
      assignedAgentId: null,
      assignedAgentName: null,
      category: input.category,
      priority: input.priority,
      status: 'Open',
      preferredContact: input.preferredContact,
      createdDate: now,
      updatedDate: now,
      dueDate: daysFromNow(5),
      resolution: null,
      resolutionNotes: null,
      resolutionDate: null,
      activity: [activityEntry(creator.name, 'Ticket created')],
    }
    const { data } = await api.post<Ticket>('/tickets', payload)
    return data
  },

  async update(id: string, input: TicketUpdateInput): Promise<Ticket> {
    const { data } = await api.patch<Ticket>(`/tickets/${id}`, {
      ...input,
      updatedDate: nowIso(),
    })
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/tickets/${id}`)
  },

  async logActivity(ticket: Ticket, actorName: string, action: string): Promise<Ticket> {
    const activity = [...ticket.activity, activityEntry(actorName, action)]
    const { data } = await api.patch<Ticket>(`/tickets/${ticket.id}`, {
      activity,
      updatedDate: nowIso(),
    })
    return data
  },

  async changeStatus(ticket: Ticket, status: TicketStatus, actorName: string): Promise<Ticket> {
    const activity = [...ticket.activity, activityEntry(actorName, `Status changed to ${status}`)]
    const patch: Partial<Ticket> = { status, activity, updatedDate: nowIso() }
    const { data } = await api.patch<Ticket>(`/tickets/${ticket.id}`, patch)
    return data
  },

  async assign(ticket: Ticket, agent: { id: string; name: string }, actorName: string): Promise<Ticket> {
    const wasUnassigned = !ticket.assignedAgentId
    const action = wasUnassigned
      ? `Ticket assigned to ${agent.name}`
      : `Ticket reassigned from ${ticket.assignedAgentName} to ${agent.name}`
    const activity = [...ticket.activity, activityEntry(actorName, action)]
    const { data } = await api.patch<Ticket>(`/tickets/${ticket.id}`, {
      assignedAgentId: agent.id,
      assignedAgentName: agent.name,
      status: ticket.status === 'Open' ? 'Assigned' : ticket.status,
      activity,
      updatedDate: nowIso(),
    })
    return data
  },

  async unassign(ticket: Ticket, actorName: string): Promise<Ticket> {
    const activity = [...ticket.activity, activityEntry(actorName, `Ticket unassigned from ${ticket.assignedAgentName}`)]
    const { data } = await api.patch<Ticket>(`/tickets/${ticket.id}`, {
      assignedAgentId: null,
      assignedAgentName: null,
      status: 'Open',
      activity,
      updatedDate: nowIso(),
    })
    return data
  },

  async resolve(
    ticket: Ticket,
    resolution: { resolution: string; resolutionNotes: string },
    actorName: string,
  ): Promise<Ticket> {
    const resolutionDate = nowIso()
    const activity = [
      ...ticket.activity,
      activityEntry(actorName, 'Resolution added'),
      activityEntry(actorName, 'Status changed to Resolved'),
    ]
    const { data } = await api.patch<Ticket>(`/tickets/${ticket.id}`, {
      status: 'Resolved',
      resolution: resolution.resolution,
      resolutionNotes: resolution.resolutionNotes,
      resolutionDate,
      activity,
      updatedDate: nowIso(),
    })
    return data
  },
}
