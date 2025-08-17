import { useApi, useMutation, useOptimisticUpdate } from './use-api'
import { lenderApi } from '@/lib/api'
import { useState, useCallback } from 'react'

interface Lender {
  id: string
  name: string
  slug: string
  description?: string
  logo_url?: string
  website_url?: string
  phone?: string
  email?: string
  address?: string
  rating: number
  review_count: number
  is_verified: boolean
  is_active: boolean
  minimum_loan_amount?: number
  maximum_loan_amount?: number
  minimum_interest_rate?: number
  maximum_interest_rate?: number
  processing_time_days?: number
  requirements?: string[]
  created_at: string
  updated_at: string
}

export function useLenders() {
  const { data: lenders, loading, error, refetch } = useApi(lenderApi.getAll)
  const [localLenders, setLocalLenders] = useState<Lender[]>([])
  
  // Update local state when API data changes
  if (lenders && localLenders !== lenders) {
    setLocalLenders(lenders)
  }

  const { optimisticAdd, optimisticUpdate, optimisticRemove } = 
    useOptimisticUpdate(localLenders, setLocalLenders)

  // Mutations
  const createMutation = useMutation(lenderApi.create)
  const updateMutation = useMutation(({ id, data }: { id: string; data: Partial<Lender> }) =>
    lenderApi.update(id, data)
  )
  const deleteMutation = useMutation(lenderApi.delete)
  const verifyMutation = useMutation(lenderApi.verify)
  const toggleStatusMutation = useMutation(({ id, isActive }: { id: string; isActive: boolean }) =>
    lenderApi.toggleStatus(id, isActive)
  )

  const createLender = useCallback(async (data: Omit<Lender, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newLender = await createMutation.mutate(data)
      optimisticAdd(newLender)
      return newLender
    } catch (error) {
      // Optimistic update will be reverted by refetch
      await refetch()
      throw error
    }
  }, [createMutation, optimisticAdd, refetch])

  const updateLender = useCallback(async (id: string, data: Partial<Lender>) => {
    optimisticUpdate(id, data)
    try {
      const updatedLender = await updateMutation.mutate({ id, data })
      return updatedLender
    } catch (error) {
      await refetch()
      throw error
    }
  }, [updateMutation, optimisticUpdate, refetch])

  const deleteLender = useCallback(async (id: string) => {
    optimisticRemove(id)
    try {
      await deleteMutation.mutate(id)
    } catch (error) {
      await refetch()
      throw error
    }
  }, [deleteMutation, optimisticRemove, refetch])

  const verifyLender = useCallback(async (id: string) => {
    optimisticUpdate(id, { is_verified: true })
    try {
      const verifiedLender = await verifyMutation.mutate(id)
      return verifiedLender
    } catch (error) {
      await refetch()
      throw error
    }
  }, [verifyMutation, optimisticUpdate, refetch])

  const toggleLenderStatus = useCallback(async (id: string, isActive: boolean) => {
    optimisticUpdate(id, { is_active: isActive })
    try {
      const updatedLender = await toggleStatusMutation.mutate({ id, isActive })
      return updatedLender
    } catch (error) {
      await refetch()
      throw error
    }
  }, [toggleStatusMutation, optimisticUpdate, refetch])

  return {
    lenders: localLenders,
    loading,
    error,
    refetch,
    createLender,
    updateLender,
    deleteLender,
    verifyLender,
    toggleLenderStatus,
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      verify: verifyMutation,
      toggleStatus: toggleStatusMutation,
    }
  }
}

export function useLender(id: string) {
  return useApi(() => lenderApi.getById(id), [id])
}