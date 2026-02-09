import { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Typography, Card, CardContent, IconButton, Stack } from '@mui/material'
import { Add, Delete, Edit } from '@mui/icons-material'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useRoadmap } from '@/hooks/useRoadmap'
import type { RoadmapMilestone } from '@/types'

export function RoadmapTab() {
  const { milestones, loading, error, createMilestone, updateMilestone, deleteMilestone } = useRoadmap()

  const [open, setOpen] = useState(false)
  const [editMilestone, setEditMilestone] = useState<RoadmapMilestone | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [targetDay, setTargetDay] = useState(1)
  const [sortOrder, setSortOrder] = useState(0)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setTargetDay(1)
    setSortOrder(0)
    setEditMilestone(null)
    setFormError('')
  }

  const handleOpen = () => {
    resetForm()
    setSortOrder(milestones.length)
    setOpen(true)
  }

  const handleEdit = (m: RoadmapMilestone) => {
    setEditMilestone(m)
    setTitle(m.title)
    setDescription(m.description ?? '')
    setTargetDay(m.target_day)
    setSortOrder(m.sort_order)
    setOpen(true)
  }

  const handleSave = async () => {
    if (!title.trim()) { setFormError('กรุณากรอกชื่อ Milestone'); return }

    const data = {
      title: title.trim(),
      description: description.trim() || null,
      target_day: targetDay,
      sort_order: sortOrder,
    }

    if (editMilestone) {
      await updateMilestone(editMilestone.id, data)
    } else {
      await createMilestone(data)
    }
    setOpen(false)
    resetForm()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteMilestone(deleteId)
    setDeleteId(null)
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          เพิ่ม Milestone
        </Button>
      </Box>

      {loading ? (
        <Typography color="text.secondary">กำลังโหลด...</Typography>
      ) : milestones.length === 0 ? (
        <Typography color="text.secondary">ยังไม่มี Milestone</Typography>
      ) : (
        <Stack spacing={2}>
          {milestones.map((m) => (
            <Card key={m.id} variant="outlined">
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box
                  sx={{
                    minWidth: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  Day {m.target_day}
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600}>{m.title}</Typography>
                  {m.description && <Typography variant="body2" color="text.secondary">{m.description}</Typography>}
                  <Typography variant="caption" color="text.secondary">ลำดับ: {m.sort_order}</Typography>
                </Box>
                <IconButton size="small" onClick={() => handleEdit(m)}><Edit fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => setDeleteId(m.id)}><Delete fontSize="small" /></IconButton>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); resetForm() }} maxWidth="sm" fullWidth>
        <DialogTitle>{editMilestone ? 'แก้ไข Milestone' : 'เพิ่ม Milestone'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="ชื่อ Milestone" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
          <TextField label="คำอธิบาย" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} fullWidth />
          <TextField label="Target Day" type="number" value={targetDay} onChange={(e) => setTargetDay(Number(e.target.value))} inputProps={{ min: 1 }} fullWidth />
          <TextField label="ลำดับ (Sort Order)" type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} inputProps={{ min: 0 }} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm() }}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSave} disabled={!title.trim() || targetDay < 1}>บันทึก</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="ยืนยันการลบ Milestone"
        message="คุณต้องการลบ Milestone นี้หรือไม่?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
