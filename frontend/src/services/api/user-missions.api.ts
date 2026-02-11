import type { IUserMissionsService, UserMissionWithRelations, UserMissionFilters } from '../types'
import { get, post, put } from './http-client'

export function createApiUserMissionsService(): IUserMissionsService {
  return {
    async fetchUserMissions(filters?: UserMissionFilters) {
      const params = new URLSearchParams()
      if (filters?.userId) params.set('user_id', filters.userId)
      if (filters?.status) params.set('status', filters.status)
      if (filters?.missionId) params.set('mission_id', filters.missionId)
      const query = params.toString()
      return get<UserMissionWithRelations[]>(`/user-missions${query ? `?${query}` : ''}`)
    },

    async assignMissions(missionId, userIds) {
      await post('/user-missions/assign', { mission_id: missionId, user_ids: userIds })
    },

    async startMission(id) {
      await put(`/user-missions/${id}/start`, {})
    },

    async submitMission(id, content?, fileUrl?) {
      await put(`/user-missions/${id}/submit`, {
        submitted_content: content || null,
        submitted_file_url: fileUrl || null,
      })
    },

    async reviewMission(id, approved, score, feedback) {
      await put(`/user-missions/${id}/review`, { approved, score, feedback })
    },
  }
}
