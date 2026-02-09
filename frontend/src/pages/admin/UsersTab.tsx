import { useState, useEffect, useMemo } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataTable } from '@/components/common/DataTable'
import { CascadingFilter } from '@/components/common/CascadingFilter'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useProfiles } from '@/hooks/useProfiles'
import { useCascadingFilter } from '@/hooks/useCascadingFilter'
import type { Profile, UserRole } from '@/types'

export function UsersTab() {
  const { profiles, loading, error, fetchProfiles, updateProfile, deleteProfile } = useProfiles()
  const filter = useCascadingFilter()

  const [editUser, setEditUser] = useState<Profile | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('employee')
  const [editName, setEditName] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    fetchProfiles({
      companyId: filter.selectedCompany ?? undefined,
      departmentId: filter.selectedDepartment ?? undefined,
      positionId: filter.selectedPosition ?? undefined,
    })
  }, [filter.selectedCompany, filter.selectedDepartment, filter.selectedPosition, fetchProfiles])

  const activeProfiles = useMemo(() => profiles.filter((p) => p.status === 'active'), [profiles])

  const columns: GridColDef[] = [
    { field: 'full_name', headerName: 'ชื่อ', flex: 1, minWidth: 150 },
    { field: 'email', headerName: 'อีเมล', flex: 1, minWidth: 200 },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'status', headerName: 'สถานะ', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button size="small" onClick={() => handleEdit(params.row as Profile)}>แก้ไข</Button>
          <Button size="small" color="error" onClick={() => setDeleteId(params.row.id as string)}>ลบ</Button>
        </Box>
      ),
    },
  ]

  const handleEdit = (profile: Profile) => {
    setEditUser(profile)
    setEditRole(profile.role)
    setEditName(profile.full_name)
  }

  const handleSaveEdit = async () => {
    if (!editUser) return
    await updateProfile(editUser.id, { role: editRole, full_name: editName })
    setEditUser(null)
    fetchProfiles()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteProfile(deleteId)
    setDeleteId(null)
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
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

      <DataTable
        columns={columns}
        rows={activeProfiles}
        loading={loading}
        searchPlaceholder="ค้นหาชื่อ หรือ อีเมล..."
      />

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>แก้ไขผู้ใช้</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="ชื่อ" value={editName} onChange={(e) => setEditName(e.target.value)} required fullWidth />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={editRole} label="Role" onChange={(e) => setEditRole(e.target.value as UserRole)}>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={!editName.trim()}>บันทึก</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="ยืนยันการลบ"
        message="คุณต้องการลบผู้ใช้นี้หรือไม่? (Soft delete — สถานะจะเปลี่ยนเป็น inactive)"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
