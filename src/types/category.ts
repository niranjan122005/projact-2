export type CategoryStatus = 'Active' | 'Inactive'

export interface Category {
  id: string
  name: string
  description: string
  status: CategoryStatus
}

export type CategoryInput = Omit<Category, 'id'>
