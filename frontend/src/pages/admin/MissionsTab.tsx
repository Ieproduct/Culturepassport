import { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Alert } from '@mui/material'
import { Add } from '@mui/icons-material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataTable } from '@/components/common/DataTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useMissions } from '@/hooks/useMissions'
import { useMasterData } from '@/hooks/useMasterData'
import type { Mission } from '@/types'

export function MissionsTab() {
  const { missions, loading, error, createMission, updateMission, deleteMission } = useMissions()
  const { categories } = useMasterData()

  const [open, setOpen] = useState(false)
  const [editMission, setEditMission] = useState<Mission | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [estimatedDuration, setEstimatedDuration] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'ชื่อ Mission', flex: 1, minWidth: 200 },
    {
      field: 'category_id',
      headerName: 'หมวดหมู่',
      width: 150,
      valueGetter: (_value: unknown, row: Record<string, unknown>) => {
        const cat = row as Record<string, unknown> & { categories?: { name: string } }
        return cat.categories?.name ?? '-'
      },
    },
    { field: 'estimated_duration', headerName: 'ระยะเวลา', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button size="small" onClick={() => handleEdit(params.row as Mission)}>แก้ไข</Button>
          <Button size="small" color="error" onClick={() => setDeleteId(params.row.id as string)}>ลบ</Button>
        </Box>
      ),
    },
  ]

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategoryId('')
    setEstimatedDuration('')
    setFormError('')
    setEditMission(null)
  }

  const handleOpen = () => {
    resetForm()
    setOpen(true)
  }

  const handleEdit = (mission: Mission) => {
    setEditMission(mission)
    setTitle(mission.title)
    setDescription(mission.description)
    setCategoryId(mission.category_id ?? '')
    setEstimatedDuration(mission.estimated_duration ?? '')
    setOpen(true)
  }

  const handleSave = async () => {
    if (!title.trim()) { setFormError('กรุณากรอกชื่อ Mission'); return }
    if (!description.trim()) { setFormError('กรุณากรอกคำอธิบาย'); return }

    const data = {
      title: title.trim(),
      description: description.trim(),
      category_id: categoryId || null,
      estimated_duration: estimatedDuration || null,
    }

    if (editMission) {
      await updateMission(editMission.id, data)
    } else {
      await createMission(data)
    }
    setOpen(false)
    resetForm()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteMission(deleteId)
    setDeleteId(null)
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          สร้าง Mission ใหม่
        </Button>
      </Box>

      <DataTable columns={columns} rows={missions} loading={loading} searchPlaceholder="ค้นหา Mission..." />

      {/* Create / Edit Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); resetForm() }} maxWidth="sm" fullWidth>
        <DialogTitle>{editMission ? 'แก้ไข Mission' : 'สร้าง Mission ใหม่'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="ชื่อ Mission" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
          <TextField label="คำอธิบาย" value={description} onChange={(e) => setDescription(e.target.value)} required multiline rows={3} fullWidth />
          <FormControl fullWidth>
            <InputLabel>หมวดหมู่</InputLabel>
            <Select value={categoryId} label="หมวดหมู่" onChange={(e) => setCategoryId(e.target.value)}>
              <MenuItem value="">ไม่ระบุ</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField label="ระยะเวลา (เช่น 3 วัน)" value={estimatedDuration} onChange={(e) => setEstimatedDuration(e.target.value)} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm() }}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSave} disabled={!title.trim() || !description.trim()}>บันทึก</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="ยืนยันการลบ Mission"
        message="การลบ Mission จะยกเลิก UserMissions ที่เกี่ยวข้องทั้งหมด"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
