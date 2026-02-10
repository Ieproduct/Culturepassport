import { useState, useEffect, useMemo } from 'react'
import { Box, Typography, Select, MenuItem, TextField, Alert } from '@mui/material'
import {
  Search as SearchIcon,
  Business as CompanyIcon,
  AccountTree as DepartmentIcon,
  Work as PositionIcon,
  SupervisorAccount as RoleIcon,
  Cached as ClearIcon,
} from '@mui/icons-material'
import { space } from '@/theme/spacing'
import { supabase } from '@/lib/supabase'
import { useProfiles } from '@/hooks/useProfiles'
import { useCascadingFilter } from '@/hooks/useCascadingFilter'

/* ─── Constants ─── */
const ROLE_OPTIONS = [
  { value: '', label: 'ทุกบทบาท' },
  { value: 'admin', label: 'ผู้ดูแลระบบ' },
  { value: 'manager', label: 'ผู้จัดการ' },
  { value: 'employee', label: 'พนักงาน' },
]

const ROLE_LABEL_MAP: Record<string, string> = {
  admin: 'ผู้ดูแลระบบ',
  manager: 'ผู้จัดการ',
  employee: 'พนักงาน',
}

const TABLE_COLUMNS = [
  'ชื่อ-นามสกุล',
  'รหัสพนักงาน',
  'อีเมล',
  'บริษัท',
  'แผนก',
  'ตำแหน่ง',
  'บทบาท',
  'สถานะการผ่านโปร',
  'วันที่เริ่มงาน',
]

/* ─── Shared sx for custom select dropdowns (Figma 42:13772) ─── */
const selectSx = {
  height: 40,
  borderRadius: '10px',
  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
  fontSize: 16,
  color: '#0A0A0A',
  letterSpacing: '-0.31px',
  lineHeight: '24px',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D1D5DC',
    borderWidth: '1px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D1D5DC',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#D1D5DC',
    borderWidth: '1px',
  },
  '& .MuiSelect-select': {
    py: 0,
    display: 'flex',
    alignItems: 'center',
  },
}

