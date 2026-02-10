import { useState } from 'react'
import {
  Box,
  Typography,
  InputBase,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Dialog,
  SvgIcon,
  type SelectChangeEvent,
  type SvgIconProps,
} from '@mui/material'
import { VisibilityOff as VisibilityOffIcon } from '@mui/icons-material'
import { supabase } from '@/lib/supabase'

/* ═══════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════ */
const FONT = "'Inter', 'Noto Sans Thai', sans-serif"

/** Common SVG stroke props for Feather-style icons */
const S = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: '1.66667',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Common SVG stroke props for header icon (thicker) */
const SH = {
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: '2.33333',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/* ═══════════════════════════════════════════════════════════
   Icons – Figma 53:81706 SVG paths (pixel-perfect)
   ═══════════════════════════════════════════════════════════ */

/** Header icon: User Plus (28×28, blue stroke) */
function IconUserPlusHeader(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 28 28" {...props}>
      <path d="M18.6667 24.5V22.1667C18.6667 20.929 18.175 19.742 17.2998 18.8668C16.4247 17.9917 15.2377 17.5 14 17.5H7C5.76232 17.5 4.57534 17.9917 3.70017 18.8668C2.825 19.742 2.33333 20.929 2.33333 22.1667V24.5" {...SH} />
      <path d="M10.5 12.8333C13.0773 12.8333 15.1667 10.744 15.1667 8.16667C15.1667 5.58934 13.0773 3.5 10.5 3.5C7.92267 3.5 5.83333 5.58934 5.83333 8.16667C5.83333 10.744 7.92267 12.8333 10.5 12.8333Z" {...SH} />
      <path d="M22.1667 9.33333V16.3333" {...SH} />
      <path d="M25.6667 12.8333H18.6667" {...SH} />
    </SvgIcon>
  )
}

/** Person icon (20×20) – ชื่อ-นามสกุล field */
function IconPerson(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M15.8333 17.5V15.8333C15.8333 14.9493 15.4821 14.1014 14.857 13.4763C14.2319 12.8512 13.3841 12.5 12.5 12.5H7.5C6.61594 12.5 5.7681 12.8512 5.14298 13.4763C4.51786 14.1014 4.16667 14.9493 4.16667 15.8333V17.5" {...S} />
      <path d="M10 9.16667C11.8409 9.16667 13.3333 7.67428 13.3333 5.83333C13.3333 3.99238 11.8409 2.5 10 2.5C8.15905 2.5 6.66667 3.99238 6.66667 5.83333C6.66667 7.67428 8.15905 9.16667 10 9.16667Z" {...S} />
    </SvgIcon>
  )
}

/** Email icon (20×20) – อีเมล field */
function IconMail(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M16.6667 3.33333H3.33333C2.41286 3.33333 1.66667 4.07953 1.66667 5V15C1.66667 15.9205 2.41286 16.6667 3.33333 16.6667H16.6667C17.5871 16.6667 18.3333 15.9205 18.3333 15V5C18.3333 4.07953 17.5871 3.33333 16.6667 3.33333Z" {...S} />
      <path d="M18.3333 5.83333L10.8583 10.5833C10.6011 10.7445 10.3036 10.83 10 10.83C9.6964 10.83 9.39894 10.7445 9.14167 10.5833L1.66667 5.83333" {...S} />
    </SvgIcon>
  )
}

/** Lock icon (20×20) – รหัสผ่าน field */
function IconLock(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M15.8333 9.16667H4.16667C3.24619 9.16667 2.5 9.91286 2.5 10.8333V16.6667C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6667V10.8333C17.5 9.91286 16.7538 9.16667 15.8333 9.16667Z" {...S} />
      <path d="M5.83333 9.16667V5.83333C5.83333 4.72826 6.27232 3.66846 7.05372 2.88706C7.83512 2.10565 8.89493 1.66667 10 1.66667C11.1051 1.66667 12.1649 2.10565 12.9463 2.88706C13.7277 3.66846 14.1667 4.72826 14.1667 5.83333V9.16667" {...S} />
    </SvgIcon>
  )
}

