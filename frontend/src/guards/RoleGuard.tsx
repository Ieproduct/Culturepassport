import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types'
import { Box, CircularProgress } from '@mui/material'

type RoleGuardProps = {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

const roleHomePaths: Record<UserRole, string> = {
  admin: '/admin',
  manager: '/manager',
  employee: '/employee',
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role, loading, session } = useAuth()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Not authenticated → redirect to login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  // No role yet (profile still loading)
  if (!role) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Role not allowed → redirect to own dashboard
  if (!allowedRoles.includes(role)) {
    return <Navigate to={roleHomePaths[role]} replace />
  }

  return <>{children}</>
}
