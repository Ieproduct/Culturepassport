import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

type ProfileFilters = {
  companyId?: string
  departmentId?: string
  positionId?: string
  search?: string
  role?: string
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = useCallback(async (filters?: ProfileFilters) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })

      if (filters?.companyId) query = query.eq('company_id', filters.companyId)
      if (filters?.departmentId) query = query.eq('department_id', filters.departmentId)
      if (filters?.positionId) query = query.eq('position_id', filters.positionId)
      if (filters?.role) query = query.eq('role', filters.role as 'admin' | 'manager' | 'employee')
      if (filters?.search) query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)

      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError
      setProfiles(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfile = useCallback(async (id: string, updates: Partial<Profile>) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('profiles').update(updates).eq('id', id)
      if (updateError) throw updateError
      await fetchProfiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    }
  }, [fetchProfiles])

  const deleteProfile = useCallback(async (id: string) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('profiles').update({ status: 'inactive' }).eq('id', id)
      if (updateError) throw updateError
      await fetchProfiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile')
      throw err
    }
  }, [fetchProfiles])

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  return { profiles, loading, error, fetchProfiles, updateProfile, deleteProfile }
}
