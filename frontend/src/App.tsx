import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { theme } from '@/theme'
import { ServiceProvider } from '@/services'
import { AuthProvider, MockAuthProvider } from '@/contexts/AuthContext'
import { RoleGuard } from '@/guards/RoleGuard'
import { LoginPage } from '@/pages/LoginPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { ManagerDashboard } from '@/pages/manager/ManagerDashboard'
import { EmployeeDashboard } from '@/pages/employee/EmployeeDashboard'

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <ServiceProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/admin/*"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <AdminDashboard />
                </RoleGuard>
              }
            />

            <Route
              path="/manager/*"
              element={
                <RoleGuard allowedRoles={['manager']}>
                  <ManagerDashboard />
                </RoleGuard>
              }
            />

            <Route
              path="/employee/*"
              element={
                <RoleGuard allowedRoles={['employee']}>
                  <EmployeeDashboard />
                </RoleGuard>
              }
            />

            {/* Dev preview routes — mock data, no auth required */}
            <Route
              path="/preview/admin"
              element={
                <MockAuthProvider>
                  <AdminDashboard />
                </MockAuthProvider>
              }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      </ServiceProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
