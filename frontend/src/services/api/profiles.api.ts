import type { IProfilesService } from '../types'
import type { Profile } from '@/types'
import { get, put } from './http-client'

export function createApiProfilesService(): IProfilesService {
  return {
    async fetchProfiles(filters?) {
      const params = new URLSearchParams()
      if (filters?.role) params.set('role', filters.role)
      if (filters?.companyId) params.set('company_id', filters.companyId)
      if (filters?.departmentId) params.set('department_id', filters.departmentId)
      if (filters?.positionId) params.set('position_id', filters.positionId)
      const query = params.toString()
      const profiles = await get<Profile[]>(`/profiles${query ? `?${query}` : ''}`)

      // Client-side search filter (same as Supabase implementation)
      if (filters?.search) {
        const lower = filters.search.toLowerCase()
        return profiles.filter(
          (p) =>
            p.full_name.toLowerCase().includes(lower) ||
            p.email.toLowerCase().includes(lower),
        )
      }
      return profiles
    },

    async updateProfile(id, updates) {
      await put(`/profiles/${id}`, updates)
    },

    async deactivateProfile(id) {
      await put(`/profiles/${id}/deactivate`, {})
    },
  }
}
