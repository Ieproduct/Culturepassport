import { Box } from '@mui/material'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { space } from '@/theme/spacing'
import type { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: '#F9FAFB',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          py: space[32],
          px: { xs: space[16], sm: space[24], lg: space[32] },
          maxWidth: 1280,
          width: '100%',
          mx: 'auto',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  )
}
