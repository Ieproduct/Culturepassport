import { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Box,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { colors } from '@/theme'
import type { UserRole } from '@/types'

const roleLabelMap: Record<UserRole, string> = {
  admin: 'Admin',
  manager: 'Manager',
  employee: 'Employee',
}

const roleColorMap: Record<UserRole, string> = {
  admin: colors.red[600],
  manager: colors.blue[600],
  employee: colors.green[600],
}

export function Navbar() {
  const { profile, role, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    handleMenuClose()
    await logout()
    navigate('/login', { replace: true })
  }

  const handleLogoClick = () => {
    if (role) {
      navigate(`/${role}`)
    }
  }

  return (
    <AppBar position="sticky" sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', fontWeight: 700, color: colors.red[600] }}
          onClick={handleLogoClick}
        >
          CulturePassport
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {profile && role && (
          <>
            <Chip
              label={roleLabelMap[role]}
              size="small"
              sx={{
                backgroundColor: roleColorMap[role],
                color: 'white',
                fontWeight: 600,
              }}
            />
            <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
              {profile.full_name}
            </Typography>
            <IconButton onClick={handleMenuOpen} sx={{ p: 0.5 }}>
              <Avatar
                src={profile.avatar_url ?? undefined}
                alt={profile.full_name}
                sx={{ width: 36, height: 36 }}
              >
                {profile.full_name.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem disabled>
                <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
                <ListItemText>{profile.full_name}</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                <ListItemText>ออกจากระบบ</ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}
