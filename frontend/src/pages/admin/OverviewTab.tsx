import { useState, useEffect } from 'react'
import { Box, CircularProgress, Alert } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { People, Assignment, CheckCircle, HourglassEmpty } from '@mui/icons-material'
import { StatsCard } from '@/components/common/StatsCard'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme'

type Stats = {
  totalEmployees: number
  totalMissions: number
  completionRate: number
  pendingCount: number
}

export function OverviewTab() {
  const [stats, setStats] = useState<Stats>({ totalEmployees: 0, totalMissions: 0, completionRate: 0, pendingCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const [profilesRes, missionsRes, userMissionsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'employee').eq('status', 'active'),
          supabase.from('missions').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
          supabase.from('user_missions').select('id, status'),
        ])

        if (profilesRes.error) throw profilesRes.error
        if (missionsRes.error) throw missionsRes.error
        if (userMissionsRes.error) throw userMissionsRes.error

        const totalEmployees = profilesRes.count ?? 0
        const totalMissions = missionsRes.count ?? 0
        const allUserMissions = userMissionsRes.data ?? []
        const approved = allUserMissions.filter((um) => um.status === 'approved').length
        const completionRate = allUserMissions.length > 0 ? Math.round((approved / allUserMissions.length) * 100) : 0
        const pendingCount = allUserMissions.filter((um) => um.status === 'submitted').length

        setStats({ totalEmployees, totalMissions, completionRate, pendingCount })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatsCard
          icon={<People />}
          label="จำนวนพนักงาน"
          value={stats.totalEmployees}
          color={colors.blue[500]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatsCard
          icon={<Assignment />}
          label="จำนวน Missions"
          value={stats.totalMissions}
          color={colors.purple[500]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatsCard
          icon={<CheckCircle />}
          label="อัตราสำเร็จ"
          value={`${stats.completionRate}%`}
          color={colors.green[500]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatsCard
          icon={<HourglassEmpty />}
          label="รอดำเนินการ"
          value={stats.pendingCount}
          color={colors.orange[500]}
        />
      </Grid>
    </Grid>
    </>
  )
}
