import { useCallback, useEffect, useState } from 'react'
import { categoryService } from '../services/categoryService'
import { getErrorMessage } from '../services/api'
import type { Category } from '../types/category'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (e) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { categories, loading, error, reload, setCategories }
}
