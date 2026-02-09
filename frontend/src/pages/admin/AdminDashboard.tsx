import { useState, type SyntheticEvent } from 'react'
import { Box, Tabs, Tab, Typography, Container } from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  AssignmentTurnedIn as AssignIcon,
  Quiz as QuizIcon,
  Storage as StorageIcon,
  PersonAdd as PersonAddIcon,
  Map as MapIcon,
  Campaign as CampaignIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { colors } from '@/theme'
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

const tabs = [
  { label: 'ภาพรวม', icon: <DashboardIcon /> },
  { label: 'จัดการผู้ใช้', icon: <PeopleIcon /> },
  { label: 'จัดการ Mission', icon: <AssignmentIcon /> },
  { label: 'มอบหมาย', icon: <AssignIcon /> },
  { label: 'ข้อสอบ', icon: <QuizIcon /> },
  { label: 'ข้อมูลหลัก', icon: <StorageIcon /> },
  { label: 'สร้างบัญชี', icon: <PersonAddIcon /> },
  { label: 'Roadmap', icon: <MapIcon /> },
  { label: 'ประกาศ', icon: <CampaignIcon /> },
  { label: 'ส่งออกข้อมูล', icon: <ExportIcon /> },
]

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <DashboardLayout>
      {/* Red Gradient Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.red[600]} 0%, ${colors.red[800]} 100%)`,
          color: 'white',
          py: 4,
          px: 3,
          mx: { xs: -2, sm: -3 },
          mt: -3,
          mb: 3,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700}>
            แดชบอร์ดผู้ดูแลระบบ
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            จัดการระบบ CulturePassport ทั้งหมด
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            mb: 3,
            '& .MuiTab-root': { minHeight: 48 },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ textTransform: 'none', fontWeight: 500 }}
            />
          ))}
        </Tabs>

        <Box>
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
      </Container>
    </DashboardLayout>
  )
}
