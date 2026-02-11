import type {
  IAdminService,
  CreateUserData,
  OverviewStats,
  ExportRow,
  PendingMission,
  TeamMember,
  TeamMemberExamScore,
} from '../types'
import { get, post, put } from './http-client'

export function createApiAdminService(): IAdminService {
  return {
    async createUser(data: CreateUserData) {
      await post('/admin/create-user', data)
    },

    async getOverviewStats() {
      return get<OverviewStats>('/admin/overview-stats')
    },

    async fetchExportData(profileFilter?) {
      const query = profileFilter?.length
        ? `?user_ids=${profileFilter.join(',')}`
        : ''
      return get<ExportRow[]>(`/admin/export-data${query}`)
    },

    async fetchPendingMissions() {
      return get<PendingMission[]>('/admin/pending-missions')
    },

    async reviewMission(id, approved, score, feedback) {
      await put(`/user-missions/${id}/review`, { approved, score, feedback })
    },

    async fetchTeamMembers(filters?) {
      const params = new URLSearchParams()
      if (filters?.companyId) params.set('company_id', filters.companyId)
      if (filters?.departmentId) params.set('department_id', filters.departmentId)
      if (filters?.positionId) params.set('position_id', filters.positionId)
      const query = params.toString()
      return get<TeamMember[]>(`/admin/team-members${query ? `?${query}` : ''}`)
    },

    async fetchMemberExamScores(memberId) {
      return get<TeamMemberExamScore[]>(`/admin/member-exam-scores/${memberId}`)
    },
  }
}
