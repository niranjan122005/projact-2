import { api } from './api'
import type { Category, CategoryInput } from '../types/category'

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories')
    return data
  },

  async getById(id: string): Promise<Category> {
    const { data } = await api.get<Category>(`/categories/${id}`)
    return data
  },

  async create(input: CategoryInput): Promise<Category> {
    const { data } = await api.post<Category>('/categories', input)
    return data
  },

  async update(id: string, input: Partial<CategoryInput>): Promise<Category> {
    const { data } = await api.patch<Category>(`/categories/${id}`, input)
    return data
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/categories/${id}`)
  },
}
