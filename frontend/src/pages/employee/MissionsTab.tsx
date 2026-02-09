import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  Divider,
  CircularProgress,
  Link,
} from '@mui/material'
import { StatusBadge } from '@/components/common/StatusBadge'
import { FileUpload } from '@/components/common/FileUpload'
import { EmptyState } from '@/components/common/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useUserMissions } from '@/hooks/useUserMissions'
import { getSignedUrl } from '@/utils/storageHelpers'
import type { UserMission } from '@/types'

const statusOrder: Record<string, number> = {
  in_progress: 0,
  not_started: 1,
  submitted: 2,
  rejected: 3,
  approved: 4,
  cancelled: 5,
}

export function MissionsTab() {
  const { profile } = useAuth()
  const { userMissions, loading, startMission, submitMission, fetchUserMissions } = useUserMissions(profile?.id)
  const [selectedMission, setSelectedMission] = useState<UserMission | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [submittedContent, setSubmittedContent] = useState('')
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const sortedMissions = [...userMissions].sort(
    (a, b) => (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
  )

  const handleOpenMission = (mission: UserMission) => {
    setSelectedMission(mission)
    setSubmittedContent(mission.submitted_content ?? '')
    setFileUrl(mission.submitted_file_url ?? null)
    setModalOpen(true)
  }

  const handleStart = async (mission: UserMission) => {
    await startMission(mission.id)
    await fetchUserMissions()
    handleOpenMission({ ...mission, status: 'in_progress' })
  }

  const handleSubmit = async () => {
    if (!selectedMission) return
    setSubmitting(true)
    await submitMission(selectedMission.id, submittedContent || undefined, fileUrl || undefined)
    await fetchUserMissions()
    setSubmitting(false)
    setModalOpen(false)
  }

  const handleResubmit = () => {
    // Reset form for resubmission
    setSubmittedContent('')
    setFileUrl(null)
  }

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
  }

  if (sortedMissions.length === 0) {
    return <EmptyState message="ยังไม่มี Mission ที่ได้รับมอบหมาย" />
  }

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {sortedMissions.map((um) => (
          <Card key={um.id} sx={{ display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {(um as UserMission & { mission_title?: string }).mission_title ?? 'Mission'}
                </Typography>
                <StatusBadge status={um.status} />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {(um as UserMission & { mission_description?: string }).mission_description ?? ''}
              </Typography>
            </CardContent>
            <CardActions sx={{ px: 2, pb: 2 }}>
              {um.status === 'not_started' && (
                <Button size="small" variant="contained" onClick={() => handleStart(um)}>
                  เริ่มทำ
                </Button>
              )}
              {um.status === 'in_progress' && (
                <Button size="small" variant="outlined" onClick={() => handleOpenMission(um)}>
                  ส่งงาน
                </Button>
              )}
              {(um.status === 'submitted' || um.status === 'approved' || um.status === 'rejected') && (
                <Button size="small" variant="text" onClick={() => handleOpenMission(um)}>
                  ดูรายละเอียด
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Mission Detail / Submit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600}>
              {(selectedMission as UserMission & { mission_title?: string })?.mission_title ?? 'Mission'}
            </Typography>
            {selectedMission && <StatusBadge status={selectedMission.status} />}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {(selectedMission as UserMission & { mission_description?: string })?.mission_description ?? ''}
            </Typography>

            {/* Download submitted file */}
            {selectedMission?.submitted_file_url && (selectedMission.status === 'submitted' || selectedMission.status === 'approved' || selectedMission.status === 'rejected') && (
              <Link
                component="button"
                onClick={async () => {
                  const path = selectedMission.submitted_file_url!
                  if (path.startsWith('http')) {
                    window.open(path, '_blank')
                  } else {
                    const url = await getSignedUrl('mission-deliverables', path)
                    if (url) window.open(url, '_blank')
                  }
                }}
              >
                ดาวน์โหลดไฟล์ที่ส่ง
              </Link>
            )}

            {/* Feedback display for reviewed missions */}
            {selectedMission && (selectedMission.status === 'approved' || selectedMission.status === 'rejected') && (
              <>
                <Divider />
                <Typography variant="subtitle2" fontWeight={600}>
                  Feedback จาก Manager
                </Typography>
                {selectedMission.feedback_score && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">คะแนน</Typography>
                    <Slider
                      value={selectedMission.feedback_score}
                      min={1}
                      max={10}
                      disabled
                      marks
                      valueLabelDisplay="on"
                    />
                  </Box>
                )}
                {selectedMission.feedback_text && (
                  <Typography variant="body2">{selectedMission.feedback_text}</Typography>
                )}
              </>
            )}

            {/* Resubmit option for rejected */}
            {selectedMission?.status === 'rejected' && (
              <Button variant="outlined" color="warning" onClick={handleResubmit}>
                แก้ไขและส่งใหม่
              </Button>
            )}

            {/* Submit form for in_progress */}
            {selectedMission && (selectedMission.status === 'in_progress' || selectedMission.status === 'rejected') && (
              <>
                <Divider />
                <TextField
                  label="เนื้อหาที่ส่ง"
                  multiline
                  rows={4}
                  value={submittedContent}
                  onChange={(e) => setSubmittedContent(e.target.value)}
                  fullWidth
                />
                <FileUpload
                  bucketName="mission-deliverables"
                  filePath={`${profile?.id}/${selectedMission.mission_id}/${Date.now()}`}
                  onUploadComplete={(url) => setFileUrl(url)}
                  onError={(err) => console.error(err)}
                />
                {fileUrl && (
                  <Typography variant="caption" color="success.main">
                    ไฟล์อัปโหลดสำเร็จ
                  </Typography>
                )}
              </>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>ปิด</Button>
          {selectedMission && (selectedMission.status === 'in_progress' || selectedMission.status === 'rejected') && (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting || (!submittedContent.trim() && !fileUrl)}
            >
              {submitting ? <CircularProgress size={20} /> : 'ส่งงาน'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
