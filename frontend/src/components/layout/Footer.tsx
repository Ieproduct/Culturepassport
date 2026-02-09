import { Box, Typography } from '@mui/material'
import { colors } from '@/theme'

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        mt: 'auto',
        backgroundColor: colors.base.white,
        borderTop: `1px solid ${colors.gray[200]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 4 },
        py: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: '18px',
            color: colors.gray[400],
            whiteSpace: 'nowrap',
          }}
        >
          Copyright &copy; {new Date().getFullYear()} LOTTERYPLUS. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}
