import { useState, useEffect, useMemo } from 'react'
import { Box, FormControl, InputLabel, Select, MenuItem, Button, Alert, Checkbox, Typography, Card, CardContent, Stack, Chip } from '@mui/material'
import { CascadingFilter } from '@/components/common/CascadingFilter'
import { useMissions } from '@/hooks/useMissions'
import { useProfiles } from '@/hooks/useProfiles'
import { useUserMissions } from '@/hooks/useUserMissions'
import { useCascadingFilter } from '@/hooks/useCascadingFilter'

export function AssignTab() {
  const { missions } = useMissions()
  const { profiles, fetchProfiles } = useProfiles()
  const { assignMissions, error: assignError } = useUserMissions()
  const filter = useCascadingFilter()

  const [selectedMissionId, setSelectedMissionId] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [success, setSuccess] = useState('')
  const [warning, setWarning] = useState('')

  const employees = useMemo(() => profiles.filter((p) => p.role === 'employee' && p.status === 'active'), [profiles])

  useEffect(() => {
    fetchProfiles({
      companyId: filter.selectedCompany ?? undefined,
      departmentId: filter.selectedDepartment ?? undefined,
      positionId: filter.selectedPosition ?? undefined,
      role: 'employee',
    })
  }, [filter.selectedCompany, filter.selectedDepartment, filter.selectedPosition, fetchProfiles])

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId])
  }

  const selectAll = () => {
    setSelectedUserIds(employees.map((e) => e.id))
  }

  const handleAssign = async () => {
    if (!selectedMissionId || selectedUserIds.length === 0) return
    setSuccess('')
    setWarning('')

    try {
      await assignMissions(selectedMissionId, selectedUserIds)
      setSuccess(`มอบหมาย Mission สำเร็จให้ ${selectedUserIds.length} คน`)
      setSelectedUserIds([])
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('duplicate') || msg.includes('unique')) {
        setWarning('บางคนได้รับ Mission นี้แล้ว — ข้ามรายการซ้ำ')
      }
    }
  }

  return (
    <Box>
      {assignError && <Alert severity="error" sx={{ mb: 2 }}>{assignError}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      {warning && <Alert severity="warning" sx={{ mb: 2 }}>{warning}</Alert>}

      <Stack spacing={3}>
        {/* Mission Selector */}
        <FormControl fullWidth required>
          <InputLabel>เลือก Mission</InputLabel>
          <Select value={selectedMissionId} label="เลือก Mission" onChange={(e) => setSelectedMissionId(e.target.value)}>
            {missions.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.title}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Cascading Filter */}
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

        {/* Employee List */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="subtitle1" fontWeight={600}>
              พนักงาน ({employees.length} คน) — เลือก {selectedUserIds.length} คน
            </Typography>
            <Button size="small" onClick={selectAll}>เลือกทั้งหมด</Button>
          </Box>

          {employees.length === 0 ? (
            <Typography color="text.secondary">ไม่พบพนักงาน</Typography>
          ) : (
            <Stack spacing={1}>
              {employees.map((emp) => (
                <Card
                  key={emp.id}
                  variant="outlined"
                  sx={{ cursor: 'pointer', bgcolor: selectedUserIds.includes(emp.id) ? 'action.selected' : 'transparent' }}
                  onClick={() => toggleUser(emp.id)}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '8px !important' }}>
                    <Checkbox checked={selectedUserIds.includes(emp.id)} />
                    <Box flex={1}>
                      <Typography variant="body2" fontWeight={500}>{emp.full_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{emp.email}</Typography>
                    </Box>
                    <Chip label={emp.role} size="small" />
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>

        {/* Assign Button */}
        <Button
          variant="contained"
          size="large"
          disabled={!selectedMissionId || selectedUserIds.length === 0}
          onClick={handleAssign}
          sx={{ alignSelf: 'flex-start' }}
        >
          มอบหมาย Mission ({selectedUserIds.length} คน)
        </Button>
      </Stack>
    </Box>
  )
}
