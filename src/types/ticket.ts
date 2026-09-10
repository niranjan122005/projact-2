export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Critical'

export type TicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Pending'
  | 'Resolved'
  | 'Closed'
  | 'Cancelled'

export type ContactMethod = 'Email' | 'Phone' | 'Chat'

export interface ActivityEntry {
  id: string
  timestamp: string
  actorName: string
  action: string
}

export interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  description: string
  createdById: string
  createdByName: string
  assignedAgentId: string | null
  assignedAgentName: string | null
  category: string
  priority: TicketPriority
  status: TicketStatus
  preferredContact: ContactMethod
  createdDate: string
  updatedDate: string
  dueDate: string | null
  resolution: string | null
  resolutionNotes: string | null
  resolutionDate: string | null
  activity: ActivityEntry[]
}

export type TicketCreateInput = {
  subject: string
  description: string
  category: string
  priority: TicketPriority
  preferredContact: ContactMethod
}

export type TicketUpdateInput = Partial<
  Pick<
    Ticket,
    | 'subject'
    | 'description'
    | 'category'
    | 'priority'
    | 'preferredContact'
    | 'status'
    | 'assignedAgentId'
    | 'assignedAgentName'
    | 'dueDate'
    | 'resolution'
    | 'resolutionNotes'
    | 'resolutionDate'
  >
>
