import type { IAuthService } from './auth.service'
import type { IProfilesService } from './profiles.service'
import type { IMissionsService } from './missions.service'
import type { IUserMissionsService } from './user-missions.service'
import type { IAnnouncementsService } from './announcements.service'
import type { IRoadmapService } from './roadmap.service'
import type { IMasterDataService } from './master-data.service'
import type { IExamsService } from './exams.service'
import type { IStorageService } from './storage.service'
import type { IAdminService } from './admin.service'

export type { IAuthService, AuthEvent, AuthUser, AuthSessionData } from './auth.service'
export type { IProfilesService, ProfileFilters } from './profiles.service'
export type { IMissionsService, MissionWithCategory, CreateMissionData } from './missions.service'
export type { IUserMissionsService, UserMissionWithRelations, UserMissionFilters } from './user-missions.service'
export type { IAnnouncementsService } from './announcements.service'
export type { IRoadmapService, CreateMilestoneData } from './roadmap.service'
export type { IMasterDataService } from './master-data.service'
export type { IExamsService, ExamScoreWithTemplate, CreateExamTemplateData } from './exams.service'
export type { IStorageService, UploadOptions } from './storage.service'
export type {
  IAdminService,
  CreateUserData,
  OverviewStats,
  ExportRow,
  PendingMission,
  TeamMember,
  TeamMemberExamScore,
} from './admin.service'

export type Services = {
  auth: IAuthService
  profiles: IProfilesService
  missions: IMissionsService
  userMissions: IUserMissionsService
  announcements: IAnnouncementsService
  roadmap: IRoadmapService
  masterData: IMasterDataService
  exams: IExamsService
  storage: IStorageService
  admin: IAdminService
}
