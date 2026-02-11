import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/services'
import type { Announcement } from '@/types'

export function useAnnouncements(_userId?: string) {
  const { announcements: announcementsService } = useServices()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnnouncements = useCallback(async (activeOnly?: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const data = await announcementsService.fetchAnnouncements(activeOnly)
      setAnnouncements(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch announcements')
    } finally {
      setLoading(false)
    }
  }, [announcementsService])

  const createAnnouncement = useCallback(async (data: { title: string; content: string }) => {
    setError(null)
    try {
      await announcementsService.createAnnouncement(data)
      await fetchAnnouncements()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create announcement')
      throw err
    }
  }, [announcementsService, fetchAnnouncements])

  const updateAnnouncement = useCallback(async (id: string, updates: Partial<Announcement>) => {
    setError(null)
    try {
      await announcementsService.updateAnnouncement(id, updates)
      await fetchAnnouncements()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update announcement')
      throw err
    }
  }, [announcementsService, fetchAnnouncements])

  const deleteAnnouncement = useCallback(async (id: string) => {
    setError(null)
    try {
      await announcementsService.deleteAnnouncement(id)
      await fetchAnnouncements()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete announcement')
      throw err
    }
  }, [announcementsService, fetchAnnouncements])

  const dismissAnnouncement = useCallback(async (announcementId: string, uid: string) => {
    setError(null)
    try {
      await announcementsService.dismissAnnouncement(announcementId, uid)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to dismiss announcement')
      throw err
    }
  }, [announcementsService])

  const getUndismissedAnnouncements = useCallback(async (uid: string): Promise<Announcement[]> => {
    try {
      return await announcementsService.getUndismissedAnnouncements(uid)
    } catch {
      return []
    }
  }, [announcementsService])

  useEffect(() => { fetchAnnouncements() }, [fetchAnnouncements])

  return { announcements, loading, error, fetchAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, dismissAnnouncement, getUndismissedAnnouncements }
}
