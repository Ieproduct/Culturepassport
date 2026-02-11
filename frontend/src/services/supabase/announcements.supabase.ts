import { supabase } from '@/lib/supabase'
import type { IAnnouncementsService } from '../types'
import type { Announcement } from '@/types'

export function createSupabaseAnnouncementsService(): IAnnouncementsService {
  return {
    async fetchAnnouncements(activeOnly?: boolean) {
      let query = supabase.from('announcements').select('*').order('published_at', { ascending: false })
      if (activeOnly) query = query.eq('is_active', true)
      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Announcement[]
    },

    async createAnnouncement(data) {
      const { error } = await supabase.from('announcements').insert(data)
      if (error) throw error
    },

    async updateAnnouncement(id, updates) {
      const { error } = await supabase.from('announcements').update(updates).eq('id', id)
      if (error) throw error
    },

    async deleteAnnouncement(id) {
      const { error } = await supabase.from('announcements').delete().eq('id', id)
      if (error) throw error
    },

    async dismissAnnouncement(announcementId, userId) {
      const { error } = await supabase
        .from('announcement_dismissals')
        .insert({ announcement_id: announcementId, user_id: userId })
      if (error) throw error
    },

    async getUndismissedAnnouncements(userId) {
      // Get dismissed announcement IDs
      const { data: dismissals } = await supabase
        .from('announcement_dismissals')
        .select('announcement_id')
        .eq('user_id', userId)
      const dismissedIds = (dismissals ?? []).map((d) => d.announcement_id)

      // Get active announcements
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false })

      // Filter out dismissed
      return ((data ?? []) as Announcement[]).filter((a) => !dismissedIds.includes(a.id))
    },
  }
}
