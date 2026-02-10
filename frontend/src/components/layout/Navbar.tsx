import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { IconCategory } from '@/components/icons/IconCategory'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '@/types'

const roleLabelMap: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  employee: 'Employee',
}

const pageTitleMap: Record<UserRole, string> = {
  admin: 'แดชบอร์ดผู้ดูแลระบบ',
  manager: 'แดชบอร์ดผู้จัดการ',
  employee: 'แดชบอร์ดพนักงาน',
}

export function Navbar() {
  const { profile, role, logout } = useAuth()
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const handleLogoutConfirm = async () => {
    setLogoutLoading(true)
    await logout()
    navigate('/login', { replace: true })
  }

  const handleLogoClick = () => {
    if (role) navigate(`/${role}`)
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((w) => w[0]).join('').slice(0, 2)
    : '?'

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: { xs: 56, sm: 60, md: 64 },
          px: { xs: '12px', sm: '20px', md: '32px' },
          maxWidth: 1280,
          mx: 'auto',
          width: '100%',
        }}
      >
        {/* ══ Left: Logo + Brand ══ */}
        <Box
          onClick={handleLogoClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: '8px', sm: '12px' },
            cursor: 'pointer',
            height: 44,
            flexShrink: 0,
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: { xs: 32, sm: 40 },
              height: { xs: 32, sm: 40 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              component="img"
              src="/logo.png"
              alt="CulturePassport"
              sx={{
                width: { xs: 28, sm: 36 },
                height: { xs: 28, sm: 36 },
                objectFit: 'cover',
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: { xs: 16, sm: 18, md: 20 },
                lineHeight: '28px',
                color: '#F62B25',
                letterSpacing: '-0.95px',
                whiteSpace: 'nowrap',
              }}
            >
              CulturePassport
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '16px',
                color: '#6A7282',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              ระบบติดตามการเข้าปรับตัว
            </Typography>
          </Box>
        </Box>

        {/* ══ Right: Actions ══ */}
        {profile && role && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: '8px', sm: '12px' },
              height: 46,
              flexShrink: 0,
            }}
          >
            {/* Active page pill — lg+ only */}
            <Box
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                gap: '8px',
                height: 42,
                px: '17px',
                bgcolor: '#FEF2F2',
                border: '1px solid #FFC9C9',
                borderRadius: '10px',
                cursor: 'default',
              }}
            >
              <IconCategory variant="solid" sx={{ fontSize: 20, color: '#F62B25' }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: '24px',
                  color: '#F62B25',
                  letterSpacing: '-0.71px',
                  whiteSpace: 'nowrap',
                }}
              >
                {pageTitleMap[role]}
              </Typography>
            </Box>

            {/* Divider — lg+ only */}
            <Box
              sx={{
                width: '1px',
                height: 40,
                bgcolor: '#E5E7EB',
                display: { xs: 'none', lg: 'block' },
                flexShrink: 0,
              }}
            />

            {/* Account button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: { xs: 40, sm: 46 },
                px: { xs: '8px', sm: '13px' },
                bgcolor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                cursor: 'pointer',
                flexShrink: 0,
                '&:hover': { bgcolor: '#F3F4F6' },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: '#F62B25',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                    fontWeight: 600,
                    fontSize: 12,
                    lineHeight: '16px',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}
                >
                  {initials}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: { xs: 'none', sm: 'flex' },
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 500,
                    fontSize: 12,
                    lineHeight: '12px',
                    color: '#6A7282',
                    textAlign: 'center',
                  }}
                >
                  Account
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: '14px',
                    color: '#101828',
                    letterSpacing: '-0.15px',
                    textAlign: 'center',
                  }}
                >
                  {roleLabelMap[role]}
                </Typography>
              </Box>
            </Box>

            {/* Logout button */}
            <Box
              onClick={() => setLogoutOpen(true)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                height: 40,
                px: { xs: '8px', sm: '16px' },
                borderRadius: '10px',
                cursor: 'pointer',
                flexShrink: 0,
                '&:hover': { bgcolor: '#FEF2F2' },
              }}
            >
              <LogoutIcon sx={{ fontSize: 20, color: '#E7000B' }} />
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: '24px',
                  color: '#E7000B',
                  letterSpacing: '-0.71px',
                  whiteSpace: 'nowrap',
                  display: { xs: 'none', md: 'block' },
                }}
              >
                ออกจากระบบ
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* ═══ Logout Confirm Modal (Figma 40:11787) ═══ */}
      <ConfirmDialog
        open={logoutOpen}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutOpen(false)}
        loading={logoutLoading}
      />
    </Box>
  )
}
