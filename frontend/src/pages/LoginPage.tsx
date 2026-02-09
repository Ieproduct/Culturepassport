import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { colors } from '@/theme'
import type { UserRole } from '@/types'

const roleHomePaths: Record<UserRole, string> = {
  admin: '/admin',
  manager: '/manager',
  employee: '/employee',
}

export function LoginPage() {
  const { login, role, session } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Already logged in → redirect to dashboard
  if (session && role) {
    navigate(roleHomePaths[role], { replace: true })
    return null
  }

  const isFormValid = email.trim().length > 0 && password.length > 0

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!isFormValid) return

    setError(null)
    setLoading(true)

    const result = await login(email, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Auth state change listener in AuthContext will update profile/role
    // Wait briefly for profile to load, then redirect
    const checkAndRedirect = () => {
      // Re-read from supabase session to get role
      // The onAuthStateChange in AuthContext handles this
      // We'll rely on the component re-rendering with updated role
    }
    checkAndRedirect()
    setLoading(false)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${colors.red[600]} 0%, ${colors.red[800]} 100%)`,
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h4" fontWeight={700} color="primary">
              CulturePassport
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ระบบติดตามการเข้าปรับตัวพนักงานใหม่
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  label="อีเมล"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoComplete="email"
                  autoFocus
                />
                <TextField
                  label="รหัสผ่าน"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={!isFormValid || loading}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'เข้าสู่ระบบ'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
