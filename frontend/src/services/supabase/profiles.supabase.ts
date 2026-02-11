import { supabase } from '@/lib/supabase'
import type { IProfilesService, ProfileFilters } from '../types'
import type { Profile } from '@/types'

export function createSupabaseProfilesService(): IProfilesService {
  return {
    async fetchProfiles(filters?: ProfileFilters) {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })

      if (filters?.companyId) query = query.eq('company_id', filters.companyId)
      if (filters?.departmentId) query = query.eq('department_id', filters.departmentId)
      if (filters?.positionId) query = query.eq('position_id', filters.positionId)
      if (filters?.role) query = query.eq('role', filters.role as 'admin' | 'manager' | 'employee')
      if (filters?.search) query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)

      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Profile[]
    },

    async updateProfile(id, updates) {
      const { error } = await supabase.from('profiles').update(updates).eq('id', id)
      if (error) throw error
    },

    async deactivateProfile(id) {
      const { error } = await supabase.from('profiles').update({ status: 'inactive' }).eq('id', id)
      if (error) throw error
    },
  }
}
