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
import { IconEdit } from '@/components/icons/IconEdit'
import { IconDelete } from '@/components/icons/IconDelete'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import type { Dayjs } from 'dayjs'
import { space } from '@/theme/spacing'

/* ═══════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════ */

const FONT = "'Inter', 'Noto Sans Thai', sans-serif"
const FONT_INTER = "'Inter', sans-serif"
const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

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

/* ═══════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════ */

type QuestionType = 'multiple_choice' | 'essay'

interface Question {
  type: QuestionType
  text: string
  options: [string, string, string, string]
  correctAnswer: number | null
}

export type ExamInitialData = {
  id: string
  title: string
  description: string
  category: string
}

type CreateExamFormProps = {
  onCancel: () => void
  initialData?: ExamInitialData
}

/* ═══════════════════════════════════════════════
   Shared Styles
   ═══════════════════════════════════════════════ */

const sectionTitleSx = {
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: 18,
  lineHeight: '27px',
  letterSpacing: '-0.44px',
  color: '#101828',
} as const

const helpTextSx = {
  fontFamily: FONT,
  fontWeight: 400,
  fontSize: 12,
  lineHeight: '16px',
  color: '#6A7282',
} as const

const radioLabelSx = {
  '& .MuiFormControlLabel-label': {
    fontFamily: FONT,
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: '-0.31px',
    color: '#364153',
    ml: space[8],
  },
} as const

/** Border-1 input style (Step 1 fields) */
const inputSx = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: FONT,
    fontSize: 16,
    letterSpacing: '-0.31px',
    '& fieldset': { borderWidth: '1px', borderColor: '#D1D5DC' },
    '&:hover fieldset': { borderColor: '#F62B25' },
    '&.Mui-focused fieldset': { borderColor: '#F62B25', borderWidth: '2px' },
  },
  '& .MuiOutlinedInput-input': {
    '&::placeholder': { color: 'rgba(10,10,10,0.4)', opacity: 1 },
  },
}

/** Shared field label style for Step 2 */
const fieldLabelSx = (mb: string) => ({
  fontFamily: FONT,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '-0.15px',
  color: '#364153',
  mb,
}) as const

/** Question text style used in question cards */
const questionTextSx = {
  fontFamily: FONT,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: '24px',
  letterSpacing: '-0.31px',
  color: '#101828',
} as const

/* ═══════════════════════════════════════════════
   Reusable Components
   ═══════════════════════════════════════════════ */

/* ─── Step Indicator ─── */
type StepState = 'completed' | 'past' | 'active' | 'upcoming'

const STEP_CIRCLE: Record<StepState, { bgcolor: string; border: string; color: string }> = {
  completed: { bgcolor: '#F0FDF4', border: '2px solid #00A63E', color: '#00A63E' },
  past: { bgcolor: '#F62B25', border: 'none', color: '#FFFFFF' },
  active: { bgcolor: 'transparent', border: '2px solid #F62B25', color: '#F62B25' },
  upcoming: { bgcolor: 'transparent', border: '2px solid #D1D5DC', color: '#99A1AF' },
}

const STEP_LABEL_COLOR: Record<StepState, string> = {
  completed: '#00A63E',
  past: '#F62B25',
  active: '#F62B25',
  upcoming: '#99A1AF',
}

function StepIndicator({ step, label, state }: { step: number; label: string; state: StepState }) {
  const cs = STEP_CIRCLE[state]
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8] }}>
      <Box
        sx={{
          width: 32, height: 32, borderRadius: '50%',
          bgcolor: cs.bgcolor, border: cs.border,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            fontFamily: FONT_INTER,
            fontWeight: 600,
            fontSize: state === 'completed' ? 18 : 16,
            lineHeight: '24px',
            color: cs.color,
          }}
        >
          {state === 'completed' ? '✓' : step}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: FONT,
          fontWeight: 500,
          fontSize: { xs: 13, sm: 16 },
          lineHeight: '24px',
          color: STEP_LABEL_COLOR[state],
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
    <Typography sx={{ fontFamily: FONT, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#101828', mb: space[6] }}>
      {children}
      {required && <Box component="span" sx={{ color: '#F62B25', ml: space[4] }}>*</Box>}
    </Typography>
  )
}

