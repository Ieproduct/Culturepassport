import { useNavigate } from 'react-router-dom'
import { Box, Typography, Button, Container, Paper } from '@mui/material'
import { Assignment, Timeline, Groups } from '@mui/icons-material'
import { space } from '@/theme/spacing'
import { Footer } from '@/components/layout/Footer'

const RED = '#F62B25'

const features = [
  {
    icon: Assignment,
    title: 'ติดตามภารกิจ',
    description: 'มอบหมายและติดตามความคืบหน้าภารกิจของพนักงานใหม่',
  },
  {
    icon: Timeline,
    title: 'แผนการเรียนรู้',
    description: 'วาง Roadmap การเรียนรู้ตั้งแต่วันแรกจนจบทดลองงาน',
  },
  {
    icon: Groups,
    title: 'จัดการทีม',
    description: 'หัวหน้าทีม Review และติดตามผลงานของสมาชิก',
  },
] as const

export function HomePage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(170.6deg, #E7000B 0%, #C10007 50%, #A50036 100%)',
          color: '#FFFFFF',
          py: { xs: space[80], md: space[120] },
          px: { xs: space[16], sm: space[24] },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: space[12], mb: space[24] }}>
            <Box
              component="img"
              src="/logo.png"
              alt="CulturePassport"
              sx={{ width: '64px', height: '64px' }}
            />
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: '#FFFFFF', fontSize: { xs: 24, md: 32 } }}
            >
              CulturePassport
            </Typography>
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              mb: space[16],
              fontSize: { xs: 18, md: 24 },
              color: 'rgba(255,255,255,0.95)',
            }}
          >
            ระบบติดตามการเข้าปรับตัวพนักงานใหม่
          </Typography>

          <Typography
            sx={{
              mb: space[40],
              fontSize: { xs: 14, md: 16 },
              color: 'rgba(255,255,255,0.8)',
              maxWidth: 520,
              mx: 'auto',
            }}
          >
            จัดการ Onboarding อย่างเป็นระบบ ติดตามความคืบหน้า และสร้างประสบการณ์ที่ดีให้พนักงานใหม่
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: '#FFFFFF',
              color: RED,
              fontWeight: 700,
              fontSize: 16,
              px: space[40],
              py: space[12],
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
            }}
          >
            เข้าสู่ระบบ
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: space[64], md: space[96] }, px: { xs: space[16], sm: space[24] }, bgcolor: '#FFFFFF', flex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, textAlign: 'center', mb: space[48], color: '#1F2937', fontSize: { xs: 20, md: 28 } }}
          >
            จุดเด่นของระบบ
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: space[32],
            }}
          >
            {features.map((f) => (
              <Paper
                key={f.title}
                elevation={0}
                sx={{
                  p: space[32],
                  borderRadius: '16px',
                  border: '1px solid #E5E7EB',
                  textAlign: 'center',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 24px rgba(0,0,0,0.08)' },
                }}
              >
                <Box
                  sx={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '12px',
                    bgcolor: '#FEF2F2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: space[20],
                  }}
                >
                  <f.icon sx={{ fontSize: 28, color: RED }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18, mb: space[8], color: '#1F2937' }}>
                  {f.title}
                </Typography>
                <Typography sx={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
                  {f.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Bottom CTA Section */}
      <Box
        sx={{
          py: { xs: space[48], md: space[64] },
          px: { xs: space[16], sm: space[24] },
          bgcolor: '#F9FAFB',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: space[16], color: '#1F2937', fontSize: { xs: 18, md: 22 } }}
          >
            พร้อมเริ่มต้นใช้งาน?
          </Typography>
          <Typography sx={{ mb: space[24], fontSize: 14, color: '#6B7280' }}>
            เข้าสู่ระบบเพื่อเริ่มจัดการ Onboarding พนักงานใหม่ของคุณ
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              bgcolor: RED,
              fontWeight: 700,
              fontSize: 16,
              px: space[40],
              py: space[12],
              borderRadius: '12px',
              textTransform: 'none',
              '&:hover': { bgcolor: '#DC2626' },
            }}
          >
            เริ่มต้นใช้งาน
          </Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}
