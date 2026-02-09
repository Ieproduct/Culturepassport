import { useState, type SyntheticEvent } from 'react'
import { Box, Tabs, Tab, Typography, Container } from '@mui/material'
import {
  Groups as GroupsIcon,
  RateReview as ReviewIcon,
} from '@mui/icons-material'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { colors } from '@/theme'
import { TeamOverviewTab } from './TeamOverviewTab'
import { PendingReviewsTab } from './PendingReviewsTab'

const tabs = [
  { label: 'ภาพรวมทีม', icon: <GroupsIcon /> },
  { label: 'รอ Review', icon: <ReviewIcon /> },
]

export function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <DashboardLayout>
      {/* Blue Gradient Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.blue[600]} 0%, ${colors.blue[800]} 100%)`,
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
            แดชบอร์ดหัวหน้าทีม
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            ติดตามความคืบหน้าและ Review งานของทีม
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
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
          {activeTab === 0 && <TeamOverviewTab />}
          {activeTab === 1 && <PendingReviewsTab />}
        </Box>
      </Container>
    </DashboardLayout>
  )
}
