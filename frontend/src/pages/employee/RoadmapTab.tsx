import { Box, Typography, Stack, CircularProgress, Alert } from '@mui/material'
import {
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as UpcomingIcon,
  FiberManualRecord as CurrentIcon,
} from '@mui/icons-material'
import { EmptyState } from '@/components/common/EmptyState'
import { useAuth } from '@/hooks/useAuth'
import { useRoadmap } from '@/hooks/useRoadmap'
import { colors } from '@/theme'

function getDaysElapsed(startDate: string | null): number {
  if (!startDate) return 0
  const start = new Date(startDate)
  const now = new Date()
  return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export function RoadmapTab() {
  const { profile } = useAuth()
  const { milestones, loading, error } = useRoadmap()

  const daysElapsed = getDaysElapsed(profile?.probation_start ?? null)

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  if (milestones.length === 0) {
    return <EmptyState message="ยังไม่มี Roadmap" />
  }

  return (
    <Stack spacing={0}>
      {milestones.map((milestone, index) => {
        const isCompleted = daysElapsed >= milestone.target_day
        const isCurrent = !isCompleted && (index === 0 || daysElapsed >= milestones[index - 1].target_day)
        const isLast = index === milestones.length - 1

        return (
          <Box key={milestone.id} sx={{ display: 'flex', gap: 2 }}>
            {/* Timeline line + icon */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 40 }}>
              {isCompleted ? (
                <CompletedIcon sx={{ color: colors.green[500], fontSize: 28 }} />
              ) : isCurrent ? (
                <CurrentIcon sx={{ color: colors.blue[500], fontSize: 28 }} />
              ) : (
                <UpcomingIcon sx={{ color: colors.gray[300], fontSize: 28 }} />
              )}
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    flexGrow: 1,
                    minHeight: 40,
                    backgroundColor: isCompleted ? colors.green[300] : colors.gray[200],
                  }}
                />
              )}
            </Box>

            {/* Content */}
            <Box sx={{ pb: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color={isCompleted ? 'success.dark' : isCurrent ? 'primary' : 'text.secondary'}
              >
                {milestone.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                วันที่ {milestone.target_day} — {isCompleted ? 'ผ่านแล้ว' : isCurrent ? 'กำลังดำเนินการ' : 'กำลังจะถึง'}
              </Typography>
              {milestone.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {milestone.description}
                </Typography>
              )}
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}
