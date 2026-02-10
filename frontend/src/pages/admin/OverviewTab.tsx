import { useState, useEffect, type ReactNode } from 'react'
import { Box, CircularProgress, Alert, Typography } from '@mui/material'
import {
  People,
  CheckCircle,
  Assessment as MissionStatusIcon,
  CheckCircleOutline as ActivityCheckIcon,
  TrackChanges as TargetIcon,
  Storage as DatabaseIcon,
} from '@mui/icons-material'
import { space } from '@/theme/spacing'
import { supabase } from '@/lib/supabase'

type Stats = {
  totalEmployees: number
  totalMissions: number
  completionRate: number
  pendingCount: number
}

/* ─── Overview Stats Card (Figma Make design) ─── */
function OverviewStatsCard({
  icon,
  iconBgColor,
  iconColor,
  label,
  value,
  subtitle,
}: {
  icon: ReactNode
  iconBgColor: string
  iconColor: string
  label: string
  value: string | number
  subtitle: string
}) {
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        borderRadius: '12px',
        p: space[24],
        border: '1px solid #F3F4F6',
        boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
        '&:hover': { boxShadow: '0px 4px 6px rgba(0,0,0,0.07)' },
        transition: 'box-shadow 0.2s',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: space[12], mb: space[16] }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            bgcolor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: iconColor,
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '20px',
            color: '#6B7280',
          }}
        >
          {label}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 30,
          lineHeight: '36px',
          color: '#111827',
          mb: space[8],
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
          color: '#9CA3AF',
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  )
}

/* ─── Mock stats matching Figma Make ─── */
const MOCK_OVERVIEW_STATS = {
  totalUsers: 21,
  employees: 18,
  managers: 1,
  totalMissions: 18,
  totalCategories: 11,
  completionRate: 52,
  completedMissions: 57,
  totalUserMissions: 110,
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
        gap: space[4],
        minHeight: 90,
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
    <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8] }}>
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
        px: space[12],
        gap: space[12],
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
  const [_stats, setStats] = useState<Stats>({ totalEmployees: 0, totalMissions: 0, completionRate: 0, pendingCount: 0 })
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
    {error && <Alert severity="error" sx={{ mb: space[16] }}>{error}</Alert>}

    {/* ═══ Key Stats Cards (Figma Make design) ═══ */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: space[16],
      }}
    >
      <OverviewStatsCard
        icon={<People sx={{ fontSize: 24 }} />}
        iconBgColor="#EFF6FF"
        iconColor="#2563EB"
        label="ผู้ใช้งานทั้งหมด"
        value={MOCK_OVERVIEW_STATS.totalUsers}
        subtitle={`${MOCK_OVERVIEW_STATS.employees} พนักงาน, ${MOCK_OVERVIEW_STATS.managers} ผู้จัดการ`}
      />
      <OverviewStatsCard
        icon={<TargetIcon sx={{ fontSize: 24 }} />}
        iconBgColor="#F0FDF4"
        iconColor="#16A34A"
        label="ภารกิจทั้งหมด"
        value={MOCK_OVERVIEW_STATS.totalMissions}
        subtitle={`${MOCK_OVERVIEW_STATS.totalCategories} หมวดหมู่`}
      />
      <OverviewStatsCard
        icon={<CheckCircle sx={{ fontSize: 24 }} />}
        iconBgColor="#FAF5FF"
        iconColor="#9333EA"
        label="อัตราเสร็จสิ้น"
        value={`${MOCK_OVERVIEW_STATS.completionRate}%`}
        subtitle={`${MOCK_OVERVIEW_STATS.completedMissions}/${MOCK_OVERVIEW_STATS.totalUserMissions} ภารกิจ`}
      />
      <OverviewStatsCard
        icon={<DatabaseIcon sx={{ fontSize: 24 }} />}
        iconBgColor="#FFF7ED"
        iconColor="#EA580C"
        label="ข้อมูลในระบบ"
        value={MOCK_OVERVIEW_STATS.totalUserMissions}
        subtitle="บันทึกภารกิจ"
      />
    </Box>

    {/* ═══ สถานะภารกิจ — Mission Status (Figma 32:13386) ═══ */}
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        p: space[24],
        mt: space[24],
      }}
    >
      <SectionHeading icon={<MissionStatusIcon sx={{ fontSize: 20 }} />}>
        สถานะภารกิจ
      </SectionHeading>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: space[16],
          mt: space[16],
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
        p: space[24],
        mt: space[24],
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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[12], mt: space[16] }}>
        {MOCK_RECENT_ACTIVITIES.map((activity, index) => (
          <ActivityRow key={index} {...activity} />
        ))}
      </Box>
    </Box>
    </>
  )
}
