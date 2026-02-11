import { useState } from 'react'
import { Box, Button, Alert, Typography, Stack, CircularProgress } from '@mui/material'
import { FileDownload } from '@mui/icons-material'
import { CascadingFilter } from '@/components/common/CascadingFilter'
import { useCascadingFilter } from '@/hooks/useCascadingFilter'
import { useServices } from '@/services'
import { exportToCSV, exportToJSON } from '@/utils/exportHelpers'

export function ExportTab() {
  const { admin: adminService, profiles: profilesService } = useServices()
  const filter = useCascadingFilter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const fetchExportData = async () => {
    // If company filter is set, first get matching profile IDs
    let profileFilter: string[] | undefined
    if (filter.selectedCompany) {
      const profiles = await profilesService.fetchProfiles({
        companyId: filter.selectedCompany,
        departmentId: filter.selectedDepartment ?? undefined,
      })
      profileFilter = profiles.map((p) => p.id)
    }
    return adminService.fetchExportData(profileFilter)
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
