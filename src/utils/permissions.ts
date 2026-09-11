import type { Role } from '../types/user'
import type { Ticket, TicketStatus } from '../types/ticket'

// Central place for every RBAC rule in the spec (section 25, "Role Permission Matrix").
// Keeping this in one file means every screen checks the same source of truth.

export const isAdmin = (role: Role) => role === 'Admin'
export const isAgent = (role: Role) => role === 'Support Agent'
export const isEmployee = (role: Role) => role === 'Employee'

export function canViewAllTickets(role: Role) {
  return isAdmin(role)
}

export function canViewTicket(role: Role, userId: string, ticket: Ticket) {
  if (isAdmin(role)) return true
  if (isAgent(role)) return ticket.assignedAgentId === userId
  return ticket.createdById === userId
}

export function canCreateTicket(role: Role) {
  return isAdmin(role) || isEmployee(role)
}

export function canEditTicket(role: Role, userId: string, ticket: Ticket) {
  if (isAdmin(role)) return true
  if (isAgent(role)) return ticket.assignedAgentId === userId
  if (isEmployee(role)) return ticket.createdById === userId && ticket.status === 'Open'
  return false
}

export function canDeleteTicket(role: Role) {
  return isAdmin(role)
}

export function canAssignTickets(role: Role) {
  return isAdmin(role)
}

export function canUpdatePriority(role: Role, userId: string, ticket: Ticket) {
  if (isAdmin(role)) return true
  if (isAgent(role)) return ticket.assignedAgentId === userId
  return false
}

export function canAddComment(role: Role, userId: string, ticket: Ticket) {
  if (isAdmin(role)) return true
  if (isAgent(role)) return ticket.assignedAgentId === userId
  if (isEmployee(role)) return ticket.createdById === userId
  return false
}

export function canAddResolution(role: Role, userId: string, ticket: Ticket) {
  if (isAdmin(role)) return true
  if (isAgent(role)) return ticket.assignedAgentId === userId
  return false
}

export function canManageUsers(role: Role) {
  return isAdmin(role)
}

export function canManageCategories(role: Role) {
  return isAdmin(role)
}

export function canCancelTicket(role: Role, userId: string, ticket: Ticket) {
  if (isAdmin(role)) return ticket.status === 'Open'
  if (isEmployee(role)) return ticket.createdById === userId && ticket.status === 'Open'
  return false
}

export function canReopenTicket(role: Role, userId: string, ticket: Ticket) {
  if (isAdmin(role)) return ticket.status === 'Resolved'
  if (isEmployee(role)) return ticket.createdById === userId && ticket.status === 'Resolved'
  return false
}

/**
 * The ticket lifecycle graph (spec section 4). Admin can move a ticket along any
 * of these edges; Agent/Employee are further restricted by getAllowedNextStatuses.
 */
export const LIFECYCLE: Record<TicketStatus, TicketStatus[]> = {
  Open: ['Assigned', 'Cancelled'],
  Assigned: ['In Progress'],
  'In Progress': ['Pending', 'Resolved'],
  Pending: ['In Progress', 'Resolved'],
  Resolved: ['Closed', 'Open'], // Open here represents "Reopened"
  Closed: [],
  Cancelled: [],
}

export function getAllowedNextStatuses(role: Role, userId: string, ticket: Ticket): TicketStatus[] {
  const graphOptions = LIFECYCLE[ticket.status] || []

  if (isAdmin(role)) return graphOptions

  if (isAgent(role)) {
    if (ticket.assignedAgentId !== userId) return []
    const agentAllowed: TicketStatus[] = ['In Progress', 'Pending', 'Resolved', 'Closed']
    return graphOptions.filter((s) => agentAllowed.includes(s))
  }

  if (isEmployee(role)) {
    if (ticket.createdById !== userId) return []
    const options: TicketStatus[] = []
    if (ticket.status === 'Open') options.push('In Progress', 'Cancelled')
    if (ticket.status === 'In Progress' || ticket.status === 'Pending') options.push('Resolved')
    if (ticket.status === 'Resolved') options.push('Open') // Reopen
    return options
  }

  return []
}
