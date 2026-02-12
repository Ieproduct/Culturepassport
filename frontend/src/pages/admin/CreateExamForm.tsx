import { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  type SelectChangeEvent,
} from '@mui/material'
import { CalendarMonth as CalendarIcon } from '@mui/icons-material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { Dayjs } from 'dayjs'
import { space } from '@/theme/spacing'

/* ─── Question types ─── */
type QuestionType = 'multiple_choice' | 'essay'

interface Question {
  type: QuestionType
  text: string
  options: [string, string, string, string]
  correctAnswer: number | null // 0-3 for multiple choice, null for essay
}

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

/* ─── Step Indicator (Figma 50:15055 / 51:15273) ─── */
type StepState = 'past' | 'active' | 'upcoming'

function StepIndicator({ step, label, state }: { step: number; label: string; state: StepState }) {
  const isActive = state === 'active'
  const circleStyles = {
    active: { bgcolor: '#F62B25', border: 'none', color: '#FFFFFF' },
    past: { bgcolor: 'transparent', border: '2px solid #D1D5DC', color: '#99A1AF' },
    upcoming: { bgcolor: 'transparent', border: '2px solid #D1D5DC', color: '#99A1AF' },
  }
  const labelColor = isActive ? '#F62B25' : '#99A1AF'
  const cs = circleStyles[state]

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8] }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          bgcolor: cs.bgcolor,
          border: cs.border,
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
            color: cs.color,
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
          color: labelColor,
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

export type ExamInitialData = {
  id: string
  title: string
  description: string
  category: string
  questions?: Question[]
}

type CreateExamFormProps = {
  onCancel: () => void
  initialData?: ExamInitialData
}

