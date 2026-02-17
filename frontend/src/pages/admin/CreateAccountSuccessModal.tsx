// Success Modal for CreateAccountTab — Figma 54:82453
// Extracted from CreateAccountTab.tsx to reduce file size

import { useState } from 'react'
import { Box, Typography, IconButton, Dialog } from '@mui/material'
import { VisibilityOff as VisibilityOffIcon } from '@mui/icons-material'
import { FONT_FAMILY } from '@/theme/fonts'
import {
  IconPerson,
  IconMail,
  IconLock,
  IconBuilding,
  IconBriefcase,
  IconStar,
  IconUserCheck,
  IconShieldCheck,
  IconClose,
  IconEyeSmall,
} from './create-account-icons'

export interface ModalData {
  fullName: string
  email: string
  password: string
  company: string
  department: string
  position: string
  level: string
  approver: string
}

export function SuccessModal({
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
            fontFamily: FONT_FAMILY,
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
              fontFamily: FONT_FAMILY,
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
      {/* Red Gradient Header */}
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
                fontFamily: FONT_FAMILY,
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
                fontFamily: FONT_FAMILY,
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
                fontFamily: FONT_FAMILY,
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

      {/* Content Card */}
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
                  fontFamily: FONT_FAMILY,
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
                fontFamily: FONT_FAMILY,
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

        {/* Separator */}
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
