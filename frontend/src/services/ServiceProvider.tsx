import { createContext, useMemo, type ReactNode } from 'react'
import type { Services } from './types'

import { createSupabaseAuthService } from './supabase/auth.supabase'
import { createSupabaseProfilesService } from './supabase/profiles.supabase'
import { createSupabaseMissionsService } from './supabase/missions.supabase'
import { createSupabaseUserMissionsService } from './supabase/user-missions.supabase'
import { createSupabaseAnnouncementsService } from './supabase/announcements.supabase'
import { createSupabaseRoadmapService } from './supabase/roadmap.supabase'
import { createSupabaseMasterDataService } from './supabase/master-data.supabase'
import { createSupabaseExamsService } from './supabase/exams.supabase'
import { createSupabaseStorageService } from './supabase/storage.supabase'
import { createSupabaseAdminService } from './supabase/admin.supabase'

import { createApiAuthService } from './api/auth.api'
import { createApiProfilesService } from './api/profiles.api'
import { createApiMissionsService } from './api/missions.api'
import { createApiUserMissionsService } from './api/user-missions.api'
import { createApiAnnouncementsService } from './api/announcements.api'
import { createApiRoadmapService } from './api/roadmap.api'
import { createApiMasterDataService } from './api/master-data.api'
import { createApiExamsService } from './api/exams.api'
import { createApiStorageService } from './api/storage.api'
import { createApiAdminService } from './api/admin.api'

export const ServiceContext = createContext<Services | null>(null)

function createSupabaseServices(): Services {
  return {
    auth: createSupabaseAuthService(),
    profiles: createSupabaseProfilesService(),
    missions: createSupabaseMissionsService(),
    userMissions: createSupabaseUserMissionsService(),
    announcements: createSupabaseAnnouncementsService(),
    roadmap: createSupabaseRoadmapService(),
    masterData: createSupabaseMasterDataService(),
    exams: createSupabaseExamsService(),
    storage: createSupabaseStorageService(),
    admin: createSupabaseAdminService(),
  }
}

function createApiServices(): Services {
  return {
    auth: createApiAuthService(),
    profiles: createApiProfilesService(),
    missions: createApiMissionsService(),
    userMissions: createApiUserMissionsService(),
    announcements: createApiAnnouncementsService(),
    roadmap: createApiRoadmapService(),
    masterData: createApiMasterDataService(),
    exams: createApiExamsService(),
    storage: createApiStorageService(),
    admin: createApiAdminService(),
  }
}

export function ServiceProvider({ children }: { children: ReactNode }) {
  const env = import.meta.env.VITE_ENVIRONMENT as string | undefined

  const services = useMemo(() => {
    if (env === 'prod') return createSupabaseServices()
    return createApiServices()
  }, [env])

  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  )
}