/* ─── Action Button (filled / outline, red / green) ─── */
function ActionButton({
  variant = 'filled',
  color = 'red',
  disabled,
  onClick,
  children,
  height = 44,
  px: hPad,
  borderWidth = '2px',
}: {
  variant?: 'filled' | 'outline'
  color?: 'red' | 'green'
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
  height?: number
  px?: string | { xs: string; sm: string }
  borderWidth?: string
}) {
  const hasHPad = hPad !== undefined
  const labelSx = {
    fontFamily: FONT,
    fontWeight: 500,
    fontSize: 16,
    lineHeight: '24px',
    letterSpacing: '-0.31px',
    ...(hasHPad && { whiteSpace: 'nowrap' as const }),
  }

  if (variant === 'outline') {
    return (
      <Box
        onClick={onClick}
        sx={{
          height, borderRadius: '10px', border: `${borderWidth} solid #F62B25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...(hasHPad && { px: hPad }),
          cursor: 'pointer', '&:hover': { bgcolor: '#FEF2F2' }, transition: 'background-color 0.15s',
        }}
      >
        <Typography sx={{ ...labelSx, color: '#F62B25' }}>{children}</Typography>
      </Box>
    )
  }

  const colors = color === 'green'
    ? { bg: '#00A63E', hover: '#008F35' }
    : { bg: '#F62B25', hover: '#E02520' }

  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        bgcolor: disabled ? '#D1D5DB' : colors.bg,
        height, borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...(hasHPad && { px: hPad }),
        cursor: disabled ? 'default' : 'pointer',
        '&:hover': disabled ? {} : { bgcolor: colors.hover },
        transition: 'background-color 0.15s',
      }}
    >
      <Typography sx={{ ...labelSx, color: '#FFFFFF' }}>{children}</Typography>
    </Box>
  )
}

/* ─── Question Type Badge ─── */
function TypeBadge({ type }: { type: QuestionType }) {
  const isMultiple = type === 'multiple_choice'
  return (
    <Box
      sx={{
        bgcolor: isMultiple ? '#DBEAFE' : '#F3E8FF',
        borderRadius: '9999px', height: 20,
        display: 'inline-flex', alignItems: 'center', px: space[8], flexShrink: 0,
      }}
    >
      <Typography sx={{ fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: '16px', color: isMultiple ? '#1447E6' : '#8200DB' }}>
        {isMultiple ? 'ปรนัย' : 'ข้อเขียน'}
      </Typography>
    </Box>
  )
}

/* ─── Info Row (Step 3 summary) ─── */
function InfoRow({ label, value, valueColor = '#101828', valueFontWeight = 500 }: {
  label: string; value: string; valueColor?: string; valueFontWeight?: number
}) {
  return (
    <Box sx={{ display: 'flex', gap: space[8] }}>
      <Typography sx={{ fontFamily: FONT, fontWeight: 500, fontSize: 14, lineHeight: '20px', color: '#6B7280', minWidth: 80, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontWeight: valueFontWeight, fontSize: 14, lineHeight: '20px', color: valueColor }}>
        {value}
      </Typography>
    </Box>
  )
}

/* ─── Question List Item (Step 2 added questions) ─── */
function QuestionListItem({ question, index, isEditing, onEdit, onDelete }: {
  question: Question; index: number; isEditing: boolean; onEdit: () => void; onDelete: () => void
}) {
  const isMultiple = question.type === 'multiple_choice'
  return (
    <Box
      sx={{
        bgcolor: isEditing ? '#FEFCE8' : '#F9FAFB',
        border: isEditing ? '2px solid #FFDF20' : '2px solid #E5E7EB',
        borderRadius: '10px', p: { xs: '12px', sm: '18px' },
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}
    >
      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: space[4] }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
          <Typography sx={questionTextSx}>
            {`${index + 1}. ${question.text}`}
          </Typography>
          <TypeBadge type={question.type} />
          {isEditing && (
            <Box sx={{ bgcolor: '#FEF9C2', borderRadius: '9999px', height: 20, display: 'inline-flex', alignItems: 'center', px: space[8], flexShrink: 0 }}>
              <Typography sx={{ fontFamily: FONT, fontWeight: 400, fontSize: 12, lineHeight: '16px', color: '#A65F00' }}>
                กำลังแก้ไข
              </Typography>
            </Box>
          )}
        </Box>

        {isMultiple ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4], mt: space[4] }}>
            {OPTION_LABELS.map((letter, optIdx) => {
              const isCorrect = question.correctAnswer === optIdx
              return (
                <Typography
                  key={letter}
                  sx={{
                    fontFamily: FONT, fontWeight: isCorrect ? 500 : 400, fontSize: 14,
                    lineHeight: '20px', letterSpacing: '-0.15px', color: isCorrect ? '#00A63E' : '#4A5565',
                  }}
                >
                  {`${letter}. ${question.options[optIdx]}${isCorrect ? ' (คำตอบที่ถูกต้อง)' : ''}`}
                </Typography>
              )
            })}
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: space[4], mt: space[4] }}>
            <Typography sx={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: '20px', letterSpacing: '-0.15px', color: '#4A5565' }}>
              ✏️ คำตอบแบบข้อเขียน (สูงสุด 200 คำ)
            </Typography>
          </Box>
        )}
      </Box>

      {/* Edit + Delete icons */}
      <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center', height: 32, flexShrink: 0, ml: space[16] }}>
        <Box
          onClick={onEdit}
          sx={{
            width: 32, height: 32, borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', '&:hover': { bgcolor: '#F3F4F6' }, transition: 'background-color 0.15s',
          }}
        >
          <IconEdit variant="solid" sx={{ fontSize: 16, color: '#6B7280' }} />
        </Box>
        <Box
          onClick={onDelete}
          sx={{
            width: 32, height: 32, borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', '&:hover': { bgcolor: '#FEF2F2' }, transition: 'background-color 0.15s',
          }}
        >
          <IconDelete variant="solid" sx={{ fontSize: 16, color: '#6B7280' }} />
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Question Preview Card (Step 3 review) ─── */
function QuestionPreviewCard({ question, index }: { question: Question; index: number }) {
  const isMultiple = question.type === 'multiple_choice'
  return (
    <Box
      sx={{
        bgcolor: '#F9FAFB', border: '2px solid #E5E7EB', borderRadius: '10px',
        p: '18px', display: 'flex', flexDirection: 'column', gap: space[12],
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
        <Typography sx={questionTextSx}>
          {`${index + 1}. ${question.text}`}
        </Typography>
        <TypeBadge type={question.type} />
      </Box>

      {isMultiple ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[6] }}>
          {OPTION_LABELS.map((letter, optIdx) => {
            const isCorrect = question.correctAnswer === optIdx
            return (
              <Box
                key={letter}
                sx={{
                  bgcolor: isCorrect ? '#F0FDF4' : 'transparent',
                  border: isCorrect ? '1px solid #7BF1A8' : '1px solid transparent',
                  borderRadius: '8px', px: space[12], py: space[6],
                  display: 'flex', alignItems: 'center', gap: space[8],
                }}
              >
                <Typography sx={{ fontFamily: FONT, fontWeight: isCorrect ? 500 : 400, fontSize: 14, lineHeight: '20px', color: isCorrect ? '#00A63E' : '#4A5565' }}>
                  {`${letter}. ${question.options[optIdx]}`}
                </Typography>
                {isCorrect && (
                  <Box sx={{ bgcolor: '#00A63E', borderRadius: '9999px', height: 20, display: 'inline-flex', alignItems: 'center', px: space[8], flexShrink: 0 }}>
                    <Typography sx={{ fontFamily: FONT, fontWeight: 500, fontSize: 12, lineHeight: '16px', color: '#FFFFFF' }}>
                      คำตอบที่ถูกต้อง
                    </Typography>
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
      ) : (
        <Box sx={{ bgcolor: '#FAF5FF', border: '1px solid #E9D4FF', borderRadius: '8px', p: space[12] }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 400, fontSize: 14, lineHeight: '20px', color: '#8200DB', fontStyle: 'italic' }}>
            พนักงานจะตอบคำถามนี้ด้วยข้อเขียน (สูงสุด 200 คำ)
          </Typography>
        </Box>
      )}
    </Box>
  )
}

/* ═══════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════ */

export function CreateExamForm({ onCancel, initialData }: CreateExamFormProps) {
  const isEditMode = !!initialData

  /* ─── Step 1 state ─── */
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [dueDate, setDueDate] = useState<Dayjs | null>(null)

  /* ─── Multi-step state ─── */
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  /* ─── Step 2: questions list ─── */
  const [questions, setQuestions] = useState<Question[]>([])

  /* ─── Step 2: current question being edited ─── */
  const [questionType, setQuestionType] = useState<QuestionType>('multiple_choice')
  const [questionText, setQuestionText] = useState('')
  const [options, setOptions] = useState<[string, string, string, string]>(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

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

  const handleEditQuestion = (idx: number) => {
    const q = questions[idx]
    setEditingIndex(idx)
    setQuestionType(q.type)
    setQuestionText(q.text)
    setOptions([...q.options])
    setCorrectAnswer(q.correctAnswer)
  }

  const handleSaveEdit = () => {
    if (editingIndex === null || !questionText.trim()) return
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === editingIndex
          ? {
              type: questionType,
              text: questionText,
              options: [...options],
              correctAnswer: questionType === 'multiple_choice' ? correctAnswer : null,
            }
          : q
      )
    )
    setEditingIndex(null)
    resetCurrentQuestion()
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    resetCurrentQuestion()
  }

  const handleDeleteQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
    if (editingIndex === idx) {
      setEditingIndex(null)
      resetCurrentQuestion()
    } else if (editingIndex !== null && idx < editingIndex) {
      setEditingIndex(editingIndex - 1)
    }
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
        : ['completed', 'completed', 'active']

  const subtitles: Record<1 | 2 | 3, string> = {
    1: 'กรอกข้อมูลพื้นฐานของแบบทดสอบ',
    2: `เพิ่มคำถาม (${questions.length} ข้อ)`,
    3: 'ตรวจสอบก่อนบันทึก',
  }

  const navPx = { xs: space[16], sm: space[24] }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[16] }}>
      {/* ═══ Header: Title + Cancel button ═══ */}
      <Box
        sx={{
          display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between', gap: space[12], minHeight: 60,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <Typography sx={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, lineHeight: '32px', color: '#101828', letterSpacing: '0.07px' }}>
            {isEditMode ? 'แก้ไขแบบทดสอบ' : 'สร้างแบบทดสอบใหม่'}
          </Typography>
          <Typography sx={{ fontFamily: FONT, fontWeight: 400, fontSize: 16, lineHeight: '24px', color: '#4A5565', letterSpacing: '-0.31px' }}>
            {subtitles[currentStep]}
          </Typography>
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <ActionButton
            variant="outline"
            onClick={onCancel}
            height={40}
            px={space[24]}
            borderWidth={currentStep === 1 ? '1px' : '2px'}
          >
            ยกเลิก
          </ActionButton>
        </Box>
      </Box>

      {/* ═══ Stepper ═══ */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: space[4], sm: space[8] } }}>
        <StepIndicator step={1} label="ข้อมูลพื้นฐาน" state={stepStates[0]} />
        <Box sx={{ flex: 1, height: '2px', bgcolor: '#D1D5DC' }} />
        <StepIndicator step={2} label="เพิ่มคำถาม" state={stepStates[1]} />
        <Box sx={{ flex: 1, height: '2px', bgcolor: '#D1D5DC' }} />
        <StepIndicator step={3} label="ตรวจสอบ" state={stepStates[2]} />
      </Box>

      {/* ═══ Step 1: Basic Info Form ═══ */}
      {currentStep === 1 && (
      <>
        <Box
          sx={{
            bgcolor: '#FFFFFF', border: '2px solid #E5E7EB', borderRadius: '10px',
            p: { xs: space[16], sm: space[32] },
            display: 'flex', flexDirection: 'column', gap: space[24],
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
                width: '100%', height: 44, borderRadius: '10px',
                fontFamily: FONT, fontSize: 16, letterSpacing: '-0.31px',
                '& .MuiOutlinedInput-notchedOutline': { borderWidth: '1px', borderColor: '#D1D5DC' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#F62B25' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F62B25', borderWidth: '2px' },
              }}
              renderValue={(selected) => {
                if (!selected) {
                  return <Typography sx={{ color: 'rgba(10,10,10,0.4)', fontSize: 16 }}>เลือกหมวดหมู่</Typography>
                }
                return selected
              }}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat} sx={{ fontFamily: FONT, fontSize: 16, color: '#0A0A0A' }}>
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
                      borderRadius: '10px', fontFamily: FONT, fontSize: 16,
                      letterSpacing: '-0.31px', height: 44,
                      '& fieldset': { borderWidth: '1px', borderColor: '#D1D5DC' },
                      '&:hover fieldset': { borderColor: '#F62B25' },
                      '&.Mui-focused fieldset': { borderColor: '#F62B25', borderWidth: '2px' },
                    },
                  },
                },
              }}
            />
            <Typography sx={{ ...helpTextSx, color: '#9CA3AF', mt: space[6] }}>
              * ถ้าไม่ระบุ จะไม่มีกำหนดเวลาส่ง
            </Typography>
          </Box>
        </Box>

        {/* Action button — outside panel */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <ActionButton disabled={!isStep1Valid} onClick={() => setCurrentStep(2)} px={space[24]}>
            ถัดไปเพิ่มคำถาม
          </ActionButton>
        </Box>
      </>
      )}

      {/* ═══ Step 2: Add Questions ═══ */}
      {currentStep === 2 && (
        <>
          {/* ── Added questions list ── */}
          {questions.length > 0 && (
            <Box
              sx={{
                bgcolor: '#FFFFFF', border: '2px solid #E5E7EB', borderRadius: '10px',
                p: { xs: '16px', sm: '26px' },
                display: 'flex', flexDirection: 'column', gap: space[16],
              }}
            >
              <Typography sx={sectionTitleSx}>
                {`คำถามที่เพิ่มแล้ว (${questions.length} ข้อ)`}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[12] }}>
                {questions.map((q, idx) => (
                  <QuestionListItem
                    key={idx}
                    question={q}
                    index={idx}
                    isEditing={editingIndex === idx}
                    onEdit={() => handleEditQuestion(idx)}
                    onDelete={() => handleDeleteQuestion(idx)}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* ── Add/Edit question form card ── */}
          <Box
            sx={{
              bgcolor: '#FFFFFF', border: '2px solid #BEDBFF', borderRadius: '10px',
              p: { xs: '16px', sm: '26px' },
              display: 'flex', flexDirection: 'column', gap: space[16],
            }}
          >
            <Typography sx={sectionTitleSx}>
              {editingIndex !== null ? 'แก้ไขคำถาม' : 'เพิ่มคำถามใหม่'}
            </Typography>

            {/* Question type radio */}
            <Box>
              <Typography sx={fieldLabelSx(space[8])}>ประเภทคำถาม</Typography>
              <RadioGroup
                row
                value={questionType}
                onChange={editingIndex !== null ? undefined : (e) => setQuestionType(e.target.value as QuestionType)}
                sx={{ gap: { xs: space[16], sm: space[24] } }}
              >
                <FormControlLabel
                  value="multiple_choice"
                  control={
                    <Radio
                      disabled={editingIndex !== null}
                      sx={{ color: '#D1D5DC', '&.Mui-checked': { color: '#F62B25' }, '& .MuiSvgIcon-root': { fontSize: 16 } }}
                      size="small"
                    />
                  }
                  label="ปรนัย (Multiple Choice)"
                  sx={radioLabelSx}
                />
                <FormControlLabel
                  value="essay"
                  control={
                    <Radio
                      disabled={editingIndex !== null}
                      sx={{ color: '#D1D5DC', '&.Mui-checked': { color: '#F62B25' }, '& .MuiSvgIcon-root': { fontSize: 16 } }}
                      size="small"
                    />
                  }
                  label="ข้อเขียน (Essay)"
                  sx={radioLabelSx}
                />
              </RadioGroup>
              {editingIndex !== null && (
                <Typography sx={{ ...helpTextSx, mt: space[4] }}>
                  * ไม่สามารถเปลี่ยนประเภทคำถามขณะแก้ไขได้
                </Typography>
              )}
            </Box>

            {/* Question text */}
            <Box>
              <Typography sx={fieldLabelSx(space[6])}>คำถาม</Typography>
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
                    borderRadius: '10px', fontFamily: FONT, fontSize: 16,
                    letterSpacing: '-0.31px', minHeight: 92,
                    '& fieldset': { borderWidth: '2px', borderColor: '#D1D5DC' },
                    '&:hover fieldset': { borderColor: '#F62B25' },
                    '&.Mui-focused fieldset': { borderColor: '#F62B25', borderWidth: '2px' },
                  },
                  '& .MuiOutlinedInput-input': {
                    '&::placeholder': { color: 'rgba(10,10,10,0.5)', opacity: 1 },
                  },
                }}
              />
            </Box>

            {/* Options A-D (multiple choice only) */}
            {questionType === 'multiple_choice' && (
              <Box>
                <Typography sx={fieldLabelSx(space[8])}>ตัวเลือก</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
                  {OPTION_LABELS.map((letter, idx) => (
                    <Box key={letter} sx={{ display: 'flex', alignItems: 'center', gap: space[12], height: 44 }}>
                      <Radio
                        checked={correctAnswer === idx}
                        onChange={() => setCorrectAnswer(idx)}
                        sx={{ color: '#D1D5DC', '&.Mui-checked': { color: '#F62B25' }, p: 0, '& .MuiSvgIcon-root': { fontSize: 20 } }}
                      />
                      <Typography sx={{ fontFamily: FONT_INTER, fontWeight: 500, fontSize: 16, color: '#364153', width: 20, flexShrink: 0 }}>
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
                            borderRadius: '10px', fontFamily: FONT, fontSize: 16, height: 44,
                            '& fieldset': { borderWidth: '2px', borderColor: '#D1D5DC' },
                            '&:hover fieldset': { borderColor: '#F62B25' },
                            '&.Mui-focused fieldset': { borderColor: '#F62B25', borderWidth: '2px' },
                          },
                          '& .MuiOutlinedInput-input': {
                            '&::placeholder': { color: 'rgba(10,10,10,0.5)', opacity: 1 },
                          },
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                <Typography sx={{ ...helpTextSx, mt: space[8] }}>
                  * เลือกวงกลมด้านหน้าเพื่อระบุคำตอบที่ถูกต้อง
                </Typography>
              </Box>
            )}

            {/* Action buttons — Edit mode vs Add mode */}
            {editingIndex !== null ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[8] }}>
                <ActionButton disabled={!questionText.trim()} onClick={handleSaveEdit} height={40}>
                  บันทึกการแก้ไข
                </ActionButton>
                <ActionButton variant="outline" onClick={handleCancelEdit}>
                  ยกเลิกการแก้ไข
                </ActionButton>
              </Box>
            ) : (
              <ActionButton disabled={!questionText.trim()} onClick={handleAddQuestion} height={40}>
                + เพิ่มคำถามนี้
              </ActionButton>
            )}
          </Box>

          {/* ── Bottom navigation buttons ── */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space[12] }}>
            <ActionButton variant="outline" onClick={() => setCurrentStep(1)} px={navPx}>
              ย้อนกลับ
            </ActionButton>
            <ActionButton disabled={questions.length === 0} onClick={() => setCurrentStep(3)} height={40} px={navPx}>
              ถัดไปตรวจสอบ
            </ActionButton>
          </Box>
        </>
      )}

      {/* ═══ Step 3: Review ═══ */}
      {currentStep === 3 && (
        <>
          {/* ── ข้อมูลแบบทดสอบ summary card ── */}
          <Box
            sx={{
              bgcolor: '#FFFFFF', border: '2px solid #E5E7EB', borderRadius: '10px',
              p: { xs: '16px', sm: '26px' },
              display: 'flex', flexDirection: 'column', gap: space[16],
            }}
          >
            <Typography sx={sectionTitleSx}>ข้อมูลแบบทดสอบ</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[12] }}>
              <InfoRow label="ชื่อ:" value={title} />
              <InfoRow label="หมวดหมู่:" value={category} />
              <InfoRow label="คำอธิบาย:" value={description} valueColor="#364153" valueFontWeight={400} />
            </Box>
          </Box>

          {/* ── คำถามทั้งหมด ── */}
          <Box
            sx={{
              bgcolor: '#FFFFFF', border: '2px solid #E5E7EB', borderRadius: '10px',
              p: { xs: '16px', sm: '26px' },
              display: 'flex', flexDirection: 'column', gap: space[16],
            }}
          >
            <Typography sx={sectionTitleSx}>
              {`คำถามทั้งหมด (${questions.length} ข้อ)`}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[16] }}>
              {questions.map((q, idx) => (
                <QuestionPreviewCard key={idx} question={q} index={idx} />
              ))}
            </Box>
          </Box>

          {/* ── Bottom navigation buttons ── */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: space[12] }}>
            <ActionButton variant="outline" onClick={() => setCurrentStep(2)} px={navPx}>
              ย้อนกลับแก้ไข
            </ActionButton>
            <ActionButton color="green" onClick={onCancel} px={navPx}>
              ✓ บันทึกแบบทดสอบ
            </ActionButton>
          </Box>
        </>
      )}
    </Box>
  )
}
