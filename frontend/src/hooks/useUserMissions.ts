import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/services'
import type { MissionStatus } from '@/types'
import type { UserMissionWithRelations } from '@/services/types'

export function useUserMissions(userId?: string) {
  const { userMissions: umService } = useServices()
  const [userMissions, setUserMissions] = useState<UserMissionWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserMissions = useCallback(async (filters?: { userId?: string; status?: MissionStatus; missionId?: string }) => {
    setLoading(true)
    setError(null)
    try {
      const data = await umService.fetchUserMissions({
        userId: filters?.userId ?? userId,
        status: filters?.status,
        missionId: filters?.missionId,
      })
      setUserMissions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user missions')
    } finally {
      setLoading(false)
    }
  }, [umService, userId])

  const assignMissions = useCallback(async (missionId: string, userIds: string[]) => {
    setError(null)
    try {
      await umService.assignMissions(missionId, userIds)
      await fetchUserMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign missions')
      throw err
    }
  }, [umService, fetchUserMissions])

  const startMission = useCallback(async (id: string) => {
    setError(null)
    try {
      await umService.startMission(id)
      await fetchUserMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start mission')
      throw err
    }
  }, [umService, fetchUserMissions])

  const submitMission = useCallback(async (id: string, content?: string, fileUrl?: string) => {
    setError(null)
    try {
      await umService.submitMission(id, content, fileUrl)
      await fetchUserMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit mission')
      throw err
    }
  }, [umService, fetchUserMissions])

  const reviewMission = useCallback(async (id: string, approved: boolean, score: number, feedback: string) => {
    setError(null)
    try {
      await umService.reviewMission(id, approved, score, feedback)
      await fetchUserMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review mission')
      throw err
    }
  }, [umService, fetchUserMissions])

  useEffect(() => { fetchUserMissions() }, [fetchUserMissions])

  return { userMissions, loading, error, fetchUserMissions, assignMissions, startMission, submitMission, reviewMission }
}
