import type { RoadmapMilestone } from '@/types'

export type CreateMilestoneData = {
  title: string
  description?: string | null
  target_day: number
  sort_order?: number
}

export interface IRoadmapService {
  fetchMilestones(): Promise<RoadmapMilestone[]>
  createMilestone(data: CreateMilestoneData): Promise<void>
  updateMilestone(id: string, updates: Partial<RoadmapMilestone>): Promise<void>
  deleteMilestone(id: string): Promise<void>
}
