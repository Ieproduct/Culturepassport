import { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Typography, Card, CardContent, IconButton, Stack, FormControlLabel } from '@mui/material'
import { IOSSwitch } from '@/components/common/IOSSwitch'
import { Add, Delete, Edit } from '@mui/icons-material'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { formatDate } from '@/utils/formatDate'
import type { Announcement } from '@/types'

export function AnnouncementsTab() {
  const { announcements, loading, error, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements()

  const [open, setOpen] = useState(false)
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  const resetForm = () => {
    setTitle('')
    setContent('')
    setEditAnnouncement(null)
    setFormError('')
  }

  const handleOpen = () => {
    resetForm()
    setOpen(true)
  }

  const handleEdit = (a: Announcement) => {
    setEditAnnouncement(a)
    setTitle(a.title)
    setContent(a.content)
    setOpen(true)
  }

  const handleSave = async () => {
    if (!title.trim()) { setFormError('กรุณากรอกหัวข้อ'); return }
    if (!content.trim()) { setFormError('กรุณากรอกเนื้อหา'); return }

    if (editAnnouncement) {
      await updateAnnouncement(editAnnouncement.id, { title: title.trim(), content: content.trim() })
    } else {
      await createAnnouncement({ title: title.trim(), content: content.trim() })
    }
    setOpen(false)
    resetForm()
  }

  const handleToggleActive = async (id: string, current: boolean) => {
    await updateAnnouncement(id, { is_active: !current })
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteAnnouncement(deleteId)
    setDeleteId(null)
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          สร้างประกาศใหม่
        </Button>
      </Box>

      {loading ? (
        <Typography color="text.secondary">กำลังโหลด...</Typography>
      ) : announcements.length === 0 ? (
        <Typography color="text.secondary">ยังไม่มีประกาศ</Typography>
      ) : (
        <Stack spacing={2}>
          {announcements.map((a) => (
            <Card key={a.id} variant="outlined" sx={{ opacity: a.is_active ? 1 : 0.6 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box flex={1}>
                  <Typography variant="subtitle1" fontWeight={600}>{a.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{a.content}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    เผยแพร่: {formatDate(a.published_at)}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={<IOSSwitch checked={a.is_active} onChange={() => handleToggleActive(a.id, a.is_active)} />}
                  label={a.is_active ? 'Active' : 'Inactive'}
                  sx={{ minWidth: 120 }}
                />
                <IconButton size="small" onClick={() => handleEdit(a)}><Edit fontSize="small" /></IconButton>
                <IconButton size="small" onClick={() => setDeleteId(a.id)}><Delete fontSize="small" /></IconButton>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Dialog open={open} onClose={() => { setOpen(false); resetForm() }} maxWidth="sm" fullWidth>
        <DialogTitle>{editAnnouncement ? 'แก้ไขประกาศ' : 'สร้างประกาศใหม่'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="หัวข้อ" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
          <TextField label="เนื้อหา" value={content} onChange={(e) => setContent(e.target.value)} required multiline rows={4} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm() }}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSave} disabled={!title.trim() || !content.trim()}>บันทึก</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="ยืนยันการลบประกาศ"
        message="คุณต้องการลบประกาศนี้หรือไม่?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
