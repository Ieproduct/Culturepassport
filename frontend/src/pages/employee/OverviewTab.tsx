import { useEffect, useState } from 'react'
import { Box, Typography, LinearProgress, Stack, Alert } from '@mui/material'
import {
  CheckCircle as CompletedIcon,
  PlayCircle as InProgressIcon,
  Assignment as TotalIcon,
} from '@mui/icons-material'
import { StatsCard } from '@/components/common/StatsCard'
import { colors } from '@/theme'
import { useAuth } from '@/hooks/useAuth'
import { useUserMissions } from '@/hooks/useUserMissions'
import { daysRemaining } from '@/utils/formatDate'

export function OverviewTab() {
  const { profile } = useAuth()
  const { userMissions, loading, error } = useUserMissions(profile?.id)
  const [stats, setStats] = useState({ completed: 0, inProgress: 0, total: 0, progressPercent: 0 })

  useEffect(() => {
    if (userMissions.length > 0) {
      const completed = userMissions.filter((um) => um.status === 'approved').length
      const inProgress = userMissions.filter((um) => um.status === 'in_progress').length
      const total = userMissions.length
      const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0
      setStats({ completed, inProgress, total, progressPercent })
    }
  }, [userMissions])

  const probationDaysLeft = profile?.probation_end
    ? daysRemaining(profile.probation_end)
    : null

  const isProbationExpired = probationDaysLeft !== null && probationDaysLeft < 0
  const hasIncompleteMissions = stats.total > 0 && stats.completed < stats.total

  return (
    <Stack spacing={3}>
      {error && <Alert severity="error">{error}</Alert>}

      {/* Probation Countdown */}
      {probationDaysLeft !== null && (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: isProbationExpired ? colors.red[50] : colors.green[50],
            border: 1,
            borderColor: isProbationExpired ? colors.red[200] : colors.green[200],
          }}
        >
          <Typography variant="h6" fontWeight={600} color={isProbationExpired ? 'error' : 'success.dark'}>
            {isProbationExpired
              ? `เลยกำหนด ${Math.abs(probationDaysLeft)} วัน`
              : `เหลือ ${probationDaysLeft} วัน`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ระยะเวลาทดลองงาน
          </Typography>
        </Box>
      )}

      {/* Expired probation warning */}
      {isProbationExpired && hasIncompleteMissions && (
        <Alert severity="warning">
          หมดเวลาทดลองงาน — ยังมี {stats.total - stats.completed} Mission ที่ยังไม่เสร็จ
        </Alert>
      )}

      {/* Completion message */}
      {stats.total > 0 && stats.completed === stats.total && (
        <Alert severity="success">
          ยินดีด้วย! คุณทำ Mission ครบทุกรายการแล้ว
        </Alert>
      )}

      {/* Progress Bar */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight={600}>
            ความคืบหน้า
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {stats.progressPercent}%
          </Typography>
        </Box>
        <LinearProgress
          variant={loading ? 'indeterminate' : 'determinate'}
          value={stats.progressPercent}
          sx={{
            height: 12,
            borderRadius: 1,
            backgroundColor: colors.gray[200],
            '& .MuiLinearProgress-bar': {
              borderRadius: 1,
              backgroundColor: colors.green[500],
            },
          }}
        />
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        <StatsCard
          icon={<CompletedIcon />}
          label="สำเร็จ"
          value={stats.completed}
          color={colors.green[500]}
        />
        <StatsCard
          icon={<InProgressIcon />}
          label="กำลังทำ"
          value={stats.inProgress}
          color={colors.blue[500]}
        />
        <StatsCard
          icon={<TotalIcon />}
          label="ทั้งหมด"
          value={stats.total}
          color={colors.gray[500]}
        />
      </Box>
    </Stack>
  )
}
