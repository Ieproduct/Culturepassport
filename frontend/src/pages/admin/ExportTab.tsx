import { useState } from 'react'
import { Box, Button, Alert, Typography, Stack, CircularProgress } from '@mui/material'
import { FileDownload } from '@mui/icons-material'
import { CascadingFilter } from '@/components/common/CascadingFilter'
import { useCascadingFilter } from '@/hooks/useCascadingFilter'
import { supabase } from '@/lib/supabase'
import { exportToCSV, exportToJSON } from '@/utils/exportHelpers'

export function ExportTab() {
  const filter = useCascadingFilter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const fetchExportData = async () => {
    // If company filter is set, first get matching profile IDs
    let profileFilter: string[] | null = null
    if (filter.selectedCompany) {
      let profileQuery = supabase.from('profiles').select('id').eq('company_id', filter.selectedCompany)
      if (filter.selectedDepartment) {
        profileQuery = profileQuery.eq('department_id', filter.selectedDepartment)
      }
      const { data: filteredProfiles } = await profileQuery
      profileFilter = (filteredProfiles ?? []).map((p) => p.id)
    }

    let query = supabase.from('user_missions').select('*')
    if (profileFilter && profileFilter.length > 0) {
      query = query.in('user_id', profileFilter)
    }

    const { data, error: fetchError } = await query
    if (fetchError) throw fetchError

    const rows = data ?? []

    // Fetch related missions and profiles
    const missionIds = [...new Set(rows.map((r) => r.mission_id))]
    const userIds = [...new Set(rows.map((r) => r.user_id))]

    const [missionsRes, profilesRes] = await Promise.all([
      missionIds.length > 0 ? supabase.from('missions').select('id, title').in('id', missionIds) : { data: [] },
      userIds.length > 0 ? supabase.from('profiles').select('id, full_name, email, role').in('id', userIds) : { data: [] },
    ])
    const missionMap = new Map((missionsRes.data ?? []).map((m) => [m.id, m]))
    const profileMap = new Map((profilesRes.data ?? []).map((p) => [p.id, p]))

    return rows.map((row) => {
      const mission = missionMap.get(row.mission_id)
      const profile = profileMap.get(row.user_id)
      return {
        mission_title: mission?.title ?? '',
        user_name: profile?.full_name ?? '',
        user_email: profile?.email ?? '',
        user_role: profile?.role ?? '',
        status: row.status,
        feedback_score: row.feedback_score,
        started_at: row.started_at,
        submitted_at: row.submitted_at,
        reviewed_at: row.reviewed_at,
      }
    })
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setLoading(true)
    setError(null)
    setInfo(null)

    try {
      const data = await fetchExportData()
      if (data.length === 0) {
        setInfo('ไม่มีข้อมูลสำหรับส่งออก')
        return
      }

      const filename = `culturepassport-export-${new Date().toISOString().split('T')[0]}`
      if (format === 'csv') {
        exportToCSV(data, filename)
      } else {
        exportToJSON(data, filename)
      }
      setInfo(`ส่งออกสำเร็จ ${data.length} รายการ`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ส่งออกข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: { xs: '100%', sm: 600 } }}>
      <Typography variant="h6" fontWeight={600} mb={3}>ส่งออกข้อมูล</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {info && <Alert severity="info" sx={{ mb: 2 }}>{info}</Alert>}

      <Stack spacing={3}>
        <Box>
          <Typography variant="subtitle2" mb={1}>กรองข้อมูล (ไม่บังคับ)</Typography>
          <CascadingFilter
            companies={filter.companies}
            departments={filter.departments}
            positions={filter.positions}
            selectedCompany={filter.selectedCompany}
            selectedDepartment={filter.selectedDepartment}
            selectedPosition={filter.selectedPosition}
            onCompanyChange={filter.setSelectedCompany}
            onDepartmentChange={filter.setSelectedDepartment}
            onPositionChange={filter.setSelectedPosition}
          />
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <FileDownload />}
            onClick={() => handleExport('csv')}
            disabled={loading}
          >
            Export CSV
          </Button>
          <Button
            variant="outlined"
            startIcon={loading ? <CircularProgress size={20} /> : <FileDownload />}
            onClick={() => handleExport('json')}
            disabled={loading}
          >
            Export JSON
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
