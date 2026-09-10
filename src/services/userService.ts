import { api } from './api'
import type { User, UserInput } from '../types/user'

export const userService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get<User[]>('/users')
    return data
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get<User>(`/users/${id}`)
    return data
  },

  async findByEmail(email: string): Promise<User | undefined> {
    const { data } = await api.get<User[]>('/users', { params: { email } })
    return data[0]
  },

  async create(input: UserInput): Promise<User> {
    const payload: Omit<User, 'id'> = {
      ...input,
      createdDate: new Date().toISOString(),
    }
    const { data } = await api.post<User>('/users', payload)
    return data
  },

  async update(id: string, input: Partial<UserInput>): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, input)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/users/${id}`)
  },

  async setStatus(id: string, status: 'Active' | 'Inactive'): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}`, { status })
    return data
  },
}
