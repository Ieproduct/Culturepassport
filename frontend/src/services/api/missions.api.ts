import type { IMissionsService, MissionWithCategory, CreateMissionData } from '../types'
import { get, post, put, del } from './http-client'

export function createApiMissionsService(): IMissionsService {
  return {
    async fetchMissions() {
      return get<MissionWithCategory[]>('/missions')
    },

    async createMission(data: CreateMissionData) {
      await post('/missions', data)
    },

    async updateMission(id, updates) {
      await put(`/missions/${id}`, updates)
    },

    async deleteMission(id) {
      await del(`/missions/${id}`)
    },
  }
}
