export type { Database, MissionStatus, ExamQuestion } from './database'

export type UserRole = 'admin' | 'manager' | 'employee'

import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type Department = Database['public']['Tables']['departments']['Row']
export type Position = Database['public']['Tables']['positions']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Mission = Database['public']['Tables']['missions']['Row']
export type UserMission = Database['public']['Tables']['user_missions']['Row']
export type ExamTemplate = Database['public']['Tables']['exam_templates']['Row']
export type ExamScore = Database['public']['Tables']['exam_scores']['Row']
export type RoadmapMilestone = Database['public']['Tables']['roadmap_milestones']['Row']
export type Announcement = Database['public']['Tables']['announcements']['Row']
export type AnnouncementDismissal = Database['public']['Tables']['announcement_dismissals']['Row']
