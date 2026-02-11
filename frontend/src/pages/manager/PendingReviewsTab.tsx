import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Slider,
  CircularProgress,
  Link,
  Divider,
  Alert,
} from '@mui/material'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { useServices } from '@/services'
import { formatDateTime } from '@/utils/formatDate'
import type { PendingMission } from '@/services/types'

export function PendingReviewsTab() {
  const { admin: adminService, storage: storageService } = useServices()
  const [pendingMissions, setPendingMissions] = useState<PendingMission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMission, setSelectedMission] = useState<PendingMission | null>(null)
  const [feedbackScore, setFeedbackScore] = useState<number>(5)
  const [feedbackText, setFeedbackText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPendingMissions()
  }, [])

  async function fetchPendingMissions() {
    setLoading(true)
    setError(null)
    try {
      const data = await adminService.fetchPendingMissions()
      setPendingMissions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenReview = (mission: PendingMission) => {
    setSelectedMission(mission)
    setFeedbackScore(5)
    setFeedbackText('')
  }

  const handleReview = async (approved: boolean) => {
    if (!selectedMission) return
    if (feedbackScore < 1) return

    setSubmitting(true)
    await adminService.reviewMission(selectedMission.id, approved, feedbackScore, feedbackText)
    setSubmitting(false)
    setSelectedMission(null)
    await fetchPendingMissions()
  }

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
  }

  if (pendingMissions.length === 0) {
    return <EmptyState message="ไม่มี Mission รอ Review" />
  }

  return (
    <>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Stack spacing={2}>
        {pendingMissions.map((pm) => (
          <Card key={pm.id}>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 1 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>{pm.mission_title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    โดย {pm.employee_name}
                    {pm.submitted_at && ` • ส่งเมื่อ ${formatDateTime(pm.submitted_at)}`}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StatusBadge status="submitted" />
                  <Button variant="contained" size="small" onClick={() => handleOpenReview(pm)}>
                    Review
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Feedback Modal */}
      <Dialog open={Boolean(selectedMission)} onClose={() => setSelectedMission(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Review: {selectedMission?.mission_title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              โดย {selectedMission?.employee_name}
            </Typography>

            {selectedMission?.submitted_content && (
              <>
                <Divider />
                <Typography variant="subtitle2" fontWeight={600}>เนื้อหาที่ส่ง</Typography>
                <Typography variant="body2">{selectedMission.submitted_content}</Typography>
              </>
            )}

            {selectedMission?.submitted_file_url && (
              <Link
                component="button"
                onClick={async () => {
                  const path = selectedMission.submitted_file_url!
                  // If it's a full URL (legacy), open directly; otherwise create signed URL
                  if (path.startsWith('http')) {
                    window.open(path, '_blank')
                  } else {
                    const url = await storageService.getSignedUrl('mission-deliverables', path)
                    if (url) window.open(url, '_blank')
                  }
                }}
              >
                ดาวน์โหลดไฟล์ที่ส่ง
              </Link>
            )}

            <Divider />

            <Box>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>คะแนน (1-10)</Typography>
              <Slider
                value={feedbackScore}
                onChange={(_, val) => setFeedbackScore(val as number)}
                min={1}
                max={10}
                step={1}
                marks
                valueLabelDisplay="on"
              />
            </Box>

            <TextField
              label="ความเห็น"
              multiline
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedMission(null)}>ยกเลิก</Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleReview(false)}
            disabled={submitting}
          >
            ส่งกลับแก้ไข
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => handleReview(true)}
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : 'อนุมัติ'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