/** Building icon (20×20) – บริษัท / แผนก fields */
function IconBuilding(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M5 18.3333V3.33333C5 2.89131 5.17559 2.46738 5.48816 2.15482C5.80072 1.84226 6.22464 1.66667 6.66667 1.66667H13.3333C13.7754 1.66667 14.1993 1.84226 14.5118 2.15482C14.8244 2.46738 15 2.89131 15 3.33333V18.3333H5Z" {...S} />
      <path d="M5 10H3.33333C2.89131 10 2.46738 10.1756 2.15482 10.4882C1.84226 10.8007 1.66667 11.2246 1.66667 11.6667V16.6667C1.66667 17.1087 1.84226 17.5326 2.15482 17.8452C2.46738 18.1577 2.89131 18.3333 3.33333 18.3333H5" {...S} />
      <path d="M15 7.5H16.6667C17.1087 7.5 17.5326 7.6756 17.8452 7.98816C18.1577 8.30072 18.3333 8.72464 18.3333 9.16667V16.6667C18.3333 17.1087 18.1577 17.5326 17.8452 17.8452C17.5326 18.1577 17.1087 18.3333 16.6667 18.3333H15" {...S} />
      <path d="M8.33333 5H11.6667" {...S} />
      <path d="M8.33333 8.33333H11.6667" {...S} />
      <path d="M8.33333 11.6667H11.6667" {...S} />
      <path d="M8.33333 15H11.6667" {...S} />
    </SvgIcon>
  )
}

/** Briefcase icon (20×20) – ตำแหน่ง field */
function IconBriefcase(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M13.3333 16.6667V3.33333C13.3333 2.89131 13.1577 2.46738 12.8452 2.15482C12.5326 1.84226 12.1087 1.66667 11.6667 1.66667H8.33333C7.89131 1.66667 7.46738 1.84226 7.15482 2.15482C6.84226 2.46738 6.66667 2.89131 6.66667 3.33333V16.6667" {...S} />
      <path d="M16.6667 5H3.33333C2.41286 5 1.66667 5.74619 1.66667 6.66667V15C1.66667 15.9205 2.41286 16.6667 3.33333 16.6667H16.6667C17.5871 16.6667 18.3333 15.9205 18.3333 15V6.66667C18.3333 5.74619 17.5871 5 16.6667 5Z" {...S} />
    </SvgIcon>
  )
}

/** Star icon (20×20) – ระดับตำแหน่ง field */
function IconStar(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M9.60417 1.91251C9.64069 1.83873 9.6971 1.77662 9.76704 1.7332C9.83699 1.68978 9.91767 1.66677 10 1.66677C10.0823 1.66677 10.163 1.68978 10.233 1.7332C10.3029 1.77662 10.3593 1.83873 10.3958 1.91251L12.3208 5.81168C12.4476 6.06832 12.6348 6.29035 12.8664 6.45872C13.0979 6.6271 13.3668 6.73677 13.65 6.77835L17.955 7.40835C18.0366 7.42017 18.1132 7.45457 18.1762 7.50768C18.2393 7.56079 18.2862 7.63047 18.3117 7.70885C18.3372 7.78723 18.3402 7.87118 18.3205 7.95121C18.3008 8.03123 18.259 8.10414 18.2 8.16168L15.0867 11.1933C14.8813 11.3934 14.7277 11.6404 14.639 11.913C14.5503 12.1857 14.5292 12.4758 14.5775 12.7583L15.3125 17.0417C15.3269 17.1232 15.3181 17.2071 15.2871 17.2839C15.2561 17.3607 15.2041 17.4272 15.1371 17.4758C15.0701 17.5245 14.9908 17.5533 14.9082 17.5591C14.8256 17.5648 14.7431 17.5473 14.67 17.5083L10.8217 15.485C10.5681 15.3519 10.286 15.2823 9.99958 15.2823C9.71318 15.2823 9.43107 15.3519 9.1775 15.485L5.33 17.5083C5.25694 17.547 5.1745 17.5644 5.09204 17.5586C5.00959 17.5527 4.93043 17.5238 4.86358 17.4752C4.79673 17.4266 4.74486 17.3602 4.71388 17.2835C4.6829 17.2069 4.67405 17.1231 4.68833 17.0417L5.4225 12.7592C5.471 12.4765 5.44999 12.1862 5.36128 11.9134C5.27258 11.6406 5.11884 11.3935 4.91333 11.1933L1.8 8.16251C1.74049 8.10504 1.69833 8.03201 1.6783 7.95174C1.65828 7.87147 1.6612 7.78719 1.68673 7.70851C1.71227 7.62982 1.75939 7.55988 1.82273 7.50667C1.88607 7.45345 1.96309 7.4191 2.045 7.40751L6.34917 6.77835C6.63271 6.7371 6.90199 6.62756 7.13382 6.45917C7.36565 6.29078 7.55309 6.06857 7.68 5.81168L9.60417 1.91251Z" {...S} />
    </SvgIcon>
  )
}

