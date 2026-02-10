import { useState, type SyntheticEvent, type ReactNode } from 'react'
import { Box, Tabs, Tab, Typography } from '@mui/material'
import {
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignIcon,
  Quiz as QuizIcon,
  Storage as StorageIcon,
  PersonAdd as PersonAddIcon,
  Map as MapIcon,
  Campaign as CampaignIcon,
  FileDownload as ExportIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Business as BusinessIcon,
  AccountTree as DepartmentIcon,
  Work as PositionIcon,
  Leaderboard as LevelIcon,
} from '@mui/icons-material'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { IconCategory } from '@/components/icons/IconCategory'
import { useAuth } from '@/hooks/useAuth'
import { OverviewTab } from './OverviewTab'
import { UsersTab } from './UsersTab'
import { MissionsTab } from './MissionsTab'
import { AssignTab } from './AssignTab'
import { ExamsTab } from './ExamsTab'
import { MasterDataTab } from './MasterDataTab'
import { CreateAccountTab } from './CreateAccountTab'
import { RoadmapTab } from './RoadmapTab'
import { AnnouncementsTab } from './AnnouncementsTab'
import { ExportTab } from './ExportTab'

/* ─── Tabs: Figma labels + icons ─── */
const tabs = [
  { label: 'ภาพรวม', icon: <IconCategory variant="solid" /> },
  { label: 'ผู้ใช้งานทั้งหมด', icon: <PeopleIcon /> },
  { label: 'ภารกิจทั้งหมด', icon: <AssignmentIcon /> },
  { label: 'มอบหมายภารกิจ', icon: <AssignIcon /> },
  { label: 'สร้างแบบทดสอบ/ภารกิจ', icon: <QuizIcon /> },
  { label: 'ข้อมูลหลัก', icon: <StorageIcon /> },
  { label: 'สร้างบัญชีผู้ใช้', icon: <PersonAddIcon /> },
  { label: 'ตั้งค่าแผนการ', icon: <MapIcon /> },
  { label: 'ตั้งค่าประกาศ', icon: <CampaignIcon /> },
  { label: 'ส่งออกข้อมูล', icon: <ExportIcon /> },
]

/* ─── Info chip in hero banner (Figma 32:13240–32:13306) ─── */
function InfoChip({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        minWidth: { xs: 'calc(50% - 8px)', sm: 'auto' },
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '10px',
          bgcolor: '#FFFFFF',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Box sx={{ color: '#E7000B', fontSize: 16, display: 'flex' }}>{icon}</Box>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 400,
            fontSize: { xs: 11, sm: 12 },
            lineHeight: '16px',
            color: '#FFFFFF',
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 600,
            fontSize: { xs: 12, sm: 14 },
            lineHeight: '20px',
            color: '#FFFFFF',
            letterSpacing: '-0.15px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  )
}

/* ─── Mock data matching Figma exactly ─── */
const MOCK_HERO = {
  fullName: 'สมชาย ผู้ดูแล',
  employeeId: '2345678',
  company: 'บริษัท เทคโนโลยี จำกัด (มหาชน)',
  department: 'ทรัพยากรบุคคล',
  position: 'HR Manager',
  level: 'Manager/Teamlead',
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0)
  const { profile } = useAuth()

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <DashboardLayout>
      {/* ═══ Red Gradient Hero Container (Figma 32:13234) ═══ */}
      <Box
        sx={{
          background: 'linear-gradient(170.6deg, #E7000B 0%, #C10007 50%, #A50036 100%)',
          borderRadius: '10px',
          boxShadow: '0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)',
          pt: { xs: '20px', sm: '24px', md: '32px' },
          px: { xs: '16px', sm: '24px', md: '32px' },
          pb: 0,
          mb: '24px',
        }}
      >
        {/* Heading */}
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 700,
            fontSize: { xs: 22, sm: 26, md: 30 },
            lineHeight: { xs: '28px', sm: '32px', md: '36px' },
            color: '#FFFFFF',
            letterSpacing: '0.4px',
            textShadow: '0px 3px 6px rgba(0,0,0,0.12)',
          }}
        >
          แดชบอร์ดผู้ดูแลระบบ
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 400,
            fontSize: { xs: 14, md: 16 },
            lineHeight: '24px',
            color: '#FFFFFF',
            letterSpacing: '-0.31px',
            mt: '8px',
          }}
        >
          จัดการระบบและส่งออกข้อมูล
        </Typography>

        {/* ─── Separator + Info chips ─── */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255,255,255,0.4)',
            mt: '8px',
            pt: '16px',
            pb: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: '10px 16px', sm: '12px', md: '16px' },
          }}
        >
          <InfoChip icon={<PersonIcon sx={{ fontSize: 16 }} />} label="ชื่อ-นามสกุล" value={profile?.full_name ?? MOCK_HERO.fullName} />
          <InfoChip icon={<BadgeIcon sx={{ fontSize: 16 }} />} label="รหัสพนักงาน" value={MOCK_HERO.employeeId} />
          <InfoChip icon={<BusinessIcon sx={{ fontSize: 16 }} />} label="บริษัท" value={MOCK_HERO.company} />
          <InfoChip icon={<DepartmentIcon sx={{ fontSize: 16 }} />} label="แผนก" value={MOCK_HERO.department} />
          <InfoChip icon={<PositionIcon sx={{ fontSize: 16 }} />} label="ตำแหน่ง" value={MOCK_HERO.position} />
          <InfoChip icon={<LevelIcon sx={{ fontSize: 16 }} />} label="ระดับตำแหน่ง" value={MOCK_HERO.level} />
        </Box>
      </Box>

      {/* ═══ Tabs (Figma 32:13307) — icons + labels, fill width ═══ */}
      <Box
        sx={{
          borderBottom: '1px solid #E5E7EB',
          pb: '1px',
          mb: '24px',
          width: '100%',
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            sx: { height: '2px', bgcolor: '#F62B25' },
          }}
          sx={{
            minHeight: 42,
            '& .MuiTabScrollButton-root.Mui-disabled': {
              display: 'none',
            },
            '& .MuiTabs-flexContainer': {
              gap: { xs: '4px', sm: '8px' },
            },
            '& .MuiTab-root': {
              minHeight: 42,
              minWidth: 'auto',
              px: { xs: '6px', sm: '8px' },
              py: '8px',
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 500,
              fontSize: { xs: 13, sm: 14, md: 16 },
              lineHeight: '24px',
              letterSpacing: '-0.31px',
              textTransform: 'none',
              color: '#6B7280',
              '&.Mui-selected': {
                color: '#F62B25',
              },
              '& .MuiTab-iconWrapper': {
                fontSize: { xs: 18, md: 20 },
                mr: '6px',
              },
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              disableRipple
            />
          ))}
        </Tabs>
      </Box>

      {/* ═══ Tab Content ═══ */}
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        {activeTab === 0 && <OverviewTab />}
        {activeTab === 1 && <UsersTab />}
        {activeTab === 2 && <MissionsTab />}
        {activeTab === 3 && <AssignTab />}
        {activeTab === 4 && <ExamsTab />}
        {activeTab === 5 && <MasterDataTab />}
        {activeTab === 6 && <CreateAccountTab />}
        {activeTab === 7 && <RoadmapTab />}
        {activeTab === 8 && <AnnouncementsTab />}
        {activeTab === 9 && <ExportTab />}
      </Box>
    </DashboardLayout>
  )
}
