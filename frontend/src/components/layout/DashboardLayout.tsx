import { Box } from '@mui/material'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import type { ReactNode } from 'react'

type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3,
          px: { xs: 2, sm: 3 },
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  )
}
