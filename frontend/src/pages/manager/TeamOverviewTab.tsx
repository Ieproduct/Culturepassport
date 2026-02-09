import { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'
import {
  Groups as TeamIcon,
  RateReview as ReviewIcon,
  TrendingUp as RateIcon,
} from '@mui/icons-material'
import { Alert } from '@mui/material'
import { StatsCard } from '@/components/common/StatsCard'
import { CascadingFilter } from '@/components/common/CascadingFilter'
import { EmptyState } from '@/components/common/EmptyState'
import { useCascadingFilter } from '@/hooks/useCascadingFilter'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme'
import type { Profile } from '@/types'

type TeamMember = Profile & {
  total_missions: number
  completed_missions: number
  pending_review: number
  progress_percent: number
}

export function TeamOverviewTab() {
  const cascading = useCascadingFilter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [examModalOpen, setExamModalOpen] = useState(false)
  const [examScores, setExamScores] = useState<Array<{ title: string; score: number; total: number; passed: boolean }>>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTeamMembers()
  }, [cascading.selectedCompany, cascading.selectedDepartment, cascading.selectedPosition])

  async function fetchTeamMembers() {
    setLoading(true)
    setError(null)
    try {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'employee')
      .eq('status', 'active')

    if (cascading.selectedCompany) query = query.eq('company_id', cascading.selectedCompany)
    if (cascading.selectedDepartment) query = query.eq('department_id', cascading.selectedDepartment)
    if (cascading.selectedPosition) query = query.eq('position_id', cascading.selectedPosition)

    const { data: profiles } = await query

    if (!profiles) { setLoading(false); return }

    // Fetch mission stats for each member
    const enriched: TeamMember[] = await Promise.all(
      profiles.map(async (p) => {
        const { data: missions } = await supabase
          .from('user_missions')
          .select('status')
          .eq('user_id', p.id)

        const total = missions?.length ?? 0
        const completed = missions?.filter((m) => m.status === 'approved').length ?? 0
        const pending = missions?.filter((m) => m.status === 'submitted').length ?? 0

        return {
          ...p,
          total_missions: total,
          completed_missions: completed,
          pending_review: pending,
          progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
        }
      })
    )

    setMembers(enriched)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'โหลดข้อมูลทีมไม่สำเร็จ')
    } finally {
      setLoading(false)
    }
  }

  const handleViewExamScores = async (memberId: string) => {
    const { data } = await supabase
      .from('exam_scores')
      .select('*')
      .eq('user_id', memberId)
      .order('taken_at', { ascending: false })

    const scores = data ?? []
    const templateIds = [...new Set(scores.map((s) => s.exam_template_id))]
    const { data: templates } = templateIds.length > 0
      ? await supabase.from('exam_templates').select('id, title').in('id', templateIds)
      : { data: [] }
    const templateMap = new Map((templates ?? []).map((t) => [t.id, t.title]))

    setExamScores(
      scores.map((s) => ({
        title: templateMap.get(s.exam_template_id) ?? 'Exam',
        score: s.score,
        total: s.total,
        passed: s.passed,
      }))
    )
    setExamModalOpen(true)
  }

  const totalMembers = members.length
  const totalPendingReview = members.reduce((sum, m) => sum + m.pending_review, 0)
  const avgCompletion = totalMembers > 0
    ? Math.round(members.reduce((sum, m) => sum + m.progress_percent, 0) / totalMembers)
    : 0

  function getProbationBadge(member: TeamMember) {
    if (!member.probation_end) return null
    const endDate = new Date(member.probation_end)
    const now = new Date()
    const allApproved = member.completed_missions === member.total_missions && member.total_missions > 0

    if (endDate > now && allApproved) return <Chip label="ผ่าน" size="small" color="success" />
    if (endDate > now) return <Chip label="อยู่ระหว่าง" size="small" color="info" />
    return <Chip label="ไม่ผ่าน" size="small" color="error" />
  }

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
  }

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error" sx={{ mb: 1 }}>{error}</Alert>}

      {/* Stats */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
        <StatsCard icon={<TeamIcon />} label="สมาชิกทีม" value={totalMembers} color={colors.blue[500]} />
        <StatsCard icon={<ReviewIcon />} label="รอ Review" value={totalPendingReview} color={colors.amber[500]} />
        <StatsCard icon={<RateIcon />} label="อัตราสำเร็จ" value={`${avgCompletion}%`} color={colors.green[500]} />
      </Box>

      {/* Cascading Filters */}
      <CascadingFilter
        companies={cascading.companies}
        departments={cascading.departments}
        positions={cascading.positions}
        selectedCompany={cascading.selectedCompany}
        selectedDepartment={cascading.selectedDepartment}
        selectedPosition={cascading.selectedPosition}
        onCompanyChange={cascading.setSelectedCompany}
        onDepartmentChange={cascading.setSelectedDepartment}
        onPositionChange={cascading.setSelectedPosition}
      />

      {/* Member Cards */}
      {members.length === 0 ? (
        <EmptyState message="ไม่มีสมาชิกในทีม" />
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {members.map((member) => (
            <Card key={member.id}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{member.full_name}</Typography>
                    <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                  </Box>
                  {getProbationBadge(member)}
                </Box>

                <Box sx={{ my: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">ความคืบหน้า</Typography>
                    <Typography variant="caption" fontWeight={600}>{member.progress_percent}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={member.progress_percent}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                </Box>

                <Typography variant="caption" color="text.secondary">
                  {member.completed_missions}/{member.total_missions} missions สำเร็จ
                  {member.pending_review > 0 && ` • ${member.pending_review} รอ review`}
                </Typography>

                <Box sx={{ mt: 1.5 }}>
                  <Button size="small" variant="text" onClick={() => handleViewExamScores(member.id)}>
                    ดูคะแนนสอบ
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Exam Score Modal */}
      <Dialog open={examModalOpen} onClose={() => setExamModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>คะแนนสอบ</DialogTitle>
        <DialogContent>
          {examScores.length === 0 ? (
            <Typography color="text.secondary">ยังไม่มีผลสอบ</Typography>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ข้อสอบ</TableCell>
                  <TableCell align="center">คะแนน</TableCell>
                  <TableCell align="center">เต็ม</TableCell>
                  <TableCell align="center">สถานะ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {examScores.map((es, i) => (
                  <TableRow key={i}>
                    <TableCell>{es.title}</TableCell>
                    <TableCell align="center">{es.score}</TableCell>
                    <TableCell align="center">{es.total}</TableCell>
                    <TableCell align="center">
                      <Chip label={es.passed ? 'ผ่าน' : 'ไม่ผ่าน'} size="small" color={es.passed ? 'success' : 'error'} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExamModalOpen(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  )
}
