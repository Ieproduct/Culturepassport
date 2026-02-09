import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Announcement } from '@/types'

export function useAnnouncements(_userId?: string) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnnouncements = useCallback(async (activeOnly?: boolean) => {
    setLoading(true)
    setError(null)
    try {
      let query = supabase.from('announcements').select('*').order('published_at', { ascending: false })
      if (activeOnly) query = query.eq('is_active', true)
      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError
      setAnnouncements(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements')
    } finally {
      setLoading(false)
    }
  }, [])

  const createAnnouncement = useCallback(async (data: { title: string; content: string }) => {
    setError(null)
    try {
      const { error: insertError } = await supabase.from('announcements').insert(data)
      if (insertError) throw insertError
      await fetchAnnouncements()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create announcement')
      throw err
    }
  }, [fetchAnnouncements])

  const updateAnnouncement = useCallback(async (id: string, updates: Partial<Announcement>) => {
    setError(null)
    try {
      const { error: updateError } = await supabase.from('announcements').update(updates).eq('id', id)
      if (updateError) throw updateError
      await fetchAnnouncements()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update announcement')
      throw err
    }
  }, [fetchAnnouncements])

  const deleteAnnouncement = useCallback(async (id: string) => {
    setError(null)
    try {
      const { error: deleteError } = await supabase.from('announcements').delete().eq('id', id)
      if (deleteError) throw deleteError
      await fetchAnnouncements()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete announcement')
      throw err
    }
  }, [fetchAnnouncements])

  const dismissAnnouncement = useCallback(async (announcementId: string, uid: string) => {
    setError(null)
    try {
      const { error: insertError } = await supabase.from('announcement_dismissals').insert({ announcement_id: announcementId, user_id: uid })
      if (insertError) throw insertError
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss announcement')
      throw err
    }
  }, [])

  const getUndismissedAnnouncements = useCallback(async (uid: string): Promise<Announcement[]> => {
    try {
      // Get dismissed announcement IDs
      const { data: dismissals } = await supabase.from('announcement_dismissals').select('announcement_id').eq('user_id', uid)
      const dismissedIds = (dismissals ?? []).map((d) => d.announcement_id)

      // Get active announcements
      let query = supabase.from('announcements').select('*').eq('is_active', true).order('published_at', { ascending: false })
      const { data } = await query

      // Filter out dismissed
      return (data ?? []).filter((a) => !dismissedIds.includes(a.id))
    } catch {
      return []
    }
  }, [])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  return { announcements, loading, error, fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, dismissAnnouncement, getUndismissedAnnouncements }
}
