export type Role = 'Admin' | 'Support Agent' | 'Employee'
export type UserStatus = 'Active' | 'Inactive'

export interface User {
  id: string
  fullName: string
  email: string
  password: string
  phone: string
  department: string
  role: Role
  status: UserStatus
  createdDate: string
}

export type UserInput = Omit<User, 'id' | 'createdDate'>
