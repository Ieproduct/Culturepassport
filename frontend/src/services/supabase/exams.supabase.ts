import { supabase } from '@/lib/supabase'
import type { IExamsService, ExamScoreWithTemplate, CreateExamTemplateData } from '../types'
import type { ExamTemplate } from '@/types'

export function createSupabaseExamsService(): IExamsService {
  return {
    async fetchExamTemplates() {
      const { data, error } = await supabase
        .from('exam_templates')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return (data ?? []) as ExamTemplate[]
    },

    async createExamTemplate(data: CreateExamTemplateData) {
      const { error } = await supabase.from('exam_templates').insert(data)
      if (error) throw error
    },

    async updateExamTemplate(id, updates: Partial<ExamTemplate>) {
      const { error } = await supabase.from('exam_templates').update(updates).eq('id', id)
      if (error) throw error
    },

    async deleteExamTemplate(id) {
      const { error } = await supabase.from('exam_templates').delete().eq('id', id)
      if (error) throw error
    },

    async fetchExamScores(userId?) {
      let query = supabase.from('exam_scores').select('*')
      if (userId) query = query.eq('user_id', userId)
      const { data, error } = await query.order('taken_at', { ascending: false })
      if (error) throw error

      // Fetch template titles separately
      const scores = data ?? []
      const templateIds = [...new Set(scores.map((s) => s.exam_template_id))]
      let templateMap = new Map<string, string>()
      if (templateIds.length > 0) {
        const { data: templates } = await supabase
          .from('exam_templates')
          .select('id, title')
          .in('id', templateIds)
        templateMap = new Map((templates ?? []).map((t) => [t.id, t.title]))
      }

      return scores.map((s) => ({
        ...s,
        exam_template_title: templateMap.get(s.exam_template_id),
      })) as ExamScoreWithTemplate[]
    },
  }
}
