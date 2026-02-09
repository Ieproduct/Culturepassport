import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { UserMission, MissionStatus } from '@/types'

type UserMissionWithRelations = UserMission & {
  mission_title?: string
  mission_description?: string
  user_full_name?: string
}

export function useUserMissions(userId?: string) {
  const [userMissions, setUserMissions] = useState<UserMissionWithRelations[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserMissions = useCallback(async (filters?: { userId?: string; status?: MissionStatus; missionId?: string }) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('user_missions').select('*')

      const uid = filters?.userId ?? userId
      if (uid) query = query.eq('user_id', uid)
      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.missionId) query = query.eq('mission_id', filters.missionId)

      const { data, error: fetchError } = await query.order('created_at', { ascending: false })
      if (fetchError) throw fetchError

      const rows = data ?? []

      // Fetch related mission titles and user names
      const missionIds = [...new Set(rows.map((r) => r.mission_id))]
      const userIds = [...new Set(rows.map((r) => r.user_id))]

      const [missionsRes, profilesRes] = await Promise.all([
        missionIds.length > 0 ? supabase.from('missions').select('id, title, description').in('id', missionIds) : { data: [] },
        userIds.length > 0 ? supabase.from('profiles').select('id, full_name').in('id', userIds) : { data: [] },
      ])

      const missionMap = new Map((missionsRes.data ?? []).map((m) => [m.id, m]))
      const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p]))

      const transformed: UserMissionWithRelations[] = rows.map((um) => ({
        ...um,
        mission_title: missionMap.get(um.mission_id)?.title,
        mission_description: missionMap.get(um.mission_id)?.description,
        user_full_name: profileMap.get(um.user_id)?.full_name,
      }))
      setUserMissions(transformed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user missions')
    } finally {
      setLoading(false)
    }
  }, [userId])

  const assignMissions = useCallback(async (missionId: string, userIds: string[]) => {
    setError(null)
    try {
      const inserts = userIds.map((uid) => ({ mission_id: missionId, user_id: uid }))
      const { error: insertError } = await supabase.from('user_missions').insert(inserts)
      if (insertError) throw insertError
      await fetchUserMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign missions')
      throw err
    }
  }, [fetchUserMissions])

  const startMission = useCallback(async (id: string) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('user_missions').update({ status: 'in_progress' as MissionStatus, started_at: new Date().toISOString() }).eq('id', id)
      if (updateError) throw updateError
      await fetchUserMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start mission')
      throw err
    }
  }, [fetchUserMissions])

  const submitMission = useCallback(async (id: string, content?: string, fileUrl?: string) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('user_missions').update({
        status: 'submitted' as MissionStatus,
        submitted_content: content ?? null,
        submitted_file_url: fileUrl ?? null,
        submitted_at: new Date().toISOString(),
      }).eq('id', id)
      if (updateError) throw updateError
      await fetchUserMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit mission')
      throw err
    }
  }, [fetchUserMissions])

  const reviewMission = useCallback(async (id: string, approved: boolean, score: number, feedback: string) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('user_missions').update({
        status: (approved ? 'approved' : 'rejected') as MissionStatus,
        feedback_score: score,
        feedback_text: feedback,
        reviewed_at: new Date().toISOString(),
      }).eq('id', id)
      if (updateError) throw updateError
      await fetchUserMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to review mission')
      throw err
    }
  }, [fetchUserMissions])

  useEffect(() => { fetchUserMissions() }, [fetchUserMissions])

  return { userMissions, loading, error, fetchUserMissions, assignMissions, startMission, submitMission, reviewMission }
}
