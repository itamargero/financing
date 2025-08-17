import { useApi, useMutation, useOptimisticUpdate } from './use-api'
import { leadApi } from '@/lib/api'
import { Lead } from '@/lib/database'
import { useState, useCallback } from 'react'

export function useLeads(filters?: { status?: string; lenderId?: string; limit?: number }) {
  const { data: leads, loading, error, refetch } = useApi(
    () => leadApi.getAll(filters),
    [filters?.status, filters?.lenderId, filters?.limit]
  )
  const [localLeads, setLocalLeads] = useState<Lead[]>([])
  
  // Update local state when API data changes
  if (leads && localLeads !== leads) {
    setLocalLeads(leads)
  }

  const { optimisticUpdate } = useOptimisticUpdate(localLeads, setLocalLeads)

  // Mutations
  const updateStatusMutation = useMutation(({ id, status, notes }: { 
    id: string; 
    status: string; 
    notes?: string 
  }) => leadApi.updateStatus(id, status, notes))

  const assignMutation = useMutation(({ id, assignedTo }: { 
    id: string; 
    assignedTo: string 
  }) => leadApi.assign(id, assignedTo))

  const addNoteMutation = useMutation(({ id, note }: { 
    id: string; 
    note: string 
  }) => leadApi.addNote(id, note))

  const updateLeadStatus = useCallback(async (id: string, status: string, notes?: string) => {
    optimisticUpdate(id, { status })
    try {
      const updatedLead = await updateStatusMutation.mutate({ id, status, notes })
      return updatedLead
    } catch (error) {
      await refetch()
      throw error
    }
  }, [updateStatusMutation, optimisticUpdate, refetch])

  const assignLead = useCallback(async (id: string, assignedTo: string) => {
    optimisticUpdate(id, { assigned_to: assignedTo })
    try {
      const updatedLead = await assignMutation.mutate({ id, assignedTo })
      return updatedLead
    } catch (error) {
      await refetch()
      throw error
    }
  }, [assignMutation, optimisticUpdate, refetch])

  const addLeadNote = useCallback(async (id: string, note: string) => {
    try {
      const updatedLead = await addNoteMutation.mutate({ id, note })
      // Refresh to get updated notes
      await refetch()
      return updatedLead
    } catch (error) {
      throw error
    }
  }, [addNoteMutation, refetch])

  return {
    leads: localLeads,
    loading,
    error,
    refetch,
    updateLeadStatus,
    assignLead,
    addLeadNote,
    mutations: {
      updateStatus: updateStatusMutation,
      assign: assignMutation,
      addNote: addNoteMutation,
    }
  }
}

export function useLead(id: string) {
  return useApi(() => leadApi.getById(id), [id])
}

export function useLeadStatistics() {
  return useApi(leadApi.getStatistics)
}