export function CreateExamForm({ onCancel, initialData }: CreateExamFormProps) {
  /* ─── Step 1 state ─── */
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [dueDate, setDueDate] = useState<Dayjs | null>(null)

  /* ─── Multi-step state ─── */
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  /* ─── Step 2: questions list ─── */
  const [questions, setQuestions] = useState<Question[]>(initialData?.questions ?? [])

  /* ─── Step 2: current question being edited ─── */
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice')
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState<[string, string, string, string]>(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
  }

  const resetCurrentQuestion = () => {
    setQuestionType('multiple_choice')
    setQuestionText('')
    setOptions(['', '', '', ''])
    setCorrectAnswer(null)
  }

  const handleAddQuestion = () => {
    if (!questionText.trim()) return
    const newQuestion: Question = {
      type: questionType,
      text: questionText,
      options: [...options],
      correctAnswer: questionType === 'multiple_choice' ? correctAnswer : null,
    }
    setQuestions((prev) => [...prev, newQuestion])
    resetCurrentQuestion()
  }

  const handleOptionChange = (index: number, value: string) => {
    setOptions((prev) => {
      const next = [...prev] as [string, string, string, string]
      next[index] = value
      return next
    })
  }

  const isStep1Valid = title.trim() !== '' && description.trim() !== '' && category !== ''

  const stepStates: [StepState, StepState, StepState] =
    currentStep === 1
      ? ['active', 'upcoming', 'upcoming']
      : currentStep === 2
        ? ['past', 'active', 'upcoming']
        : ['past', 'past', 'active']

  const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[16] }}>
      {/* ═══ Header: Title + Cancel button ═══ */}
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
            {currentStep === 1
              ? 'กรอกข้อมูลพื้นฐานของแบบทดสอบ'
              : currentStep === 2
                ? `เพิ่มคำถาม (${questions.length} ข้อ)`
                : 'ตรวจสอบข้อมูลก่อนบันทึก'}
          </Typography>
        </Box>

        <Box
          onClick={onCancel}
          sx={{
            height: 40,
            borderRadius: '10px',
            border: currentStep === 1 ? '1px solid #F62B25' : '2px solid #F62B25',
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

      {/* ═══ Stepper ═══ */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: space[8],
        }}
      >
        <StepIndicator step={1} label="ข้อมูลพื้นฐาน" state={stepStates[0]} />
        <Box sx={{ flex: 1, height: '2px', bgcolor: '#D1D5DC' }} />
        <StepIndicator step={2} label="เพิ่มคำถาม" state={stepStates[1]} />
        <Box sx={{ flex: 1, height: '2px', bgcolor: '#D1D5DC' }} />
        <StepIndicator step={3} label="ตรวจสอบ" state={stepStates[2]} />
      </Box>

      {/* ═══ Step 1: Basic Info Form ═══ */}
      {currentStep === 1 && (
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
                    width: '100%',
                    '& .MuiPickersOutlinedInput-root': {
                      borderRadius: '10px',
                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
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
              onClick={isStep1Valid ? () => setCurrentStep(2) : undefined}
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
      )}

      {/* ═══ Step 2: Add Questions (Figma 51:15273) ═══ */}
      {currentStep === 2 && (
        <>
          {/* Added questions summary */}
          {questions.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
              {questions.map((q, idx) => (
                <Box
                  key={idx}
                  sx={{
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '10px',
                    px: space[24],
                    py: space[12],
                    display: 'flex',
                    alignItems: 'center',
                    gap: space[12],
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: '#F62B25',
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
                        fontSize: 13,
                        color: '#FFFFFF',
                      }}
                    >
                      {idx + 1}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                        fontWeight: 500,
                        fontSize: 14,
                        color: '#101828',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {q.text}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                      fontWeight: 400,
                      fontSize: 12,
                      color: '#6A7282',
                      flexShrink: 0,
                    }}
                  >
                    {q.type === 'multiple_choice' ? 'ปรนัย' : 'ข้อเขียน'}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          {/* New question form card */}
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              border: '2px solid #BEDBFF',
              borderRadius: '10px',
              pt: '26px',
              px: '26px',
              pb: space[24],
              display: 'flex',
              flexDirection: 'column',
              gap: space[24],
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '28px',
                color: '#101828',
              }}
            >
              เพิ่มคำถามใหม่
            </Typography>

            {/* Question type radio */}
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#364153',
                  mb: space[8],
                }}
              >
                ประเภทคำถาม
              </Typography>
              <RadioGroup
                row
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as QuestionType)}
                sx={{ gap: space[24] }}
              >
                <FormControlLabel
                  value="multiple_choice"
                  control={
                    <Radio
                      sx={{
                        color: '#D1D5DC',
                        '&.Mui-checked': { color: '#F62B25' },
                      }}
                    />
                  }
                  label="ปรนัย (Multiple Choice)"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                      fontWeight: 500,
                      fontSize: 16,
                      color: '#364153',
                    },
                  }}
                />
                <FormControlLabel
                  value="essay"
                  control={
                    <Radio
                      sx={{
                        color: '#D1D5DC',
                        '&.Mui-checked': { color: '#F62B25' },
                      }}
                    />
                  }
                  label="ข้อเขียน (Essay)"
                  sx={{
                    '& .MuiFormControlLabel-label': {
                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                      fontWeight: 500,
                      fontSize: 16,
                      color: '#364153',
                    },
                  }}
                />
              </RadioGroup>
            </Box>

            {/* Question text */}
            <Box>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#364153',
                  mb: space[6],
                }}
              >
                คำถาม
              </Typography>
              <TextField
                placeholder="กรอกคำถาม"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                variant="outlined"
                multiline
                minRows={3}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                    fontSize: 16,
                    letterSpacing: '-0.31px',
                    minHeight: 92,
                    '& fieldset': {
                      borderWidth: '2px',
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
                }}
              />
            </Box>

            {/* Options A-D (multiple choice only) */}
            {questionType === 'multiple_choice' && (
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                    fontWeight: 500,
                    fontSize: 14,
                    lineHeight: '20px',
                    color: '#364153',
                    mb: space[8],
                  }}
                >
                  ตัวเลือก
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[12] }}>
                  {OPTION_LABELS.map((letter, idx) => (
                    <Box
                      key={letter}
                      sx={{ display: 'flex', alignItems: 'center', gap: space[8] }}
                    >
                      <Radio
                        checked={correctAnswer === idx}
                        onChange={() => setCorrectAnswer(idx)}
                        sx={{
                          color: '#D1D5DC',
                          '&.Mui-checked': { color: '#F62B25' },
                          p: space[4],
                        }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Inter', sans-serif",
                          fontWeight: 600,
                          fontSize: 14,
                          color: '#364153',
                          width: 20,
                          flexShrink: 0,
                        }}
                      >
                        {letter}.
                      </Typography>
                      <TextField
                        placeholder={`ตัวเลือก ${letter}`}
                        value={options[idx]}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        variant="outlined"
                        size="small"
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '10px',
                            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                            fontSize: 16,
                            height: 44,
                            '& fieldset': {
                              borderWidth: '2px',
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
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                <Typography
                  sx={{
                    fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                    fontWeight: 400,
                    fontSize: 12,
                    lineHeight: '16px',
                    color: '#6A7282',
                    mt: space[8],
                  }}
                >
                  * เลือกวงกลมด้านหน้าเพื่อระบุคำตอบที่ถูกต้อง
                </Typography>
              </Box>
            )}

            {/* Add question button */}
            <Box
              onClick={questionText.trim() ? handleAddQuestion : undefined}
              sx={{
                bgcolor: questionText.trim() ? '#F62B25' : '#D1D5DB',
                height: 40,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: questionText.trim() ? 'pointer' : 'default',
                '&:hover': questionText.trim() ? { bgcolor: '#E02520' } : {},
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
                }}
              >
                + เพิ่มคำถามนี้
              </Typography>
            </Box>
          </Box>

          {/* Bottom navigation buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* ย้อนกลับ */}
            <Box
              onClick={() => setCurrentStep(1)}
              sx={{
                height: 44,
                borderRadius: '10px',
                border: '2px solid #F62B25',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: space[24],
                cursor: 'pointer',
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
                ย้อนกลับ
              </Typography>
            </Box>

            {/* ถัดไป: ตรวจสอบ */}
            <Box
              onClick={questions.length > 0 ? () => setCurrentStep(3) : undefined}
              sx={{
                bgcolor: questions.length > 0 ? '#F62B25' : '#D1D5DB',
                height: 40,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: space[24],
                cursor: questions.length > 0 ? 'pointer' : 'default',
                '&:hover': questions.length > 0 ? { bgcolor: '#E02520' } : {},
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
                ถัดไปตรวจสอบ
              </Typography>
            </Box>
          </Box>
        </>
      )}

      {/* ═══ Step 3: Review & Confirm ═══ */}
      {currentStep === 3 && (
        <>
          {/* ── ข้อมูลแบบทดสอบ summary card ── */}
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              border: '2px solid #E5E7EB',
              borderRadius: '10px',
              p: { xs: '16px', sm: '26px' },
              display: 'flex',
              flexDirection: 'column',
              gap: space[16],
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '27px',
                letterSpacing: '-0.44px',
                color: '#101828',
              }}
            >
              ข้อมูลแบบทดสอบ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[12] }}>
              {[
                { label: 'ชื่อ:', value: title },
                { label: 'หมวดหมู่:', value: category },
                { label: 'คำอธิบาย:', value: description },
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', gap: space[8], alignItems: 'baseline' }}>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#6B7280',
                      flexShrink: 0,
                    }}
                  >
                    {row.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                      fontWeight: 500,
                      fontSize: 14,
                      lineHeight: '20px',
                      color: '#101828',
                    }}
                  >
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── คำถามทั้งหมด ── */}
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              border: '2px solid #E5E7EB',
              borderRadius: '10px',
              p: { xs: '16px', sm: '26px' },
              display: 'flex',
              flexDirection: 'column',
              gap: space[16],
            }}
          >
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '27px',
                letterSpacing: '-0.44px',
                color: '#101828',
              }}
            >
              {`คำถามทั้งหมด (${questions.length} ข้อ)`}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[16] }}>
              {questions.map((q, idx) => {
                const isMultiple = q.type === 'multiple_choice'
                return (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: space[8],
                      pb: idx < questions.length - 1 ? space[16] : 0,
                      borderBottom: idx < questions.length - 1 ? '1px solid #E5E7EB' : 'none',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
                      <Typography
                        sx={{
                          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                          fontWeight: 500,
                          fontSize: 16,
                          lineHeight: '24px',
                          color: '#101828',
                        }}
                      >
                        {`${idx + 1}. ${q.text}`}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: isMultiple ? '#DBEAFE' : '#F3E8FF',
                          borderRadius: '9999px',
                          height: 20,
                          display: 'inline-flex',
                          alignItems: 'center',
                          px: space[8],
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                            fontWeight: 400,
                            fontSize: 12,
                            lineHeight: '16px',
                            color: isMultiple ? '#1447E6' : '#8200DB',
                          }}
                        >
                          {isMultiple ? 'ปรนัย' : 'ข้อเขียน'}
                        </Typography>
                      </Box>
                    </Box>

                    {isMultiple && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4], pl: space[8] }}>
                        {OPTION_LABELS.map((letter, optIdx) => {
                          const isCorrect = q.correctAnswer === optIdx
                          return (
                            <Box
                              key={letter}
                              sx={{
                                bgcolor: isCorrect ? '#F0FDF4' : 'transparent',
                                border: isCorrect ? '1px solid #7BF1A8' : '1px solid transparent',
                                borderRadius: '8px',
                                px: space[12],
                                py: space[4],
                                display: 'flex',
                                alignItems: 'center',
                                gap: space[8],
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                                  fontWeight: isCorrect ? 500 : 400,
                                  fontSize: 14,
                                  lineHeight: '20px',
                                  color: isCorrect ? '#00A63E' : '#4A5565',
                                }}
                              >
                                {`${letter}. ${q.options[optIdx]}`}
                              </Typography>
                              {isCorrect && (
                                <Box
                                  sx={{
                                    bgcolor: '#00A63E',
                                    borderRadius: '9999px',
                                    height: 18,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    px: space[6],
                                    flexShrink: 0,
                                  }}
                                >
                                  <Typography
                                    sx={{
                                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                                      fontWeight: 500,
                                      fontSize: 11,
                                      color: '#FFFFFF',
                                    }}
                                  >
                                    คำตอบที่ถูกต้อง
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          )
                        })}
                      </Box>
                    )}

                    {!isMultiple && (
                      <Box
                        sx={{
                          bgcolor: '#FAF5FF',
                          border: '1px solid #E9D4FF',
                          borderRadius: '8px',
                          px: space[12],
                          py: space[8],
                          ml: space[8],
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                            fontWeight: 500,
                            fontSize: 13,
                            color: '#8200DB',
                          }}
                        >
                          📝 คำตอบแบบข้อเขียน
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          </Box>

          {/* ── Bottom navigation buttons ── */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box
              onClick={() => setCurrentStep(2)}
              sx={{
                height: 44,
                borderRadius: '10px',
                border: '2px solid #F62B25',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: space[24],
                cursor: 'pointer',
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
                ย้อนกลับแก้ไข
              </Typography>
            </Box>

            <Box
              onClick={onCancel}
              sx={{
                bgcolor: '#00A63E',
                height: 44,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: space[24],
                cursor: 'pointer',
                '&:hover': { bgcolor: '#059642' },
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
                ✓ บันทึกแบบทดสอบ
              </Typography>
            </Box>
          </Box>
        </>
      )}
    </Box>
  )
}
