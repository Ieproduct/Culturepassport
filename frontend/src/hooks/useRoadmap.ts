import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { RoadmapMilestone } from '@/types'

export function useRoadmap() {
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMilestones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('roadmap_milestones')
        .select('*')
        .order('sort_order')
        .order('target_day')
      if (fetchError) throw fetchError
      setMilestones(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch milestones')
    } finally {
      setLoading(false)
    }
  }, [])

  const createMilestone = useCallback(async (data: { title: string; description?: string | null; target_day: number; sort_order?: number }) => {
    setError(null)
    try {
      const { error: insertError } = await supabase.from('roadmap_milestones').insert(data)
      if (insertError) throw insertError
      await fetchMilestones()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create milestone')
      throw err
    }
  }, [fetchMilestones])

  const updateMilestone = useCallback(async (id: string, updates: Partial<RoadmapMilestone>) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('roadmap_milestones').update(updates).eq('id', id)
      if (updateError) throw updateError
      await fetchMilestones()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update milestone')
      throw err
    }
  }, [fetchMilestones])

  const deleteMilestone = useCallback(async (id: string) => {
    setError(null)
    try {
      const { error: deleteError } = await supabase.from('roadmap_milestones').delete().eq('id', id)
      if (deleteError) throw deleteError
      await fetchMilestones()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete milestone')
      throw err
    }
  }, [fetchMilestones])

  useEffect(() => { fetchMilestones() }, [fetchMilestones])

  return { milestones, loading, error, fetchMilestones, createMilestone, updateMilestone, deleteMilestone }
}
