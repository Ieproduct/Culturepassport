import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ExamTemplate, ExamScore } from '@/types'

type ExamScoreWithTemplate = ExamScore & { exam_template_title?: string }

export function useExams() {
  const [examTemplates, setExamTemplates] = useState<ExamTemplate[]>([])
  const [examScores, setExamScores] = useState<ExamScoreWithTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchExamTemplates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase.from('exam_templates').select('*').order('created_at', { ascending: false })
      if (fetchError) throw fetchError
      setExamTemplates(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exam templates')
    } finally {
      setLoading(false)
    }
  }, [])

  const createExamTemplate = useCallback(async (data: { title: string; description?: string | null; passing_score: number; questions: ExamTemplate['questions'] }) => {
    setError(null)
    try {
      const { error: insertError } = await supabase.from('exam_templates').insert(data)
      if (insertError) throw insertError
      await fetchExamTemplates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create exam template')
      throw err
    }
  }, [fetchExamTemplates])

  const updateExamTemplate = useCallback(async (id: string, updates: Partial<ExamTemplate>) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('exam_templates').update(updates).eq('id', id)
      if (updateError) throw updateError
      await fetchExamTemplates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update exam template')
      throw err
    }
  }, [fetchExamTemplates])

  const deleteExamTemplate = useCallback(async (id: string) => {
    setError(null)
    try {
      const { error: deleteError } = await supabase.from('exam_templates').delete().eq('id', id)
      if (deleteError) throw deleteError
      await fetchExamTemplates()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete exam template')
      throw err
    }
  }, [fetchExamTemplates])

  const fetchExamScores = useCallback(async (userId?: string) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('exam_scores').select('*')
      if (userId) query = query.eq('user_id', userId)
      const { data, error: fetchError } = await query.order('taken_at', { ascending: false })
      if (fetchError) throw fetchError

      // Fetch template titles separately
      const scores = data ?? []
      const templateIds = [...new Set(scores.map((s) => s.exam_template_id))]
      const { data: templates } = await supabase.from('exam_templates').select('id, title').in('id', templateIds)
      const templateMap = new Map((templates ?? []).map((t) => [t.id, t.title]))

      setExamScores(scores.map((s) => ({
        ...s,
        exam_template_title: templateMap.get(s.exam_template_id),
      })))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exam scores')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchExamTemplates() }, [fetchExamTemplates])

  return { examTemplates, examScores, loading, error, fetchExamTemplates, createExamTemplate, updateExamTemplate, deleteExamTemplate, fetchExamScores }
}