/** User Check icon (20×20) – ผู้อนุมัติ field */
function IconUserCheck(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11595 12.5 3.2681 12.8512 2.64298 13.4763C2.01786 14.1014 1.66667 14.9493 1.66667 15.8333V17.5" {...S} />
      <path d="M7.5 9.16667C9.34095 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34095 2.5 7.5 2.5C5.65905 2.5 4.16667 3.99238 4.16667 5.83333C4.16667 7.67428 5.65905 9.16667 7.5 9.16667Z" {...S} />
      <path d="M13.3333 9.16667L15 10.8333L18.3333 7.5" {...S} />
    </SvgIcon>
  )
}

/** User Plus icon (20×20) – submit button */
function IconUserPlusBtn(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M13.3333 17.5V15.8333C13.3333 14.9493 12.9821 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5C4.11595 12.5 3.2681 12.8512 2.64298 13.4763C2.01786 14.1014 1.66667 14.9493 1.66667 15.8333V17.5" {...S} />
      <path d="M7.5 9.16667C9.34095 9.16667 10.8333 7.67428 10.8333 5.83333C10.8333 3.99238 9.34095 2.5 7.5 2.5C5.65905 2.5 4.16667 3.99238 4.16667 5.83333C4.16667 7.67428 5.65905 9.16667 7.5 9.16667Z" {...S} />
      <path d="M15.8333 6.66667V11.6667" {...S} />
      <path d="M18.3333 9.16667H13.3333" {...S} />
    </SvgIcon>
  )
}

/** Dropdown chevron-down (20×20) – for Select IconComponent */
function DropdownIcon(props: Record<string, unknown>) {
  return (
    <SvgIcon
      {...props}
      viewBox="0 0 20 20"
      sx={{ fontSize: '20px !important', color: '#99A1AF !important' }}
    >
      <path d="M5 7.5L10 12.5L15 7.5" fill="none" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  )
}

/** Shield-check icon (20×20) – สิทธิ์ field in modal */
function IconShieldCheck(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 20 20" {...props}>
      <path d="M10 1.66667L16.6667 4.16667V9.16667C16.6667 13.75 13.8333 16.9167 10 18.3333C6.16667 16.9167 3.33333 13.75 3.33333 9.16667V4.16667L10 1.66667Z" {...S} />
      <path d="M7.5 10L9.16667 11.6667L12.5 8.33333" {...S} />
    </SvgIcon>
  )
}

/** Close X icon (14×14, white) – modal close button */
function IconClose(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 14 14" {...props}>
      <path d="M13 1L1 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 1L13 13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </SvgIcon>
  )
}

/** Small eye icon (16×16) for modal password toggle */
function IconEyeSmall(props: SvgIconProps) {
  return (
    <SvgIcon viewBox="0 0 16 16" {...props}>
      <g transform="translate(0.667, 2.667)">
        <path d="M0.708337 5.565C0.652777 5.415 0.652777 5.251 0.708337 5.101C1.24947 3.789 2.16801 2.667 3.34752 1.878C4.52702 1.088 5.91437 0.667 7.33367 0.667C8.75297 0.667 10.1403 1.088 11.3198 1.878C12.4993 2.667 13.4179 3.789 13.959 5.101C14.0146 5.251 14.0146 5.415 13.959 5.565C13.4179 6.877 12.4993 7.999 11.3198 8.788C10.1403 9.578 8.75297 9.999 7.33367 9.999C5.91437 9.999 4.52702 9.578 3.34752 8.788C2.16801 7.999 1.24947 6.877 0.708337 5.565Z" fill="none" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(5.333, 5.333)">
        <path d="M2.667 4.667C3.771 4.667 4.667 3.771 4.667 2.667C4.667 1.562 3.771 0.667 2.667 0.667C1.562 0.667 0.667 1.562 0.667 2.667C0.667 3.771 1.562 4.667 2.667 4.667Z" fill="none" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </SvgIcon>
  )
}

