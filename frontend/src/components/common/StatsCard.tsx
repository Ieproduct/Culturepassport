import type { ReactNode } from 'react'
import { Card, CardContent, Box, Typography, Stack } from '@mui/material'

type StatsCardProps = {
  icon: ReactNode
  label: string
  value: string | number
  color: string
  trend?: string
}

export function StatsCard({ icon, label, value, color, trend }: StatsCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" component="div" fontWeight={700} sx={{ mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              {label}
            </Typography>
            {trend && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                {trend}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
