import { api } from './api'
import type { Comment, CommentInput } from '../types/comment'

export const commentService = {
  async getByTicket(ticketId: string): Promise<Comment[]> {
    const { data } = await api.get<Comment[]>('/comments', { params: { ticketId } })
    return data.sort((a, b) => a.id.localeCompare(b.id))
  },

  async create(input: CommentInput): Promise<Comment> {
    const now = new Date()
    const payload: Omit<Comment, 'id'> = {
      ...input,
      createdDate: now.toISOString().slice(0, 10),
      createdTime: now.toTimeString().slice(0, 5),
    }
    const { data } = await api.post<Comment>('/comments', payload)
    return data
  },

  async update(id: string, comment: string): Promise<Comment> {
    const { data } = await api.patch<Comment>(`/comments/${id}`, { comment })
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/comments/${id}`)
  },
}
