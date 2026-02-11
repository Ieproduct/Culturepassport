import type { Mission } from '@/types'

export type MissionWithCategory = Mission & {
  categories?: { name: string }
}

export type CreateMissionData = {
  title: string
  description: string
  category_id?: string | null
  estimated_duration?: string | null
}

export interface IMissionsService {
  fetchMissions(): Promise<MissionWithCategory[]>
  createMission(data: CreateMissionData): Promise<void>
  updateMission(id: string, updates: Partial<Mission>): Promise<void>
  deleteMission(id: string): Promise<void>
}
