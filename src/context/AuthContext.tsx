import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { userService } from '../services/userService'
import type { Role, User } from '../types/user'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string, expectedRole?: Role) => Promise<boolean>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const STORAGE_KEY = 'itsm.currentUserId'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY)
    if (!savedId) {
      setLoading(false)
      return
    }
    userService
      .getById(savedId)
      .then((u) => setUser(u))
      .catch(() => localStorage.removeItem(STORAGE_KEY))
      .finally(() => setLoading(false))
  }, [])

  async function login(email: string, password: string, expectedRole?: Role): Promise<boolean> {
    setError(null)
    const found = await userService.findByEmail(email.trim().toLowerCase())
    if (!found || found.password !== password) {
      setError('Invalid email or password.')
      return false
    }
    if (expectedRole && found.role !== expectedRole) {
      setError(`This account is registered as ${found.role}, not ${expectedRole}. Please select the correct login type.`)
      return false
    }
    if (found.status === 'Inactive') {
      setError('This account has been deactivated. Contact an administrator.')
      return false
    }
    setUser(found)
    localStorage.setItem(STORAGE_KEY, found.id)
    return true
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  async function refreshUser() {
    if (!user) return
    const fresh = await userService.getById(user.id)
    setUser(fresh)
  }

  const value = useMemo(
    () => ({ user, loading, error, login, logout, refreshUser }),
    [user, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
