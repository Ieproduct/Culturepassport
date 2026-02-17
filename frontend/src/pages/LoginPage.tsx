import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  Link,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types'

const RED = '#F62B25'

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
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Redirect when session + role are ready
  useEffect(() => {
    if (session && role) {
      navigate(roleHomePaths[role], { replace: true })
    }
  }, [session, role, navigate])

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

    // Keep loading=true until useEffect redirect fires
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(147deg, #F9FAFB 0%, #FFFFFF 50%, #F9FAFB 100%)',
        px: 2,
        py: 4,
      }}
    >
      <Box sx={{ width: 448 }}>
        {/* Logo & Branding */}
        <Stack spacing={2} alignItems="center" mb={4}>
          <Box
            component="img"
            src="/logo.png"
            alt="CulturePassport"
            sx={{ width: 64, height: 64, objectFit: 'contain' }}
          />
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 30,
              lineHeight: '36px',
              color: RED,
              letterSpacing: '0.4px',
              textAlign: 'center',
            }}
          >
            CulturePassport
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              lineHeight: '20px',
              color: '#4A5565',
              letterSpacing: '-0.15px',
              textAlign: 'center',
            }}
          >
            ระบบติดตามการเข้าปรับตัวพนักงานใหม่
          </Typography>
        </Stack>

        {/* Login Card */}
        <Box
          sx={{
            bgcolor: '#FFFFFF',
            border: '1px solid #F3F4F6',
            borderRadius: '16px',
            boxShadow: '0px 10px 15px rgba(0,0,0,0.1), 0px 4px 6px rgba(0,0,0,0.1)',
            px: '33px',
            pt: '33px',
            pb: '33px',
          }}
        >
          {/* Card Header */}
          <Stack spacing={1} alignItems="center" mb={3}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 24,
                lineHeight: '32px',
                color: RED,
                letterSpacing: '0.07px',
                textAlign: 'center',
              }}
            >
              กรอกข้อมูลเพื่อเข้าใช้งาน
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: '20px',
                color: '#4A5565',
                letterSpacing: '-0.15px',
                textAlign: 'center',
              }}
            >
              ใช้อีเมลและรหัสผ่านของคุณเพื่อเข้าสู่ระบบ
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing="20px">
              {/* Email */}
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#364153',
                    letterSpacing: '-0.15px',
                    mb: 1,
                  }}
                >
                  อีเมล
                </Typography>
                <TextField
                  type="email"
                  placeholder="example@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  autoComplete="email"
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: '#9CA3AF', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      height: 50,
                      '& fieldset': { borderColor: '#D1D5DC' },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: 16,
                      letterSpacing: '-0.31px',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(10,10,10,0.5)',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              {/* Password */}
              <Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#364153',
                    letterSpacing: '-0.15px',
                    mb: 1,
                  }}
                >
                  รหัสผ่าน
                </Typography>
                <TextField
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#9CA3AF', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          sx={{ color: '#9CA3AF' }}
                        >
                          {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '10px',
                      height: 50,
                      '& fieldset': { borderColor: '#D1D5DC' },
                    },
                    '& .MuiInputBase-input': {
                      fontSize: 16,
                      letterSpacing: '-0.31px',
                    },
                    '& .MuiInputBase-input::placeholder': {
                      color: 'rgba(10,10,10,0.5)',
                      opacity: 1,
                    },
                  }}
                />
              </Box>

              {/* Remember me & Forgot password */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      size="small"
                      sx={{
                        color: '#9CA3AF',
                        '&.Mui-checked': { color: RED },
                      }}
                    />
                  }
                  label="จดจำฉัน"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#4A5565',
                      letterSpacing: '-0.15px',
                    },
                  }}
                />
                <Link
                  component="button"
                  type="button"
                  underline="none"
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: '20px',
                    color: RED,
                    letterSpacing: '-0.15px',
                  }}
                >
                  ลืมรหัสผ่าน?
                </Link>
              </Box>

              {/* Submit */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={!isFormValid || loading}
                startIcon={!loading && <LoginIcon />}
                sx={{
                  height: 48,
                  borderRadius: '10px',
                  bgcolor: RED,
                  fontWeight: 600,
                  fontSize: 16,
                  letterSpacing: '-0.31px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#E02520',
                    boxShadow: 'none',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'เข้าสู่ระบบ'}
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
