import { useState, useEffect, type ReactNode } from 'react'
import { Box, CircularProgress, Alert, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import {
  People,
  Assignment,
  CheckCircle,
  HourglassEmpty,
  Assessment as MissionStatusIcon,
  CheckCircleOutline as ActivityCheckIcon,
} from '@mui/icons-material'
import { StatsCard } from '@/components/common/StatsCard'
import { supabase } from '@/lib/supabase'
import { colors } from '@/theme'

type Stats = {
  totalEmployees: number
  totalMissions: number
  completionRate: number
  pendingCount: number
}

/* ─── Mock data matching Figma 32:13386 ─── */
const MOCK_MISSION_STATUS = {
  completed: 12,
  inProgress: 10,
  overdue: 10,
}

/* ─── Mission Status Card (Figma 32:13395–32:13409) ─── */
function MissionStatusCard({
  value,
  label,
  valueColor,
  bgColor,
  borderColor,
}: {
  value: number
  label: string
  valueColor: string
  bgColor: string
  borderColor: string
}) {
  return (
    <Box
      sx={{
        bgcolor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '10px',
        pt: '17px',
        px: '17px',
        pb: '17px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        minHeight: { xs: 80, sm: 90 },
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 24,
          lineHeight: '32px',
          color: valueColor,
          letterSpacing: '0.07px',
          textAlign: 'center',
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '20px',
          color: '#4A5565',
          letterSpacing: '-0.15px',
          textAlign: 'center',
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

/* ─── Section Heading with icon (Figma 32:13387) ─── */
function SectionHeading({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Box sx={{ display: 'flex', color: '#6B7280', fontSize: 20 }}>{icon}</Box>
      <Typography
        sx={{
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
          fontWeight: 600,
          fontSize: 18,
          lineHeight: '27px',
          color: '#6B7280',
          letterSpacing: '-0.44px',
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

/* ─── Mock data matching Figma 32:13410 ─── */
const MOCK_RECENT_ACTIVITIES = [
  { name: 'อรุณ พนักงาน', mission: 'ทำแบบทดสอบความปลอดภัย', date: '6 กุมภาพันธ์ 2569 เวลา 17:30' },
  { name: 'วิชัย ขายดี', mission: 'อ่านคู่มือพนักงานใหม่', date: '2 กุมภาพันธ์ 2569 เวลา 23:30', score: 92 },
  { name: 'สมหญิง ทดสอบ', mission: 'นำเสนองานต่อทีม', date: '31 มกราคม 2569 เวลา 00:00', score: 88 },
  { name: 'มาลี ดีไซน์', mission: 'พบปะทีมงาน', date: '30 มกราคม 2569 เวลา 00:00', score: 87 },
  { name: 'ธนชล นักพัฒนา', mission: 'นำเสนองานต่อทีม', date: '28 มกราคม 2569 เวลา 22:30', score: 93 },
]

/* ─── Activity Row (Figma 32:13414) ─── */
function ActivityRow({ name, mission, date, score }: { name: string; mission: string; date: string; score?: number }) {
  return (
    <Box
      sx={{
        bgcolor: '#F9FAFB',
        borderRadius: '10px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        px: '12px',
        gap: '12px',
      }}
    >
      <ActivityCheckIcon sx={{ fontSize: 20, color: '#22C55E', flexShrink: 0 }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontSize: 14,
            lineHeight: '20px',
            color: '#101828',
            letterSpacing: '-0.15px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <Box component="span" sx={{ fontWeight: 500 }}>{name}</Box>
          <Box component="span" sx={{ fontWeight: 400 }}> ทำภารกิจ </Box>
          <Box component="span" sx={{ fontWeight: 500 }}>{mission}</Box>
          <Box component="span" sx={{ fontWeight: 400 }}> เสร็จสิ้น</Box>
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: '16px',
            color: '#6A7282',
          }}
        >
          {date}
        </Typography>
      </Box>
      {score != null && (
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '20px',
            color: '#9810FA',
            letterSpacing: '-0.15px',
            flexShrink: 0,
          }}
        >
          {score}
        </Typography>
      )}
    </Box>
  )
}

export function OverviewTab() {
  const [stats, setStats] = useState<Stats>({ totalEmployees: 0, totalMissions: 0, completionRate: 0, pendingCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const [profilesRes, missionsRes, userMissionsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'employee').eq('status', 'active'),
          supabase.from('missions').select('id', { count: 'exact', head: true }).eq('is_deleted', false),
          supabase.from('user_missions').select('id, status'),
        ])

        if (profilesRes.error) throw profilesRes.error
        if (missionsRes.error) throw missionsRes.error
        if (userMissionsRes.error) throw userMissionsRes.error

        const totalEmployees = profilesRes.count ?? 0
        const totalMissions = missionsRes.count ?? 0
        const allUserMissions = userMissionsRes.data ?? []
        const approved = allUserMissions.filter((um) => um.status === 'approved').length
        const completionRate = allUserMissions.length > 0 ? Math.round((approved / allUserMissions.length) * 100) : 0
        const pendingCount = allUserMissions.filter((um) => um.status === 'submitted').length

        setStats({ totalEmployees, totalMissions, completionRate, pendingCount })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ')
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatsCard
          icon={<People />}
          label="จำนวนพนักงาน"
          value={stats.totalEmployees}
          color={colors.blue[500]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatsCard
          icon={<Assignment />}
          label="จำนวน Missions"
          value={stats.totalMissions}
          color={colors.purple[500]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatsCard
          icon={<CheckCircle />}
          label="อัตราสำเร็จ"
          value={`${stats.completionRate}%`}
          color={colors.green[500]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatsCard
          icon={<HourglassEmpty />}
          label="รอดำเนินการ"
          value={stats.pendingCount}
          color={colors.orange[500]}
        />
      </Grid>
    </Grid>

    {/* ═══ สถานะภารกิจ — Mission Status (Figma 32:13386) ═══ */}
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        pt: '25px',
        px: '25px',
        pb: '25px',
        mt: '24px',
      }}
    >
      <SectionHeading icon={<MissionStatusIcon sx={{ fontSize: 20 }} />}>
        สถานะภารกิจ
      </SectionHeading>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: '16px',
          mt: '16px',
        }}
      >
        <MissionStatusCard
          value={MOCK_MISSION_STATUS.completed}
          label="ทำเสร็จแล้ว"
          valueColor="#00A63E"
          bgColor="#F0FDF4"
          borderColor="#B9F8CF"
        />
        <MissionStatusCard
          value={MOCK_MISSION_STATUS.inProgress}
          label="กำลังดำเนินการ"
          valueColor="#155DFC"
          bgColor="#EFF6FF"
          borderColor="#BEDBFF"
        />
        <MissionStatusCard
          value={MOCK_MISSION_STATUS.overdue}
          label="ภารกิจล่าช้า"
          valueColor="#E7000B"
          bgColor="#FEF2F2"
          borderColor="#FFC9C9"
        />
      </Box>
    </Box>

    {/* ═══ กิจกรรมล่าสุด — Recent Activities (Figma 32:13410) ═══ */}
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        pt: '25px',
        px: '25px',
        pb: '25px',
        mt: '24px',
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
          fontWeight: 600,
          fontSize: 18,
          lineHeight: '27px',
          color: '#101828',
          letterSpacing: '-0.44px',
        }}
      >
        กิจกรรมล่าสุด
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', mt: '16px' }}>
        {MOCK_RECENT_ACTIVITIES.map((activity, index) => (
          <ActivityRow key={index} {...activity} />
        ))}
      </Box>
    </Box>
    </>
  )
}
