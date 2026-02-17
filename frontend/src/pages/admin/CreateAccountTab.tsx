import { useState } from 'react'
import {
  Box,
  Typography,
  InputBase,
  Select,
  MenuItem,
  Alert,
  type SelectChangeEvent,
} from '@mui/material'
import { useServices } from '@/services'
import { FONT_FAMILY, FONT_FAMILY_LATIN } from '@/theme/fonts'
import {
  IconUserPlusHeader,
  IconPerson,
  IconMail,
  IconBuilding,
  IconBriefcase,
  IconStar,
  IconUserCheck,
  IconUserPlusBtn,
  DropdownIcon,
} from './create-account-icons'
import { SuccessModal, type ModalData } from './CreateAccountSuccessModal'

/* ═══════════════════════════════════════════════════════════
   Mock Data
   ═══════════════════════════════════════════════════════════ */
const MOCK_COMPANIES = [
  'บริษัท เทคโนโลยี จำกัด (มหาชน)',
  'บริษัท ซอฟต์แวร์ จำกัด',
  'บริษัท ดิจิทัล โซลูชัน จำกัด',
  'บริษัท อินโนเวชั่น จำกัด',
  'บริษัท คลาวด์ เซอร์วิส จำกัด',
]

const MOCK_DEPARTMENTS: Record<string, string[]> = {
  'บริษัท เทคโนโลยี จำกัด (มหาชน)': ['ทรัพยากรบุคคล', 'วิศวกรรม', 'การตลาด', 'การเงิน'],
  'บริษัท ซอฟต์แวร์ จำกัด': ['พัฒนาซอฟต์แวร์', 'QA', 'DevOps'],
  'บริษัท ดิจิทัล โซลูชัน จำกัด': ['UX/UI', 'Frontend', 'Backend'],
  'บริษัท อินโนเวชั่น จำกัด': ['R&D', 'Product', 'Design'],
  'บริษัท คลาวด์ เซอร์วิส จำกัด': ['Infrastructure', 'Security', 'Support'],
}

const MOCK_POSITIONS = [
  'Software Engineer',
  'Product Manager',
  'UX Designer',
  'QA Engineer',
  'DevOps Engineer',
  'Data Analyst',
  'Project Manager',
  'HR Specialist',
]

const MOCK_LEVELS = [
  'Junior',
  'Senior',
  'Lead',
  'Manager/Teamlead',
  'Director',
]

const MOCK_APPROVERS = [
  'สมชาย ผู้จัดการ',
  'วิไล หัวหน้าทีม',
  'ประภาส ผู้อำนวยการ',
  'กมลวรรณ ผู้จัดการฝ่าย',
]

/* ═══════════════════════════════════════════════════════════
   Shared Styles
   ═══════════════════════════════════════════════════════════ */
const iconSx = { fontSize: 20, color: '#99A1AF' }

const iconAbsSx = {
  position: 'absolute' as const,
  left: 12,
  top: 13,
  zIndex: 1,
  pointerEvents: 'none' as const,
  display: 'flex',
}

const inputBaseSx = {
  width: '100%',
  height: 46,
  border: '1px solid #d1d5dc',
  borderRadius: '10px',
  pl: '40px',
  pr: '16px',
  fontSize: 16,
  fontFamily: FONT_FAMILY,
  letterSpacing: '-0.31px',
  '& input': { p: 0, height: '100%' },
  '& input::placeholder': {
    color: 'rgba(10,10,10,0.5)',
    opacity: 1,
    letterSpacing: '-0.31px',
  },
}

const selectSx = {
  height: 46,
  borderRadius: '10px',
  fontSize: 16,
  fontFamily: FONT_FAMILY,
  letterSpacing: '-0.31px',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5dc', borderWidth: '1px !important' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5dc' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5dc', borderWidth: '1px !important' },
  '& .MuiSelect-select': { pl: '40px !important', display: 'flex', alignItems: 'center' },
  '&.Mui-disabled': {
    bgcolor: '#f3f4f6',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#d1d5dc' },
  },
}

