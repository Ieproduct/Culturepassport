import { Box } from '@mui/material'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
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
        background: 'linear-gradient(147deg, #F9FAFB 0%, #FFFFFF 50%, #F9FAFB 100%)',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: '24px',
          px: { xs: '16px', sm: '24px', md: '32px' },
          maxWidth: 1280,
          width: '100%',
          mx: 'auto',
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  )
}
