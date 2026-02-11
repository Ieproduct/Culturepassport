import type { IExamsService, ExamScoreWithTemplate, CreateExamTemplateData } from '../types'
import type { ExamTemplate } from '@/types'
import { get, post, put, del } from './http-client'

export function createApiExamsService(): IExamsService {
  return {
    async fetchExamTemplates() {
      return get<ExamTemplate[]>('/exams/templates')
    },

    async createExamTemplate(data: CreateExamTemplateData) {
      await post('/exams/templates', data)
    },

    async updateExamTemplate(id, updates) {
      await put(`/exams/templates/${id}`, updates)
    },

    async deleteExamTemplate(id) {
      await del(`/exams/templates/${id}`)
    },

    async fetchExamScores(userId?) {
      const query = userId ? `?user_id=${userId}` : ''
      return get<ExamScoreWithTemplate[]>(`/exams/scores${query}`)
    },
  }
}