const placeholderStyle = { color: 'rgba(10,10,10,0.5)', fontFamily: FONT_FAMILY, fontSize: 16, letterSpacing: '-0.31px' }

/* ═══════════════════════════════════════════════════════════
   FormField – reusable labeled field wrapper
   ═══════════════════════════════════════════════════════════ */
function FormField({
  label,
  required,
  helperText,
  children,
}: {
  label: string
  required?: boolean
  helperText?: string
  children: React.ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
        <Typography
          sx={{
            fontFamily: FONT_FAMILY,
            fontWeight: 500,
            fontSize: 14,
            lineHeight: '20px',
            color: '#364153',
            letterSpacing: '-0.15px',
          }}
        >
          {label}
        </Typography>
        {required && (
          <Typography
            sx={{
              fontFamily: FONT_FAMILY_LATIN,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '20px',
              color: '#fb2c36',
              letterSpacing: '-0.15px',
            }}
          >
            *
          </Typography>
        )}
      </Box>
      {children}
      {helperText && (
        <Typography
          sx={{
            fontFamily: FONT_FAMILY,
            fontWeight: 400,
            fontSize: 12,
            lineHeight: '16px',
            color: '#6a7282',
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  )
}

/* ═══════════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════════ */
export function CreateAccountTab() {
  const { admin: adminService } = useServices()
  /* ─── Form state ─── */
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [department, setDepartment] = useState('')
  const [position, setPosition] = useState('')
  const [level, setLevel] = useState('')
  const [approver, setApprover] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState<ModalData | null>(null)

  /* ─── Derived state ─── */
  const deptEnabled = !!company
  const posEnabled = !!department
  const levelEnabled = !!position
  const approverEnabled = !!level
  const departments = company ? (MOCK_DEPARTMENTS[company] ?? []) : []
  const isValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    !!company &&
    !!department &&
    !!position &&
    !!level &&
    !!approver

  /* ─── Handlers ─── */
  const handleCompanyChange = (e: SelectChangeEvent) => {
    setCompany(e.target.value)
    setDepartment('')
    setPosition('')
    setLevel('')
    setApprover('')
  }

  const handleDepartmentChange = (e: SelectChangeEvent) => {
    setDepartment(e.target.value)
    setPosition('')
    setLevel('')
    setApprover('')
  }

  const handlePositionChange = (e: SelectChangeEvent) => {
    setPosition(e.target.value)
    setLevel('')
    setApprover('')
  }

  const handleLevelChange = (e: SelectChangeEvent) => {
    setLevel(e.target.value)
    setApprover('')
  }

  const resetForm = () => {
    setFullName('')
    setEmail('')
    setCompany('')
    setDepartment('')
    setPosition('')
    setLevel('')
    setApprover('')
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(null)

    if (!fullName.trim()) { setError('กรุณากรอกชื่อ-นามสกุล'); return }
    if (!email.trim()) { setError('กรุณากรอกอีเมล'); return }
    if (!company) { setError('กรุณาเลือกบริษัท'); return }

    // Auto-generate a secure random password
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$'
    const generatedPassword = Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

    // Capture form data for the success modal before any async operation
    const submittedData: ModalData = {
      fullName: fullName.trim(),
      email: email.trim(),
      password: generatedPassword,
      company,
      department,
      position,
      level,
      approver,
    }

    setLoading(true)
    try {
      // In preview mode (no real Supabase), skip the API call
      const isPreview = window.location.pathname.startsWith('/preview')
      if (!isPreview) {
        await adminService.createUser({
          email: email.trim(),
          password: generatedPassword,
          full_name: fullName.trim(),
          role: 'employee',
          company_name: company,
          department_name: department,
          position_name: position,
          level_name: level,
          approver_name: approver,
        })
      }

      setModalData(submittedData)
      setShowModal(true)
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

  const handleCloseModal = () => {
    setShowModal(false)
    setModalData(null)
  }

  /* ─── Render ─── */
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: '16px', md: 0 } }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 672,
          bgcolor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          boxShadow: '0px 1px 3px rgba(0,0,0,0.1), 0px 1px 2px rgba(0,0,0,0.1)',
          pt: '25px',
          px: { xs: '16px', sm: '25px' },
          pb: '1px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Alerts */}
        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>}

        {/* Header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconUserPlusHeader sx={{ fontSize: 28, color: '#155DFC' }} />
            <Typography
              sx={{
                fontFamily: FONT_FAMILY,
                fontWeight: 700,
                fontSize: 24,
                lineHeight: '32px',
                color: '#101828',
                letterSpacing: '0.07px',
              }}
            >
              สร้าง Account
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '24px',
              color: '#4a5565',
              letterSpacing: '-0.31px',
            }}
          >
            เพิ่มบัญชีพนักงานใหม่เข้าสู่ระบบ
          </Typography>
        </Box>

        {/* Form */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ชื่อ-นามสกุล */}
          <FormField label="ชื่อ-นามสกุล" required>
            <Box sx={{ position: 'relative' }}>
              <Box sx={iconAbsSx}>
                <IconPerson sx={iconSx} />
              </Box>
              <InputBase
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="สมชาย ใจดี"
                sx={inputBaseSx}
              />
            </Box>
          </FormField>

          {/* อีเมล */}
          <FormField label="อีเมล" required>
            <Box sx={{ position: 'relative' }}>
              <Box sx={iconAbsSx}>
                <IconMail sx={iconSx} />
              </Box>
              <InputBase
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com"
                type="email"
                sx={inputBaseSx}
              />
            </Box>
          </FormField>

          {/* บริษัท */}
          <FormField label="บริษัท" required helperText="เลือกบริษัทในเครือ (25 บริษัท)">
            <Box sx={{ position: 'relative' }}>
              <Box sx={iconAbsSx}>
                <IconBuilding sx={iconSx} />
              </Box>
              <Select
                value={company}
                onChange={handleCompanyChange}
                displayEmpty
                fullWidth
                IconComponent={DropdownIcon}
                sx={selectSx}
                renderValue={(v) =>
                  v || (
                    <span style={placeholderStyle}>
                      ค้นหาบริษัท... (มีทั้งหมด 25 บริษัท)
                    </span>
                  )
                }
              >
                {MOCK_COMPANIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormField>

          {/* แผนก */}
          <FormField label="แผนก" required>
            <Box sx={{ position: 'relative' }}>
              <Box sx={iconAbsSx}>
                <IconBuilding sx={iconSx} />
              </Box>
              <Select
                value={department}
                onChange={handleDepartmentChange}
                displayEmpty
                fullWidth
                disabled={!deptEnabled}
                IconComponent={DropdownIcon}
                sx={selectSx}
                renderValue={(v) =>
                  v || (
                    <span style={placeholderStyle}>
                      {deptEnabled ? 'เลือกแผนก' : 'กรุณาเลือกบริษัทก่อน'}
                    </span>
                  )
                }
              >
                {departments.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormField>

          {/* ตำแหน่ง */}
          <FormField label="ตำแหน่ง" required>
            <Box sx={{ position: 'relative' }}>
              <Box sx={iconAbsSx}>
                <IconBriefcase sx={iconSx} />
              </Box>
              <Select
                value={position}
                onChange={handlePositionChange}
                displayEmpty
                fullWidth
                disabled={!posEnabled}
                IconComponent={DropdownIcon}
                sx={selectSx}
                renderValue={(v) =>
                  v || (
                    <span style={placeholderStyle}>
                      {posEnabled ? 'เลือกตำแหน่ง' : 'กรุณาเลือกแผนกก่อน'}
                    </span>
                  )
                }
              >
                {MOCK_POSITIONS.map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormField>

          {/* ระดับตำแหน่ง */}
          <FormField label="ระดับตำแหน่ง" required>
            <Box sx={{ position: 'relative' }}>
              <Box sx={iconAbsSx}>
                <IconStar sx={iconSx} />
              </Box>
              <Select
                value={level}
                onChange={handleLevelChange}
                displayEmpty
                fullWidth
                disabled={!levelEnabled}
                IconComponent={DropdownIcon}
                sx={selectSx}
                renderValue={(v) =>
                  v || (
                    <span style={placeholderStyle}>
                      {levelEnabled ? 'เลือกระดับตำแหน่ง' : 'กรุณาเลือกตำแหน่งก่อน'}
                    </span>
                  )
                }
              >
                {MOCK_LEVELS.map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormField>

          {/* ผู้อนุมัติ */}
          <FormField label="ผู้อนุมัติ" required>
            <Box sx={{ position: 'relative' }}>
              <Box sx={iconAbsSx}>
                <IconUserCheck sx={iconSx} />
              </Box>
              <Select
                value={approver}
                onChange={(e: SelectChangeEvent) => setApprover(e.target.value)}
                displayEmpty
                fullWidth
                disabled={!approverEnabled}
                IconComponent={DropdownIcon}
                sx={selectSx}
                renderValue={(v) =>
                  v || (
                    <span style={placeholderStyle}>
                      {approverEnabled ? 'เลือกผู้อนุมัติ' : 'กรุณาเลือกระดับตำแหน่งก่อน'}
                    </span>
                  )
                }
              >
                {MOCK_APPROVERS.map((a) => (
                  <MenuItem key={a} value={a}>
                    {a}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </FormField>

          {/* Submit Button */}
          <Box
            component="button"
            onClick={isValid && !loading ? handleSubmit : undefined}
            sx={{
              width: '100%',
              height: 48,
              borderRadius: '10px',
              border: 'none',
              bgcolor: isValid ? '#f62b25' : '#99a1af',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: isValid && !loading ? 'pointer' : 'default',
              transition: 'background-color 0.15s',
              '&:hover': isValid && !loading ? { bgcolor: '#e0241f' } : {},
            }}
          >
            <IconUserPlusBtn sx={{ fontSize: 20, color: isValid ? '#fff' : '#e5e7eb' }} />
            <Typography
              sx={{
                fontFamily: FONT_FAMILY,
                fontWeight: 500,
                fontSize: 16,
                lineHeight: '24px',
                color: isValid ? '#fff' : '#e5e7eb',
                letterSpacing: '-0.31px',
              }}
            >
              {loading ? 'กำลังสร้าง...' : 'สร้างรายการ (Create Account)'}
            </Typography>
          </Box>
        </Box>

        {/* Info Box */}
        <Box
          sx={{
            borderTop: '1px solid #e5e7eb',
            pt: '25px',
            pb: '25px',
          }}
        >
          <Box
            sx={{
              bgcolor: '#eff6ff',
              border: '1px solid #bedbff',
              borderRadius: '10px',
              p: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT_FAMILY,
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: '#193cb8',
                letterSpacing: '-0.15px',
              }}
            >
              ℹ️ หมายเหตุ:
            </Typography>
            <Box
              component="ul"
              sx={{
                m: 0,
                pl: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                listStyle: 'none',
                '& li': {
                  fontFamily: FONT_FAMILY,
                  fontWeight: 400,
                  fontSize: 12,
                  lineHeight: '16px',
                  color: '#1447e6',
                },
                '& li::before': {
                  content: '"• "',
                },
              }}
            >
              <li>
                บัญชีที่สร้างจะมีสิทธิ์เป็น{' '}
                <span style={{ fontWeight: 700 }}>Employee</span>{' '}
                โดยอัตโนมัติ
              </li>
              <li>สามารถเปลี่ยน Role ได้ในภายหลังที่หน้าจัดการผู้ใช้</li>
              <li>อีเมลต้องไม่ซ้ำกับบัญชีที่มีอยู่ในระบบ</li>
              <li>พนักงานจะได้รับอีเมลยืนยันและสามารถเข้าสู่ระบบได้ทันที</li>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Success Modal */}
      <SuccessModal open={showModal} onClose={handleCloseModal} data={modalData} />
    </Box>
  )
}
