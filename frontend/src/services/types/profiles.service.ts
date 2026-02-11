import type { Profile } from '@/types'

export type ProfileFilters = {
  companyId?: string
  departmentId?: string
  positionId?: string
  search?: string
  role?: string
}

export interface IProfilesService {
  fetchProfiles(filters?: ProfileFilters): Promise<Profile[]>
  updateProfile(id: string, updates: Partial<Profile>): Promise<void>
  deactivateProfile(id: string): Promise<void>
}
