import { supabase } from '@/lib/supabase'
import type { IRoadmapService, CreateMilestoneData } from '../types'
import type { RoadmapMilestone } from '@/types'

export function createSupabaseRoadmapService(): IRoadmapService {
  return {
    async fetchMilestones() {
      const { data, error } = await supabase
        .from('roadmap_milestones')
        .select('*')
        .order('sort_order')
        .order('target_day')
      if (error) throw error
      return (data ?? []) as RoadmapMilestone[]
    },

    async createMilestone(data: CreateMilestoneData) {
      const { error } = await supabase.from('roadmap_milestones').insert(data)
      if (error) throw error
    },

    async updateMilestone(id, updates: Partial<RoadmapMilestone>) {
      const { error } = await supabase.from('roadmap_milestones').update(updates).eq('id', id)
      if (error) throw error
    },

    async deleteMilestone(id) {
      const { error } = await supabase.from('roadmap_milestones').delete().eq('id', id)
      if (error) throw error
    },
  }
}
