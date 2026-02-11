import type { IRoadmapService, CreateMilestoneData } from '../types'
import type { RoadmapMilestone } from '@/types'
import { get, post, put, del } from './http-client'

export function createApiRoadmapService(): IRoadmapService {
  return {
    async fetchMilestones() {
      return get<RoadmapMilestone[]>('/roadmap')
    },

    async createMilestone(data: CreateMilestoneData) {
      await post('/roadmap', data)
    },

    async updateMilestone(id, updates) {
      await put(`/roadmap/${id}`, updates)
    },

    async deleteMilestone(id) {
      await del(`/roadmap/${id}`)
    },
  }
}
