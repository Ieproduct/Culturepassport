import { useState, useEffect, useCallback, type SyntheticEvent } from 'react'
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Assignment as MissionsIcon,
  Map as RoadmapIcon,
  Campaign as AnnouncementIcon,
} from '@mui/icons-material'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { colors } from '@/theme'
import type { Announcement } from '@/types'
import { OverviewTab } from './OverviewTab'
import { MissionsTab } from './MissionsTab'
import { RoadmapTab } from './RoadmapTab'

const tabs = [
  { label: 'ภาพรวม', icon: <DashboardIcon /> },
  { label: 'Missions', icon: <MissionsIcon /> },
  { label: 'Roadmap', icon: <RoadmapIcon /> },
]

export function EmployeeDashboard() {
  const { profile } = useAuth()
  const { getUndismissedAnnouncements, dismissAnnouncement } = useAnnouncements()
  const [activeTab, setActiveTab] = useState(0)
  const [pendingAnnouncements, setPendingAnnouncements] = useState<Announcement[]>([])
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null)

  const loadAnnouncements = useCallback(async () => {
    if (!profile) return
    const items = await getUndismissedAnnouncements(profile.id)
    setPendingAnnouncements(items)
    if (items.length > 0) setCurrentAnnouncement(items[0])
  }, [profile, getUndismissedAnnouncements])

  useEffect(() => { loadAnnouncements() }, [loadAnnouncements])

  const handleDismiss = async () => {
    if (!profile || !currentAnnouncement) return
    await dismissAnnouncement(currentAnnouncement.id, profile.id)
    const remaining = pendingAnnouncements.filter((a) => a.id !== currentAnnouncement.id)
    setPendingAnnouncements(remaining)
    setCurrentAnnouncement(remaining.length > 0 ? remaining[0] : null)
  }

  const handleTabChange = (_: SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <DashboardLayout>
      {/* Announcement Popup */}
      <Dialog open={!!currentAnnouncement} onClose={handleDismiss} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AnnouncementIcon color="primary" />
          {currentAnnouncement?.title}
        </DialogTitle>
        <DialogContent>
          <Typography whiteSpace="pre-wrap">{currentAnnouncement?.content}</Typography>
        </DialogContent>
        <DialogActions>
          {pendingAnnouncements.length > 1 && (
            <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto', pl: 2 }}>
              {pendingAnnouncements.length - 1} ประกาศเพิ่มเติม
            </Typography>
          )}
          <Button onClick={handleDismiss}>รับทราบ</Button>
        </DialogActions>
      </Dialog>

      {/* Green Gradient Header */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${colors.green[600]} 0%, ${colors.green[800]} 100%)`,
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
            แดชบอร์ดพนักงาน
          </Typography>
          {profile && (
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              สวัสดี {profile.full_name}
            </Typography>
          )}
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
          {activeTab === 0 && <OverviewTab />}
          {activeTab === 1 && <MissionsTab />}
          {activeTab === 2 && <RoadmapTab />}
        </Box>
      </Container>
    </DashboardLayout>
  )
}