/* ═══════════════════════════════════════════════════════════
   Modal Data Type
   ═══════════════════════════════════════════════════════════ */
interface ModalData {
  fullName: string
  email: string
  password: string
  company: string
  department: string
  position: string
  level: string
  approver: string
}

/* ═══════════════════════════════════════════════════════════
   Success Modal – Figma 54:82453
   ═══════════════════════════════════════════════════════════ */
function SuccessModal({
  open,
  onClose,
  data,
}: {
  open: boolean
  onClose: () => void
  data: ModalData | null
}) {
  const [showPw, setShowPw] = useState(false)

  if (!data) return null

  const initials = data.fullName.trim().slice(0, 2) || 'สผ'

  /** Row component for each info item */
  const InfoRow = ({
    icon,
    iconBg,
    label,
    value,
    extra,
  }: {
    icon: React.ReactNode
    iconBg: string
    label: string
    value: React.ReactNode
    extra?: React.ReactNode
  }) => (
    <Box sx={{ display: 'flex', gap: '12px', minHeight: 42 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '10px',
          bgcolor: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mt: '2px',
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: 12,
            lineHeight: '16px',
            color: '#6a7282',
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            pt: '1px',
          }}
        >
          {label}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Typography
            sx={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '24px',
              color: '#101828',
              letterSpacing: '-0.3125px',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {value}
          </Typography>
        </Box>
        {extra}
      </Box>
    </Box>
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 448,
          maxWidth: '95vw',
          borderRadius: '16px',
          boxShadow: '0px 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden',
          m: 0,
          p: 0,
          '&.MuiDialog-paper': { p: 0 },
        },
      }}
    >
      {/* ═══ Red Gradient Header ═══ */}
      <Box
        sx={{
          background: 'linear-gradient(to bottom, #f62b25, #d42419)',
          borderRadius: '16px 16px 0 0',
          height: 100,
          px: '24px',
          pt: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: '#f62b25',
              border: '1px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '24px',
                color: 'white',
                textAlign: 'center',
              }}
            >
              {initials}
            </Typography>
          </Box>
          {/* Title + subtitle */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <Typography
              sx={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 20,
                lineHeight: '28px',
                color: 'white',
                letterSpacing: '-0.4492px',
              }}
            >
              สร้าง Account สำเร็จ!
            </Typography>
            <Typography
              sx={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: 14,
                lineHeight: '20px',
                color: '#fef2f2',
                letterSpacing: '-0.1504px',
              }}
            >
              บัญชีถูกเพิ่มเข้าสู่ระบบแล้ว
            </Typography>
          </Box>
        </Box>
        {/* Close button */}
        <IconButton
          onClick={onClose}
          sx={{
            width: 32,
            height: 32,
            p: '4px',
            color: 'white',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
          }}
        >
          <IconClose sx={{ fontSize: 14, color: 'white' }} />
        </IconButton>
      </Box>

      {/* ═══ Content Card ═══ */}
      <Box
        sx={{
          bgcolor: '#f9fafb',
          borderRadius: '14px',
          mx: '24px',
          mt: '24px',
          pt: '16px',
          px: '16px',
          pb: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          mb: '24px',
        }}
      >
        {/* 1. ชื่อ-นามสกุล */}
        <InfoRow
          iconBg="#dbeafe"
          icon={<IconPerson sx={{ fontSize: 20, color: '#2563eb' }} />}
          label="ชื่อ-นามสกุล"
          value={data.fullName}
        />

        {/* 2. อีเมล */}
        <InfoRow
          iconBg="#f3e8ff"
          icon={<IconMail sx={{ fontSize: 20, color: '#9333ea' }} />}
          label="อีเมล"
          value={data.email}
        />

        {/* 3. รหัสผ่านเริ่มต้น */}
        <InfoRow
          iconBg="#ffedd4"
          icon={<IconLock sx={{ fontSize: 20, color: '#ea580c' }} />}
          label="รหัสผ่านเริ่มต้น"
          value={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
              <Typography
                sx={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: '24px',
                  color: '#101828',
                  flex: 1,
                }}
              >
                {showPw ? data.password : '••••••••'}
              </Typography>
              <IconButton
                onClick={() => setShowPw(!showPw)}
                sx={{ width: 24, height: 24, p: '4px' }}
              >
                {showPw ? (
                  <VisibilityOffIcon sx={{ fontSize: 16, color: '#4a5565' }} />
                ) : (
                  <IconEyeSmall sx={{ fontSize: 16, color: '#4a5565' }} />
                )}
              </IconButton>
            </Box>
          }
          extra={
            <Typography
              sx={{
                fontFamily: FONT,
                fontWeight: 400,
                fontSize: 12,
                lineHeight: '16px',
                color: '#6a7282',
                pt: '1px',
              }}
            >
              ผู้ใช้สามารถเปลี่ยนรหัสผ่านได้ในภายหลัง
            </Typography>
          }
        />

        {/* ── Separator ── */}
        <Box sx={{ borderTop: '1px solid #e5e7eb', height: '1px' }} />

        {/* 4. บริษัท */}
        <InfoRow
          iconBg="#cefafe"
          icon={<IconBuilding sx={{ fontSize: 20, color: '#0891b2' }} />}
          label="บริษัท"
          value={data.company}
        />

        {/* 5. แผนก */}
        <InfoRow
          iconBg="#e0e7ff"
          icon={<IconBuilding sx={{ fontSize: 20, color: '#4f46e5' }} />}
          label="แผนก"
          value={data.department}
        />

        {/* 6. ตำแหน่ง */}
        <InfoRow
          iconBg="#ffe2e2"
          icon={<IconBriefcase sx={{ fontSize: 20, color: '#dc2626' }} />}
          label="ตำแหน่ง"
          value={data.position}
        />

        {/* 7. ระดับตำแหน่ง */}
        <InfoRow
          iconBg="#fef9c2"
          icon={<IconStar sx={{ fontSize: 20, color: '#ca8a04' }} />}
          label="ระดับตำแหน่ง"
          value={data.level}
        />

        {/* 8. ผู้อนุมัติ */}
        <InfoRow
          iconBg="#dcfce7"
          icon={<IconUserCheck sx={{ fontSize: 20, color: '#16a34a' }} />}
          label="ผู้อนุมัติ"
          value={data.approver}
        />

        {/* 9. สิทธิ์ */}
        <InfoRow
          iconBg="#d0fae5"
          icon={<IconShieldCheck sx={{ fontSize: 20, color: '#059669' }} />}
          label="สิทธิ์"
          value="Employee (พนักงาน)"
        />
      </Box>
    </Dialog>
  )
}

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
  fontFamily: FONT,
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
  fontFamily: FONT,
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

