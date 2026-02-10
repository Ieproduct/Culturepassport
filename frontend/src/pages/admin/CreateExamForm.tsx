import { useState } from 'react'
import { Box, Typography, TextField, Select, MenuItem, type SelectChangeEvent } from '@mui/material'
import { CalendarMonth as CalendarIcon } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { Dayjs } from 'dayjs'
import { space } from '@/theme/spacing'

/* ─── Category list (same as ExamsTab) ─── */
const CATEGORIES = [
  'วัฒนธรรมองค์กร',
  'เทคนิคการทำงาน',
  'ทีมและการสื่อสาร',
  'ความปลอดภัยและนโยบาย',
  'การพัฒนาทักษะ',
  'ผลิตภัณฑ์และบริการ',
  'กระบวนการทำงาน',
  'ความรู้ทางธุรกิจ',
  'เทคโนโลยีและเครื่องมือ',
  'มาตรฐานคุณภาพ',
  'อื่นๆ',
]

/* ─── Step Indicator (Figma 50:15055) ─── */
function StepIndicator({ step, label, active }: { step: number; label: string; active: boolean }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8] }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: active ? '#F62B25' : '#E5E7EB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 16,
            lineHeight: '24px',
            color: active ? '#FFFFFF' : '#9CA3AF',
          }}
        >
          {step}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
          fontWeight: 500,
          fontSize: 16,
          lineHeight: '24px',
          color: active ? '#F62B25' : '#9CA3AF',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

/* ─── Form Label ─── */
function FormLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
  return (
    <Typography
      sx={{
        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
        fontWeight: 500,
        fontSize: 14,
        lineHeight: '20px',
        color: '#101828',
        mb: space[6],
      }}
    >
      {children}
      {required && (
        <Box component="span" sx={{ color: '#F62B25', ml: space[4] }}>
          *
        </Box>
      )}
    </Typography>
  )
}

/* ─── Shared input sx ─── */
const inputSx = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
    fontSize: 16,
    letterSpacing: '-0.31px',
    '& fieldset': {
      borderWidth: '1px',
      borderColor: '#D1D5DC',
    },
    '&:hover fieldset': {
      borderColor: '#F62B25',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#F62B25',
      borderWidth: '2px',
    },
  },
  '& .MuiOutlinedInput-input': {
    '&::placeholder': {
      color: 'rgba(10,10,10,0.4)',
      opacity: 1,
    },
  },
}

type CreateExamFormProps = {
  onCancel: () => void
}

export function CreateExamForm({ onCancel }: CreateExamFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState<Dayjs | null>(null)

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[16] }}>
      {/* ═══ Header: Title + Cancel button (Figma 50:15055) ═══ */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 60,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              lineHeight: '32px',
              color: '#101828',
              letterSpacing: '0.07px',
            }}
          >
            สร้างแบบทดสอบใหม่
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '24px',
              color: '#4A5565',
              letterSpacing: '-0.31px',
            }}
          >
            กรอกข้อมูลพื้นฐานของแบบทดสอบ
          </Typography>
        </Box>

        <Box
          onClick={onCancel}
          sx={{
            height: 40,
            borderRadius: '10px',
            border: '1px solid #F62B25',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: space[24],
            cursor: 'pointer',
            flexShrink: 0,
            '&:hover': { bgcolor: '#FEF2F2' },
            transition: 'background-color 0.15s',
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: '24px',
              color: '#F62B25',
              whiteSpace: 'nowrap',
            }}
          >
            ยกเลิก
          </Typography>
        </Box>
      </Box>

      {/* ═══ Stepper (Figma 50:15055) ═══ */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: space[8],
        }}
      >
        <StepIndicator step={1} label="ข้อมูลพื้นฐาน" active />
        <Box sx={{ flex: 1, height: '1px', bgcolor: '#E5E7EB' }} />
        <StepIndicator step={2} label="เพิ่มคำถาม" active={false} />
        <Box sx={{ flex: 1, height: '1px', bgcolor: '#E5E7EB' }} />
        <StepIndicator step={3} label="ตรวจสอบ" active={false} />
      </Box>

      {/* ═══ Form Card (Figma 50:15055) ═══ */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '2px solid #E5E7EB',
          borderRadius: '10px',
          p: space[32],
          display: 'flex',
          flexDirection: 'column',
          gap: space[24],
        }}
      >
        {/* ชื่อแบบทดสอบ */}
        <Box>
          <FormLabel required>ชื่อแบบทดสอบ</FormLabel>
          <TextField
            placeholder="เช่น แบบทดสอบความปลอดภัยในที่ทำงาน"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              ...inputSx,
              '& .MuiOutlinedInput-root': {
                ...inputSx['& .MuiOutlinedInput-root'],
                height: 44,
              },
            }}
          />
        </Box>

        {/* คำอธิบาย */}
        <Box>
          <FormLabel required>คำอธิบาย</FormLabel>
          <TextField
            placeholder="อธิบายวัตถุประสงค์และเนื้อหาของแบบทดสอบ"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            multiline
            rows={4}
            sx={inputSx}
          />
        </Box>

        {/* หมวดหมู่ */}
        <Box>
          <FormLabel required>หมวดหมู่</FormLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            displayEmpty
            size="small"
            sx={{
              width: '100%',
              height: 44,
              borderRadius: '10px',
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontSize: 16,
              letterSpacing: '-0.31px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderWidth: '1px',
                borderColor: '#D1D5DC',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F62B25',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F62B25',
                borderWidth: '2px',
              },
            }}
            renderValue={(selected) => {
              if (!selected) {
                return (
                  <Typography sx={{ color: 'rgba(10,10,10,0.4)', fontSize: 16 }}>
                    เลือกหมวดหมู่
                  </Typography>
                )
              }
              return selected
            }}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem
                key={cat}
                value={cat}
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontSize: 16,
                  color: '#0A0A0A',
                }}
              >
                {cat}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* กำหนดส่ง (Due Date) */}
        <Box>
          <FormLabel>กำหนดส่ง (Due Date)</FormLabel>
          <DatePicker
            value={dueDate}
            onChange={(newValue) => setDueDate(newValue)}
            format="DD/MM/YYYY"
            localeText={{
              fieldDayPlaceholder: () => 'วัน',
              fieldMonthPlaceholder: () => 'เดือน',
              fieldYearPlaceholder: () => 'ปี',
            }}
            slots={{
              openPickerIcon: () => <CalendarIcon sx={{ fontSize: 20, color: '#6B7280' }} />,
            }}
            slotProps={{
              textField: {
                size: 'small',
                sx: {
                  ...inputSx,
                  '& .MuiOutlinedInput-root': {
                    ...inputSx['& .MuiOutlinedInput-root'],
                    height: 44,
                  },
                },
              },
            }}
          />
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: '16px',
              color: '#9CA3AF',
              mt: space[6],
            }}
          >
            * ถ้าไม่ระบุ จะไม่มีกำหนดเวลาส่ง
          </Typography>
        </Box>

        {/* Action button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box
            sx={{
              bgcolor: '#F62B25',
              height: 44,
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: space[24],
              cursor: 'pointer',
              '&:hover': { bgcolor: '#E02520' },
              transition: 'background-color 0.15s',
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: '24px',
                color: '#FFFFFF',
                whiteSpace: 'nowrap',
              }}
            >
              ถัดไป: เพิ่มคำถาม
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
