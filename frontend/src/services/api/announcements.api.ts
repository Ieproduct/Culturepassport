import type { IAnnouncementsService } from '../types'
import type { Announcement } from '@/types'
import { get, post, put, del } from './http-client'

export function createApiAnnouncementsService(): IAnnouncementsService {
  return {
    async fetchAnnouncements(_activeOnly?) {
      return get<Announcement[]>('/announcements')
    },

    async createAnnouncement(data) {
      await post('/announcements', data)
    },

    async updateAnnouncement(id, updates) {
      await put(`/announcements/${id}`, updates)
    },

    async deleteAnnouncement(id) {
      await del(`/announcements/${id}`)
    },

    async dismissAnnouncement(announcementId, _userId) {
      await post(`/announcements/${announcementId}/dismiss`, {})
    },

    async getUndismissedAnnouncements(_userId) {
      return get<Announcement[]>('/announcements/undismissed')
    },
  }
}