const placeholderStyle = { color: 'rgba(10,10,10,0.5)', fontFamily: FONT, fontSize: 16, letterSpacing: '-0.31px' }

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
            fontFamily: FONT,
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
              fontFamily: "'Inter', sans-serif",
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
            fontFamily: FONT,
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
        const { data, error: fnError } = await supabase.functions.invoke('create-user', {
          body: {
            email: email.trim(),
            password: generatedPassword,
            full_name: fullName.trim(),
            role: 'employee',
            company_name: company,
            department_name: department,
            position_name: position,
            level_name: level,
            approver_name: approver,
          },
        })

        if (fnError) throw fnError
        if (data?.error) throw new Error(data.error)
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
        {/* ═══ Alerts ═══ */}
        {error && <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>}
        {success && <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>}

        {/* ═══ Header ═══ */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconUserPlusHeader sx={{ fontSize: 28, color: '#155DFC' }} />
            <Typography
              sx={{
                fontFamily: FONT,
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
              fontFamily: FONT,
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

        {/* ═══ Form ═══ */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ── ชื่อ-นามสกุล ── */}
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

          {/* ── อีเมล ── */}
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

          {/* ── บริษัท ── */}
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

          {/* ── แผนก ── */}
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

          {/* ── ตำแหน่ง ── */}
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

          {/* ── ระดับตำแหน่ง ── */}
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

          {/* ── ผู้อนุมัติ ── */}
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

          {/* ── Submit Button ── */}
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
                fontFamily: FONT,
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

        {/* ═══ Info Box ═══ */}
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
                fontFamily: FONT,
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
                  fontFamily: FONT,
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

      {/* ═══ Success Modal ═══ */}
      <SuccessModal open={showModal} onClose={handleCloseModal} data={modalData} />
    </Box>
  )
}
