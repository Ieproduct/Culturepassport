// Placeholder — replace with: supabase gen types typescript --linked > src/types/database.ts
// This provides type safety until real types are generated from Supabase

export type MissionStatus = 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'cancelled'

export type ExamQuestion = {
  id: string
  text: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options: string[]
  correct_answer: string
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          role: 'admin' | 'manager' | 'employee'
          company_id: string | null
          department_id: string | null
          position_id: string | null
          avatar_url: string | null
          probation_start: string | null
          probation_end: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          role: 'admin' | 'manager' | 'employee'
          company_id?: string | null
          department_id?: string | null
          position_id?: string | null
          avatar_url?: string | null
          probation_start?: string | null
          probation_end?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: 'admin' | 'manager' | 'employee'
          company_id?: string | null
          department_id?: string | null
          position_id?: string | null
          avatar_url?: string | null
          probation_start?: string | null
          probation_end?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          id: string
          name: string
          code: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          created_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          id: string
          name: string
          company_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          company_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          company_id?: string
          created_at?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          id: string
          name: string
          department_id: string
          level: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          department_id: string
          level?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          department_id?: string
          level?: number | null
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          color_code: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color_code?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color_code?: string | null
          created_at?: string
        }
        Relationships: []
      }
      missions: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          estimated_duration: string | null
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          estimated_duration?: string | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          estimated_duration?: string | null
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_missions: {
        Row: {
          id: string
          mission_id: string
          user_id: string
          status: MissionStatus
          submitted_content: string | null
          submitted_file_url: string | null
          feedback_score: number | null
          feedback_text: string | null
          started_at: string | null
          submitted_at: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          mission_id: string
          user_id: string
          status?: MissionStatus
          submitted_content?: string | null
          submitted_file_url?: string | null
          feedback_score?: number | null
          feedback_text?: string | null
          started_at?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          mission_id?: string
          user_id?: string
          status?: MissionStatus
          submitted_content?: string | null
          submitted_file_url?: string | null
          feedback_score?: number | null
          feedback_text?: string | null
          started_at?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      exam_templates: {
        Row: {
          id: string
          title: string
          description: string | null
          passing_score: number
          questions: ExamQuestion[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          passing_score: number
          questions: ExamQuestion[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          passing_score?: number
          questions?: ExamQuestion[]
          created_at?: string
        }
        Relationships: []
      }
      exam_scores: {
        Row: {
          id: string
          exam_template_id: string
          user_id: string
          score: number
          total: number
          passed: boolean
          answers: Record<string, string> | null
          taken_at: string
        }
        Insert: {
          id?: string
          exam_template_id: string
          user_id: string
          score: number
          total: number
          passed: boolean
          answers?: Record<string, string> | null
          taken_at?: string
        }
        Update: {
          id?: string
          exam_template_id?: string
          user_id?: string
          score?: number
          total?: number
          passed?: boolean
          answers?: Record<string, string> | null
          taken_at?: string
        }
        Relationships: []
      }
      roadmap_milestones: {
        Row: {
          id: string
          title: string
          description: string | null
          target_day: number
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          target_day: number
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          target_day?: number
          sort_order?: number
          created_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          is_active: boolean
          published_at: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          is_active?: boolean
          published_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          is_active?: boolean
          published_at?: string
          created_at?: string
        }
        Relationships: []
      }
      announcement_dismissals: {
        Row: {
          id: string
          announcement_id: string
          user_id: string
          dismissed_at: string
        }
        Insert: {
          id?: string
          announcement_id: string
          user_id: string
          dismissed_at?: string
        }
        Update: {
          id?: string
          announcement_id?: string
          user_id?: string
          dismissed_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      get_my_role: {
        Args: Record<string, never>
        Returns: string
      }
    }
  }
}
