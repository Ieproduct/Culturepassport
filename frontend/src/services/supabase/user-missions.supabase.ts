import { supabase } from '@/lib/supabase'
import type { IUserMissionsService, UserMissionWithRelations, UserMissionFilters } from '../types'
import type { MissionStatus } from '@/types'

export function createSupabaseUserMissionsService(): IUserMissionsService {
  return {
    async fetchUserMissions(filters?: UserMissionFilters) {
      let query = supabase.from('user_missions').select('*')

      if (filters?.userId) query = query.eq('user_id', filters.userId)
      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.missionId) query = query.eq('mission_id', filters.missionId)

      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error

      const rows = data ?? []

      // Fetch related mission titles and user names
      const missionIds = [...new Set(rows.map((r) => r.mission_id))]
      const userIds = [...new Set(rows.map((r) => r.user_id))]

      const [missionsRes, profilesRes] = await Promise.all([
        missionIds.length > 0
          ? supabase.from('missions').select('id, title, description').in('id', missionIds)
          : { data: [] },
        userIds.length > 0
          ? supabase.from('profiles').select('id, full_name').in('id', userIds)
          : { data: [] },
      ])

      const missionMap = new Map((missionsRes.data ?? []).map((m) => [m.id, m]))
      const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p]))

      return rows.map((um) => ({
        ...um,
        mission_title: missionMap.get(um.mission_id)?.title,
        mission_description: missionMap.get(um.mission_id)?.description,
        user_full_name: profileMap.get(um.user_id)?.full_name,
      })) as UserMissionWithRelations[]
    },

    async assignMissions(missionId, userIds) {
      const inserts = userIds.map((uid) => ({ mission_id: missionId, user_id: uid }))
      const { error } = await supabase.from('user_missions').insert(inserts)
      if (error) throw error
    },

    async startMission(id) {
      const { error } = await supabase
        .from('user_missions')
        .update({
          status: 'in_progress' as MissionStatus,
          started_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
    },

    async submitMission(id, content?, fileUrl?) {
      const { error } = await supabase
        .from('user_missions')
        .update({
          status: 'submitted' as MissionStatus,
          submitted_content: content ?? null,
          submitted_file_url: fileUrl ?? null,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
    },

    async reviewMission(id, approved, score, feedback) {
      const { error } = await supabase
        .from('user_missions')
        .update({
          status: (approved ? 'approved' : 'rejected') as MissionStatus,
          feedback_score: score,
          feedback_text: feedback,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
    },
  }
}
