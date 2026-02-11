import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/services'
import type { Mission } from '@/types'
import type { MissionWithCategory } from '@/services/types'

export function useMissions() {
  const { missions: missionsService } = useServices()
  const [missions, setMissions] = useState<MissionWithCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await missionsService.fetchMissions()
      setMissions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch missions')
    } finally {
      setLoading(false)
    }
  }, [missionsService])

  const createMission = useCallback(async (data: { title: string; description: string; category_id?: string | null; estimated_duration?: string | null }) => {
    setError(null)
    try {
      await missionsService.createMission(data)
      await fetchMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mission')
      throw err
    }
  }, [missionsService, fetchMissions])

  const updateMission = useCallback(async (id: string, updates: Partial<Mission>) => {
    setError(null)
    try {
      await missionsService.updateMission(id, updates)
      await fetchMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mission')
      throw err
    }
  }, [missionsService, fetchMissions])

  const deleteMission = useCallback(async (id: string) => {
    setError(null)
    try {
      await missionsService.deleteMission(id)
      await fetchMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete mission')
      throw err
    }
  }, [missionsService, fetchMissions])

  useEffect(() => { fetchMissions() }, [fetchMissions])

  return { missions, loading, error, fetchMissions, createMission, updateMission, deleteMission }
}
