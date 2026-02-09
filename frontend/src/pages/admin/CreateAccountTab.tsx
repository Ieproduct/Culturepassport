import { useState } from 'react'
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Alert, Stack, Typography } from '@mui/material'
import { CascadingFilter } from '@/components/common/CascadingFilter'
import { useCascadingFilter } from '@/hooks/useCascadingFilter'
import { supabase } from '@/lib/supabase'
import type { UserRole } from '@/types'

export function CreateAccountTab() {
  const filter = useCascadingFilter()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('employee')
  const [probationStart, setProbationStart] = useState('')
  const [probationDays, setProbationDays] = useState(120)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const resetForm = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPassword('')
    setRole('employee')
    setProbationStart('')
    setProbationDays(120)
    filter.setSelectedCompany(null)
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)

    // Validation
    if (!firstName.trim() || !lastName.trim()) { setError('กรุณากรอกชื่อและนามสกุล'); return }
    if (!email.trim()) { setError('กรุณากรอกอีเมล'); return }
    if (password.length < 8) { setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'); return }

    setLoading(true)
    try {
      // Calculate probation end date
      let probationEnd: string | null = null
      if (role === 'employee' && probationStart) {
        const start = new Date(probationStart)
        start.setDate(start.getDate() + probationDays)
        probationEnd = start.toISOString().split('T')[0]
      }

      // Call edge function to create user
      const { data, error: fnError } = await supabase.functions.invoke('create-user', {
        body: {
          email: email.trim(),
          password,
          full_name: `${firstName.trim()} ${lastName.trim()}`,
          role,
          company_id: filter.selectedCompany,
          department_id: filter.selectedDepartment,
          position_id: filter.selectedPosition,
          probation_start: role === 'employee' ? probationStart || null : null,
          probation_end: probationEnd,
        },
      })

      if (fnError) throw fnError
      if (data?.error) throw new Error(data.error)

      setSuccess(`สร้างบัญชี ${email.trim()} สำเร็จ`)
      resetForm()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'สร้างบัญชีไม่สำเร็จ'
      if (msg.includes('already') || msg.includes('duplicate')) {
        setError('อีเมลนี้ถูกใช้แล้ว')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: { xs: '100%', sm: 600 } }}>
      <Typography variant="h6" fontWeight={600} mb={3}>สร้างบัญชีผู้ใช้ใหม่</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="ชื่อ" value={firstName} onChange={(e) => setFirstName(e.target.value)} required fullWidth />
          <TextField label="นามสกุล" value={lastName} onChange={(e) => setLastName(e.target.value)} required fullWidth />
        </Stack>

        <TextField label="อีเมล" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
        <TextField label="รหัสผ่าน" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required helperText="อย่างน้อย 8 ตัวอักษร" fullWidth />

        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select value={role} label="Role" onChange={(e) => setRole(e.target.value as UserRole)}>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
          </Select>
        </FormControl>

        <CascadingFilter
          companies={filter.companies}
          departments={filter.departments}
          positions={filter.positions}
          selectedCompany={filter.selectedCompany}
          selectedDepartment={filter.selectedDepartment}
          selectedPosition={filter.selectedPosition}
          onCompanyChange={filter.setSelectedCompany}
          onDepartmentChange={filter.setSelectedDepartment}
          onPositionChange={filter.setSelectedPosition}
        />

        {role === 'employee' && (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="วันเริ่มงาน"
              type="date"
              value={probationStart}
              onChange={(e) => setProbationStart(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
            />
            <TextField
              label="ระยะเวลาทดลองงาน (วัน)"
              type="number"
              value={probationDays}
              onChange={(e) => setProbationDays(Number(e.target.value))}
              inputProps={{ min: 1 }}
              fullWidth
            />
          </Stack>
        )}

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          disabled={loading || !firstName.trim() || !lastName.trim() || !email.trim() || password.length < 8}
          sx={{ alignSelf: 'flex-start' }}
        >
          {loading ? 'กำลังสร้าง...' : 'สร้างบัญชี'}
        </Button>
      </Stack>
    </Box>
  )
}
