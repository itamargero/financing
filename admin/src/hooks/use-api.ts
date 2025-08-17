import { useState, useEffect, useCallback } from 'react'

// Generic hook for API operations
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, dependencies)

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const refetch = useCallback(() => {
    return fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

// Hook for API mutations (create, update, delete)
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>
) {
  const [data, setData] = useState<TData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mutate = useCallback(async (variables: TVariables) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(variables)
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [mutationFn])

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, mutate, reset }
}

// Hook for optimistic updates
export function useOptimisticUpdate<T>(
  data: T[] | null,
  setData: (data: T[]) => void
) {
  const optimisticAdd = useCallback((item: T) => {
    if (data) {
      setData([item, ...data])
    }
  }, [data, setData])

  const optimisticUpdate = useCallback((id: string, updates: Partial<T>) => {
    if (data) {
      setData(data.map(item => 
        (item as any).id === id ? { ...item, ...updates } : item
      ))
    }
  }, [data, setData])

  const optimisticRemove = useCallback((id: string) => {
    if (data) {
      setData(data.filter(item => (item as any).id !== id))
    }
  }, [data, setData])

  return { optimisticAdd, optimisticUpdate, optimisticRemove }
}