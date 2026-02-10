import { Box, Typography } from '@mui/material'
import { space } from '@/theme/spacing'
import { colors } from '@/theme'

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        mt: space[48],
        bgcolor: colors.base.white,
        borderTop: `1px solid ${colors.gray[200]}`,
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: space[16], sm: space[24], lg: space[32] },
          py: space[24],
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 400,
            fontSize: 14,
            lineHeight: '20px',
            color: colors.gray[500],
          }}
        >
          CulturePassport &copy; {new Date().getFullYear()} - ระบบติดตามการเข้าปรับตัวพนักงานใหม่
        </Typography>
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 400,
            fontSize: 12,
            lineHeight: '16px',
            color: colors.gray[400],
            mt: space[4],
          }}
        >
          พัฒนาด้วย React + TypeScript | Data Portability Ready (JSON/SQL Export)
        </Typography>
      </Box>
    </Box>
  )
}
