import type { ExamTemplate, ExamScore } from '@/types'

export type ExamScoreWithTemplate = ExamScore & {
  exam_template_title?: string
}

export type CreateExamTemplateData = {
  title: string
  description?: string | null
  passing_score: number
  questions: ExamTemplate['questions']
}

export interface IExamsService {
  fetchExamTemplates(): Promise<ExamTemplate[]>
  createExamTemplate(data: CreateExamTemplateData): Promise<void>
  updateExamTemplate(id: string, updates: Partial<ExamTemplate>): Promise<void>
  deleteExamTemplate(id: string): Promise<void>
  fetchExamScores(userId?: string): Promise<ExamScoreWithTemplate[]>
}
