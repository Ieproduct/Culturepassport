import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Mission } from '@/types'

export function useMissions() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('missions')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
      if (fetchError) throw fetchError

      // Fetch category names separately
      const categoryIds = [...new Set((data ?? []).filter((m) => m.category_id).map((m) => m.category_id!))]
      const categoryMap = new Map<string, string>()
      if (categoryIds.length > 0) {
        const { data: cats } = await supabase.from('categories').select('id, name').in('id', categoryIds)
        ;(cats ?? []).forEach((c) => categoryMap.set(c.id, c.name))
      }

      // Attach category info as extra field for display
      const enriched = (data ?? []).map((m) => ({
        ...m,
        categories: m.category_id ? { name: categoryMap.get(m.category_id) ?? '' } : undefined,
      }))
      setMissions(enriched as typeof data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch missions')
    } finally {
      setLoading(false)
    }
  }, [])

  const createMission = useCallback(async (data: { title: string; description: string; category_id?: string | null; estimated_duration?: string | null }) => {
    setError(null)
    try {
      const { error: insertError } = await supabase.from('missions').insert(data)
      if (insertError) throw insertError
      await fetchMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create mission')
      throw err
    }
  }, [fetchMissions])

  const updateMission = useCallback(async (id: string, updates: Partial<Mission>) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('missions').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
      if (updateError) throw updateError
      await fetchMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mission')
      throw err
    }
  }, [fetchMissions])

  const deleteMission = useCallback(async (id: string) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('missions').update({ is_deleted: true }).eq('id', id)
      if (updateError) throw updateError
      // Cancel related user_missions
      await supabase.from('user_missions').update({ status: 'cancelled' }).eq('mission_id', id).in('status', ['not_started', 'in_progress'])
      await fetchMissions()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete mission')
      throw err
    }
  }, [fetchMissions])

  useEffect(() => { fetchMissions() }, [fetchMissions])

  return { missions, loading, error, fetchMissions, createMission, updateMission, deleteMission }
}
