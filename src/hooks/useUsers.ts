import { useCallback, useEffect, useState } from 'react'
import { userService } from '../services/userService'
import { getErrorMessage } from '../services/api'
import type { User } from '../types/user'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await userService.getAll()
      setUsers(data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { users, loading, error, reload, setUsers }
}
