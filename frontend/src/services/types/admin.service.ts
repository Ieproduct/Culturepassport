import type { Profile } from '@/types'

export type CreateUserData = {
  email: string
  password: string
  full_name: string
  role: string
  company_name: string
  department_name: string
  position_name: string
  level_name: string
  approver_name: string
}

export type OverviewStats = {
  totalEmployees: number
  totalMissions: number
  completionRate: number
  pendingCount: number
  allUserMissions: Array<{ id: string; status: string }>
}

export type ExportRow = {
  mission_title: string
  user_name: string
  user_email: string
  user_role: string
  status: string
  feedback_score: number | null
  started_at: string | null
  submitted_at: string | null
  reviewed_at: string | null
}

export type PendingMission = {
  id: string
  mission_id: string
  user_id: string
  status: string
  submitted_content: string | null
  submitted_file_url: string | null
  submitted_at: string | null
  mission_title: string
  employee_name: string
}

export type TeamMember = Profile & {
  total_missions: number
  completed_missions: number
  pending_review: number
  progress_percent: number
}

export type TeamMemberExamScore = {
  title: string
  score: number
  total: number
  passed: boolean
}

export interface IAdminService {
  createUser(data: CreateUserData): Promise<void>
  getOverviewStats(): Promise<OverviewStats>
  fetchExportData(profileFilter?: string[]): Promise<ExportRow[]>
  fetchPendingMissions(): Promise<PendingMission[]>
  reviewMission(
    id: string,
    approved: boolean,
    score: number,
    feedback: string,
  ): Promise<void>
  fetchTeamMembers(filters?: {
    companyId?: string
    departmentId?: string
    positionId?: string
  }): Promise<TeamMember[]>
  fetchMemberExamScores(memberId: string): Promise<TeamMemberExamScore[]>
}
