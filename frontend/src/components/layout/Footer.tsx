import { Box, Typography } from '@mui/material'
import { space } from '@/theme/spacing'
import { FONT_FAMILY_LATIN } from '@/theme/fonts'

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bgcolor: '#FFFFFF',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: space[16], sm: space[24], lg: space[32] },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 1440,
          py: space[16],
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_FAMILY_LATIN,
            fontWeight: 400,
            fontSize: { xs: 12, sm: 14 },
            lineHeight: '18px',
            color: '#9CA3AF',
            textAlign: 'center',
            wordBreak: 'break-word',
          }}
        >
          Copyright &copy; {new Date().getFullYear()} LOTTERYPLUS. All rights reserved (Version {__APP_VERSION__}).
        </Typography>
      </Box>
    </Box>
  )
}