/* ─── Filter Label (icon + text) — icon gray-500 ─── */
function FilterLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8], height: 20 }}>
      <Box sx={{ display: 'flex', color: '#6B7280', fontSize: 16, flexShrink: 0 }}>{icon}</Box>
      <Typography
        sx={{
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
          fontWeight: 500,
          fontSize: 14,
          lineHeight: '20px',
          color: '#364153',
          letterSpacing: '-0.15px',
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

export function UsersTab() {
  const { profiles, loading, error, fetchProfiles } = useProfiles()
  const filter = useCascadingFilter()

  const [searchText, setSearchText] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [totalCount, setTotalCount] = useState(0)

  /* Fetch total count on mount */
  useEffect(() => {
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .then(({ count }) => setTotalCount(count ?? 0))
  }, [])

  /* Re-fetch profiles when server-side filters change */
  useEffect(() => {
    fetchProfiles({
      companyId: filter.selectedCompany ?? undefined,
      departmentId: filter.selectedDepartment ?? undefined,
      positionId: filter.selectedPosition ?? undefined,
      role: selectedRole || undefined,
    })
  }, [filter.selectedCompany, filter.selectedDepartment, filter.selectedPosition, selectedRole, fetchProfiles])

  /* Name lookup maps for company / department / position */
  const companyMap = useMemo(
    () => new Map(filter.companies.map((c) => [c.id, c.name])),
    [filter.companies],
  )
  const departmentMap = useMemo(
    () => new Map(filter.departments.map((d) => [d.id, d.name])),
    [filter.departments],
  )
  const positionMap = useMemo(
    () => new Map(filter.positions.map((p) => [p.id, p.name])),
    [filter.positions],
  )

  /* Client-side search + active-only filter */
  const filteredProfiles = useMemo(() => {
    const active = profiles.filter((p) => p.status === 'active')
    if (!searchText.trim()) return active
    const lower = searchText.toLowerCase()
    return active.filter((p) => {
      const companyName = p.company_id ? companyMap.get(p.company_id) ?? '' : ''
      const deptName = p.department_id ? departmentMap.get(p.department_id) ?? '' : ''
      const posName = p.position_id ? positionMap.get(p.position_id) ?? '' : ''
      return [p.full_name, p.email, companyName, deptName, posName]
        .join(' ')
        .toLowerCase()
        .includes(lower)
    })
  }, [profiles, searchText, companyMap, departmentMap, positionMap])

  /* Whether any filter is active (controls ล้างทั้งหมด button) */
  const hasActiveFilter =
    !!searchText.trim() ||
    !!filter.selectedCompany ||
    !!filter.selectedDepartment ||
    !!filter.selectedPosition ||
    !!selectedRole

  /* Clear all filters */
  const handleClearAll = () => {
    setSearchText('')
    setSelectedRole('')
    filter.setSelectedCompany(null)
    filter.setSelectedDepartment(null)
    filter.setSelectedPosition(null)
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: space[16] }}>{error}</Alert>}

      {/* ═══ Filter Panel (Figma 42:13745) ═══ */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          p: space[24],
          display: 'flex',
          flexDirection: 'column',
          gap: space[16],
        }}
      >
        {/* ─── Header: Title + Clear Button (42:13746) ─── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 48,
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 600,
              fontSize: 18,
              lineHeight: '27px',
              color: '#6B7280',
              letterSpacing: '-0.44px',
            }}
          >
            ค้นหาและกรองข้อมูล
          </Typography>

          {/* ล้างทั้งหมด Button (42:13749) — disabled when no filter active */}
          <Box
            onClick={hasActiveFilter ? handleClearAll : undefined}
            sx={{
              bgcolor: '#FFFFFF',
              border: '2px solid',
              borderColor: hasActiveFilter ? '#F62B25' : '#D1D5DC',
              borderRadius: '10px',
              height: 48,
              display: 'flex',
              alignItems: 'center',
              gap: space[8],
              px: space[20],
              cursor: hasActiveFilter ? 'pointer' : 'default',
              flexShrink: 0,
              opacity: hasActiveFilter ? 1 : 0.5,
              transition: 'all 0.2s',
              '&:hover': hasActiveFilter ? { bgcolor: '#FEF2F2' } : {},
            }}
          >
            <ClearIcon sx={{ fontSize: 16, color: hasActiveFilter ? '#F62B25' : '#9CA3AF' }} />
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: '24px',
                color: hasActiveFilter ? '#F62B25' : '#9CA3AF',
                letterSpacing: '-0.31px',
                whiteSpace: 'nowrap',
              }}
            >
              ล้างทั้งหมด
            </Typography>
          </Box>
        </Box>

        {/* ─── Search Input (42:13754) ─── */}
        <Box sx={{ position: 'relative', width: '100%' }}>
          <SearchIcon
            sx={{
              position: 'absolute',
              left: space[12],
              top: 15,
              fontSize: 20,
              color: 'rgba(10,10,10,0.5)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
          <TextField
            fullWidth
            placeholder="ค้นหาตามชื่อ, อีเมล, รหัสพนักงาน, บริษัท, แผนก, ตำแหน่ง..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 48,
                borderRadius: '10px',
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontSize: 16,
                letterSpacing: '-0.31px',
                '& .MuiOutlinedInput-input': {
                  pl: space[40],
                  py: space[12],
                  '&::placeholder': {
                    color: 'rgba(10,10,10,0.5)',
                    opacity: 1,
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DC',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DC',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DC',
                  borderWidth: '1px',
                },
              },
            }}
          />
        </Box>

        {/* ─── Filter Dropdowns Grid (42:13760) ─── */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: space[16],
          }}
        >
          {/* บริษัท (42:13761) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
            <FilterLabel icon={<CompanyIcon sx={{ fontSize: 16 }} />}>บริษัท</FilterLabel>
            <Select
              value={filter.selectedCompany ?? ''}
              onChange={(e) => filter.setSelectedCompany(e.target.value || null)}
              displayEmpty
              sx={selectSx}
            >
              <MenuItem value="">ทุกบริษัท</MenuItem>
              {filter.companies.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
          </Box>

          {/* แผนก (42:13825) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
            <FilterLabel icon={<DepartmentIcon sx={{ fontSize: 16 }} />}>แผนก</FilterLabel>
            <Select
              value={filter.selectedDepartment ?? ''}
              onChange={(e) => filter.setSelectedDepartment(e.target.value || null)}
              displayEmpty
              sx={selectSx}
            >
              <MenuItem value="">ทุกแผนก</MenuItem>
              {filter.departments.map((d) => (
                <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
              ))}
            </Select>
          </Box>

          {/* ตำแหน่ง (42:13844) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
            <FilterLabel icon={<PositionIcon sx={{ fontSize: 16 }} />}>ตำแหน่ง</FilterLabel>
            <Select
              value={filter.selectedPosition ?? ''}
              onChange={(e) => filter.setSelectedPosition(e.target.value || null)}
              displayEmpty
              sx={selectSx}
            >
              <MenuItem value="">ทุกตำแหน่ง</MenuItem>
              {filter.positions.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
              ))}
            </Select>
          </Box>

          {/* บทบาท (42:13853) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
            <FilterLabel icon={<RoleIcon sx={{ fontSize: 16 }} />}>บทบาท</FilterLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              displayEmpty
              sx={selectSx}
            >
              {ROLE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* ─── Bottom: Result Count (42:13871) ─── */}
        <Box sx={{ borderTop: '1px solid #E5E7EB', pt: space[16] }}>
          <Typography
            component="div"
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: '#4A5565',
              letterSpacing: '-0.15px',
            }}
          >
            แสดง{' '}
            <Box component="span" sx={{ fontWeight: 600, color: '#155DFC' }}>
              {filteredProfiles.length}
            </Box>
            {' '}รายการจากทั้งหมด{' '}
            <Box component="span" sx={{ fontWeight: 600, color: '#101828' }}>
              {totalCount}
            </Box>
            {' '}รายการ
          </Typography>
        </Box>
      </Box>

      {/* ═══ Table Section (Figma 42:13880) ═══ */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          overflow: 'hidden',
          mt: space[16],
        }}
      >
        {/* ─── Table Title (42:13881) ─── */}
        <Box
          sx={{
            borderBottom: '1px solid #E5E7EB',
            p: space[20],
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 600,
              fontSize: 18,
              lineHeight: '27px',
              color: '#6B7280',
              letterSpacing: '-0.44px',
            }}
          >
            ผู้ใช้งานทั้งหมด ({filteredProfiles.length})
          </Typography>
        </Box>

        {/* ─── Table (42:13884) ─── */}
        <Box sx={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              minWidth: 1000,
              borderCollapse: 'collapse',
            }}
          >
            {/* ─── Table Header (42:13885) ─── */}
            <thead>
              <tr>
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col}
                    style={{
                      backgroundColor: '#F9FAFB',
                      borderBottom: '1px solid #E5E7EB',
                      height: 40,
                      padding: `0 ${space[24]}`,
                      textAlign: 'left',
                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      lineHeight: '16px',
                      color: '#4A5565',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            {/* ─── Table Body ─── */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: `${space[64]} ${space[24]}` }}>
                    <Typography
                      sx={{
                        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                        fontWeight: 500,
                        fontSize: 16,
                        color: '#6A7282',
                      }}
                    >
                      กำลังโหลด...
                    </Typography>
                  </td>
                </tr>
              ) : filteredProfiles.length === 0 ? (
                /* ─── Empty State (42:13908) ─── */
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: `${space[48]} ${space[24]}` }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: space[12],
                      }}
                    >
                      <SearchIcon sx={{ fontSize: 48, color: '#9CA3AF' }} />
                      <Typography
                        sx={{
                          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                          fontWeight: 500,
                          fontSize: 16,
                          lineHeight: '24px',
                          color: '#6A7282',
                          letterSpacing: '-0.31px',
                        }}
                      >
                        ไม่พบผู้ใช้ที่ตรงกับเงื่อนไขการค้นหา
                      </Typography>
                      <Typography
                        onClick={handleClearAll}
                        sx={{
                          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                          fontWeight: 500,
                          fontSize: 14,
                          lineHeight: '20px',
                          color: '#F62B25',
                          letterSpacing: '-0.15px',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.8 },
                        }}
                      >
                        ล้างทั้งหมด
                      </Typography>
                    </Box>
                  </td>
                </tr>
              ) : (
                /* ─── Data Rows ─── */
                filteredProfiles.map((profile) => (
                  <tr
                    key={profile.id}
                    style={{ borderBottom: '1px solid #E5E7EB' }}
                  >
                    <td style={cellStyle}>{profile.full_name}</td>
                    <td style={cellStyle}>-</td>
                    <td style={cellStyle}>{profile.email}</td>
                    <td style={cellStyle}>
                      {profile.company_id ? companyMap.get(profile.company_id) ?? '-' : '-'}
                    </td>
                    <td style={cellStyle}>
                      {profile.department_id ? departmentMap.get(profile.department_id) ?? '-' : '-'}
                    </td>
                    <td style={cellStyle}>
                      {profile.position_id ? positionMap.get(profile.position_id) ?? '-' : '-'}
                    </td>
                    <td style={cellStyle}>
                      {ROLE_LABEL_MAP[profile.role] ?? profile.role}
                    </td>
                    <td style={cellStyle}>
                      {profile.probation_end
                        ? new Date(profile.probation_end) < new Date()
                          ? 'ผ่านแล้ว'
                          : 'อยู่ระหว่างทดลอง'
                        : '-'}
                    </td>
                    <td style={cellStyle}>
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString('th-TH')
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Shared cell style for data rows ─── */
const cellStyle: React.CSSProperties = {
  padding: `${space[12]} ${space[24]}`,
  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
  fontSize: 14,
  lineHeight: '20px',
  color: '#4A5565',
  whiteSpace: 'nowrap',
}
