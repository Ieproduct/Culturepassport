// Step 1: Basic Info form for CreateExamForm wizard

import { Box, Typography, TextField, Select, MenuItem, type SelectChangeEvent } from '@mui/material'
import { CalendarMonth as CalendarIcon } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { Dayjs } from 'dayjs'
import { FONT_FAMILY } from '@/theme/fonts'
import { space } from '@/theme/spacing'
import { EXAM_CATEGORIES } from '../exam-shared'
import { FormLabel, inputSx } from './exam-form-shared'

type StepBasicInfoProps = {
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
  category: string
  handleCategoryChange: (e: SelectChangeEvent) => void
  dueDate: Dayjs | null
  setDueDate: (v: Dayjs | null) => void
  isStep1Valid: boolean
  onNext: () => void
}

export function StepBasicInfo({
  title,
  setTitle,
  description,
  setDescription,
  category,
  handleCategoryChange,
  dueDate,
  setDueDate,
  isStep1Valid,
  onNext,
}: StepBasicInfoProps) {
  return (
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
            fontFamily: FONT_FAMILY,
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
          {EXAM_CATEGORIES.map((cat) => (
            <MenuItem
              key={cat}
              value={cat}
              sx={{
                fontFamily: FONT_FAMILY,
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
                width: '100%',
                '& .MuiPickersOutlinedInput-root': {
                  borderRadius: '10px',
                  fontFamily: FONT_FAMILY,
                  fontSize: 16,
                  letterSpacing: '-0.31px',
                  height: 44,
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
              },
            },
          }}
        />
        <Typography
          sx={{
            fontFamily: FONT_FAMILY,
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
          onClick={isStep1Valid ? onNext : undefined}
          sx={{
            bgcolor: isStep1Valid ? '#F62B25' : '#D1D5DB',
            height: 44,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: space[24],
            cursor: isStep1Valid ? 'pointer' : 'default',
            '&:hover': isStep1Valid ? { bgcolor: '#E02520' } : {},
            transition: 'background-color 0.15s',
          }}
        >
          <Typography
            sx={{
              fontFamily: FONT_FAMILY,
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
  )
}
