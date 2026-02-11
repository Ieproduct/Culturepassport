import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/services'
import type { ExamTemplate } from '@/types'
import type { ExamScoreWithTemplate } from '@/services/types'

export function useExams() {
  const { exams: examsService } = useServices()
  const [examTemplates, setExamTemplates] = useState<ExamTemplate[]>([])
  const [examScores, setExamScores] = useState<ExamScoreWithTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExamTemplates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await examsService.fetchExamTemplates()
      setExamTemplates(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exam templates')
    } finally {
      setLoading(false)
    }
  }, [examsService])

  const createExamTemplate = useCallback(async (data: { title: string; description?: string | null; passing_score: number; questions: ExamTemplate['questions'] }) => {
    setError(null)
    try {
      await examsService.createExamTemplate(data)
      await fetchExamTemplates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create exam template')
      throw err
    }
  }, [examsService, fetchExamTemplates])

  const updateExamTemplate = useCallback(async (id: string, updates: Partial<ExamTemplate>) => {
    setError(null)
    try {
      await examsService.updateExamTemplate(id, updates)
      await fetchExamTemplates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update exam template')
      throw err
    }
  }, [examsService, fetchExamTemplates])

  const deleteExamTemplate = useCallback(async (id: string) => {
    setError(null)
    try {
      await examsService.deleteExamTemplate(id)
      await fetchExamTemplates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete exam template')
      throw err
    }
  }, [examsService, fetchExamTemplates])

  const fetchExamScores = useCallback(async (userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await examsService.fetchExamScores(userId)
      setExamScores(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exam scores')
    } finally {
      setLoading(false)
    }
  }, [examsService])

  useEffect(() => { fetchExamTemplates() }, [fetchExamTemplates])

  return { examTemplates, examScores, loading, error, fetchExamTemplates, createExamTemplate, updateExamTemplate, deleteExamTemplate, fetchExamScores }
}
