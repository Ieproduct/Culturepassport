import { supabase } from '@/lib/supabase'
import type { IMissionsService, MissionWithCategory, CreateMissionData } from '../types'
import type { Mission } from '@/types'

export function createSupabaseMissionsService(): IMissionsService {
  return {
    async fetchMissions() {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
      if (error) throw error

      // Fetch category names separately
      const rows = data ?? []
      const categoryIds = [...new Set(rows.filter((m) => m.category_id).map((m) => m.category_id!))]
      const categoryMap = new Map<string, string>()
      if (categoryIds.length > 0) {
        const { data: cats } = await supabase.from('categories').select('id, name').in('id', categoryIds)
        ;(cats ?? []).forEach((c) => categoryMap.set(c.id, c.name))
      }

      return rows.map((m) => ({
        ...m,
        categories: m.category_id ? { name: categoryMap.get(m.category_id) ?? '' } : undefined,
      })) as MissionWithCategory[]
    },

    async createMission(data: CreateMissionData) {
      const { error } = await supabase.from('missions').insert(data)
      if (error) throw error
    },

    async updateMission(id, updates: Partial<Mission>) {
      const { error } = await supabase
        .from('missions')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },

    async deleteMission(id) {
      const { error } = await supabase.from('missions').update({ is_deleted: true }).eq('id', id)
      if (error) throw error
      // Cancel related user_missions
      await supabase
        .from('user_missions')
        .update({ status: 'cancelled' })
        .eq('mission_id', id)
        .in('status', ['not_started', 'in_progress'])
    },
  }
}
