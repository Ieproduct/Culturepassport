import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/services'
import type { Profile } from '@/types'
import type { ProfileFilters } from '@/services/types'

export type { ProfileFilters }

export function useProfiles() {
  const { profiles: profilesService } = useServices()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfiles = useCallback(async (filters?: ProfileFilters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await profilesService.fetchProfiles(filters)
      setProfiles(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profiles')
    } finally {
      setLoading(false)
    }
  }, [profilesService])

  const updateProfile = useCallback(async (id: string, updates: Partial<Profile>) => {
    setError(null)
    try {
      await profilesService.updateProfile(id, updates)
      await fetchProfiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    }
  }, [profilesService, fetchProfiles])

  const deleteProfile = useCallback(async (id: string) => {
    setError(null)
    try {
      await profilesService.deactivateProfile(id)
      await fetchProfiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile')
      throw err
    }
  }, [profilesService, fetchProfiles])

  useEffect(() => { fetchProfiles() }, [fetchProfiles])

  return { profiles, loading, error, fetchProfiles, updateProfile, deleteProfile }
}
