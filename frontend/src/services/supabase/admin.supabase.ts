import { supabase } from '@/lib/supabase'
import type {
  IAdminService,
  CreateUserData,
  ExportRow,
  PendingMission,
  TeamMember,
  TeamMemberExamScore,
} from '../types'
import type { Profile } from '@/types'

export function createSupabaseAdminService(): IAdminService {
  return {
    async createUser(data: CreateUserData) {
      const { data: result, error } = await supabase.functions.invoke('create-user', {
        body: {
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          role: data.role,
          company_name: data.company_name,
          department_name: data.department_name,
          position_name: data.position_name,
          level_name: data.level_name,
          approver_name: data.approver_name,
        },
      })
      if (error) throw error
      if (result?.error) throw new Error(result.error)
    },

    async getOverviewStats() {
      const [profilesRes, missionsRes, userMissionsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'employee').eq('status', 'active'),
        supabase.from('missions').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
        supabase.from('user_missions').select('id, status'),
      ])

      if (profilesRes.error) throw profilesRes.error
      if (missionsRes.error) throw missionsRes.error
      if (userMissionsRes.error) throw userMissionsRes.error

      const totalEmployees = profilesRes.count ?? 0
      const totalMissions = missionsRes.count ?? 0
      const allUserMissions = userMissionsRes.data ?? []
      const approved = allUserMissions.filter((um) => um.status === 'approved').length
      const completionRate = allUserMissions.length > 0 ? Math.round((approved / allUserMissions.length) * 100) : 0
      const pendingCount = allUserMissions.filter((um) => um.status === 'submitted').length

      return {
        totalEmployees,
        totalMissions,
        completionRate,
        pendingCount,
        allUserMissions: allUserMissions as Array<{ id: string; status: string }>,
      }
    },

    async fetchExportData(profileFilter?) {
      let query = supabase.from('user_missions').select('*')
      if (profileFilter && profileFilter.length > 0) {
        query = query.in('user_id', profileFilter)
      }

      const { data, error } = await query
      if (error) throw error

      const rows = data ?? []

      // Fetch related missions and profiles
      const missionIds = [...new Set(rows.map((r) => r.mission_id))]
      const userIds = [...new Set(rows.map((r) => r.user_id))]

      const [missionsRes, profilesRes] = await Promise.all([
        missionIds.length > 0 ? supabase.from('missions').select('id, title').in('id', missionIds) : { data: [] },
        userIds.length > 0 ? supabase.from('profiles').select('id, full_name, email, role').in('id', userIds) : { data: [] },
      ])
      const missionMap = new Map((missionsRes.data ?? []).map((m) => [m.id, m]))
      const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p]))

      return rows.map((row): ExportRow => {
        const mission = missionMap.get(row.mission_id)
        const profile = profileMap.get(row.user_id)
        return {
          mission_title: mission?.title ?? '',
          user_name: profile?.full_name ?? '',
          user_email: profile?.email ?? '',
          user_role: profile?.role ?? '',
          status: row.status,
          feedback_score: row.feedback_score,
          started_at: row.started_at,
          submitted_at: row.submitted_at,
          reviewed_at: row.reviewed_at,
        }
      })
    },

    async fetchPendingMissions() {
      const { data, error } = await supabase
        .from('user_missions')
        .select('*')
        .eq('status', 'submitted')
      if (error) throw error

      const rows = data ?? []
      const missionIds = [...new Set(rows.map((r) => r.mission_id))]
      const userIds = [...new Set(rows.map((r) => r.user_id))]

      const [missionsRes, profilesRes] = await Promise.all([
        missionIds.length > 0 ? supabase.from('missions').select('id, title').in('id', missionIds) : { data: [] },
        userIds.length > 0 ? supabase.from('profiles').select('id, full_name').in('id', userIds) : { data: [] },
      ])
      const missionMap = new Map((missionsRes.data ?? []).map((m) => [m.id, m.title]))
      const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p.full_name]))

      return rows.map((item): PendingMission => ({
        id: item.id,
        mission_id: item.mission_id,
        user_id: item.user_id,
        status: item.status,
        submitted_content: item.submitted_content,
        submitted_file_url: item.submitted_file_url,
        submitted_at: item.submitted_at,
        mission_title: missionMap.get(item.mission_id) ?? 'Mission',
        employee_name: profileMap.get(item.user_id) ?? 'Employee',
      }))
    },

    async reviewMission(id, approved, score, feedback) {
      const { error } = await supabase
        .from('user_missions')
        .update({
          status: approved ? 'approved' : 'rejected',
          feedback_score: score,
          feedback_text: feedback || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
      if (error) throw error
    },

    async fetchTeamMembers(filters?) {
      let query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'employee')
        .eq('status', 'active')

      if (filters?.companyId) query = query.eq('company_id', filters.companyId)
      if (filters?.departmentId) query = query.eq('department_id', filters.departmentId)
      if (filters?.positionId) query = query.eq('position_id', filters.positionId)

      const { data: profiles } = await query
      if (!profiles) return []

      // Fetch mission stats for each member
      const enriched: TeamMember[] = await Promise.all(
        profiles.map(async (p) => {
          const { data: missions } = await supabase
            .from('user_missions')
            .select('status')
            .eq('user_id', p.id)

          const total = missions?.length ?? 0
          const completed = missions?.filter((m) => m.status === 'approved').length ?? 0
          const pending = missions?.filter((m) => m.status === 'submitted').length ?? 0

          return {
            ...(p as Profile),
            total_missions: total,
            completed_missions: completed,
            pending_review: pending,
            progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
          }
        }),
      )

      return enriched
    },

    async fetchMemberExamScores(memberId) {
      const { data } = await supabase
        .from('exam_scores')
        .select('*')
        .eq('user_id', memberId)
        .order('taken_at', { ascending: false })

      const scores = data ?? []
      const templateIds = [...new Set(scores.map((s) => s.exam_template_id))]
      const { data: templates } = templateIds.length > 0
        ? await supabase.from('exam_templates').select('id, title').in('id', templateIds)
        : { data: [] }
      const templateMap = new Map((templates ?? []).map((t) => [t.id, t.title]))

      return scores.map((s): TeamMemberExamScore => ({
        title: templateMap.get(s.exam_template_id) ?? 'Exam',
        score: s.score,
        total: s.total,
        passed: s.passed,
      }))
    },
  }
}
