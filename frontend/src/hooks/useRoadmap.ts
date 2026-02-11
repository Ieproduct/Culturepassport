import { useState, useEffect, useCallback } from 'react'
import { useServices } from '@/services'
import type { RoadmapMilestone } from '@/types'

export function useRoadmap() {
  const { roadmap: roadmapService } = useServices()
  const [milestones, setMilestones] = useState<RoadmapMilestone[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMilestones = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await roadmapService.fetchMilestones()
      setMilestones(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch milestones')
    } finally {
      setLoading(false)
    }
  }, [roadmapService])

  const createMilestone = useCallback(async (data: { title: string; description?: string | null; target_day: number; sort_order?: number }) => {
    setError(null)
    try {
      await roadmapService.createMilestone(data)
      await fetchMilestones()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create milestone')
      throw err
    }
  }, [roadmapService, fetchMilestones])

  const updateMilestone = useCallback(async (id: string, updates: Partial<RoadmapMilestone>) => {
    setError(null)
    try {
      await roadmapService.updateMilestone(id, updates)
      await fetchMilestones()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update milestone')
      throw err
    }
  }, [roadmapService, fetchMilestones])

  const deleteMilestone = useCallback(async (id: string) => {
    setError(null)
    try {
      await roadmapService.deleteMilestone(id)
      await fetchMilestones()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete milestone')
      throw err
    }
  }, [roadmapService, fetchMilestones])

  useEffect(() => { fetchMilestones() }, [fetchMilestones])

  return { milestones, loading, error, fetchMilestones, createMilestone, updateMilestone, deleteMilestone }
}
