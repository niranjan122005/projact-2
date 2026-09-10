import { useCallback, useEffect, useState } from 'react'
import { ticketService } from '../services/ticketService'
import { getErrorMessage } from '../services/api'
import type { Ticket } from '../types/ticket'

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await ticketService.getAll()
      setTickets(data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { tickets, loading, error, reload, setTickets }
}
