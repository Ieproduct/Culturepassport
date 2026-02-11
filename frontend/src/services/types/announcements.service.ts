import type { Announcement } from '@/types'

export interface IAnnouncementsService {
  fetchAnnouncements(activeOnly?: boolean): Promise<Announcement[]>
  createAnnouncement(data: { title: string; content: string }): Promise<void>
  updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<void>
  deleteAnnouncement(id: string): Promise<void>
  dismissAnnouncement(announcementId: string, userId: string): Promise<void>
  getUndismissedAnnouncements(userId: string): Promise<Announcement[]>
}
