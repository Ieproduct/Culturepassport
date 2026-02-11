import type { UserMission, MissionStatus } from '@/types'

export type UserMissionWithRelations = UserMission & {
  mission_title?: string
  mission_description?: string
  user_full_name?: string
}

export type UserMissionFilters = {
  userId?: string
  status?: MissionStatus
  missionId?: string
}

export interface IUserMissionsService {
  fetchUserMissions(filters?: UserMissionFilters): Promise<UserMissionWithRelations[]>
  assignMissions(missionId: string, userIds: string[]): Promise<void>
  startMission(id: string): Promise<void>
  submitMission(id: string, content?: string, fileUrl?: string): Promise<void>
  reviewMission(id: string, approved: boolean, score: number, feedback: string): Promise<void>
}
