import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'
import { Inbox as InboxIcon } from '@mui/icons-material'

type EmptyStateProps = {
  message: string
  icon?: ReactNode
}

export function EmptyState({ message, icon }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
      }}
    >
      <Box sx={{ color: 'text.disabled', mb: 2, fontSize: 64 }}>
        {icon ?? <InboxIcon sx={{ fontSize: 'inherit' }} />}
      </Box>
      <Typography variant="body1" color="text.secondary" align="center">
        {message}
      </Typography>
    </Box>
  )
}
