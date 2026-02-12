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
import { IconEdit } from '@/components/icons/IconEdit'
import { IconDelete } from '@/components/icons/IconDelete'
import {
  FONT_FAMILY,
  FONT_FAMILY_INTER,
  EXAM_CATEGORIES,
  OPTION_LABELS,
  cardSx,
  sectionTitleSx,
  pageTitleSx,
  pageSubtitleSx,
  metaLabelSx,
  metaValueSx,
  type Question,
  type QuestionType,
} from './exam-shared'
import { QuestionTypeBadge } from './QuestionTypeBadge'

/* ─── Step Indicator (Figma 50:15055 / 51:15273) ─── */
type StepState = 'past' | 'active' | 'upcoming'

function StepIndicator({ step, label, state }: { step: number; label: string; state: StepState }) {
  const circleStyles = {
    past: { bgcolor: '#F62B25', border: 'none', color: '#FFFFFF' },
    active: { bgcolor: 'transparent', border: '2px solid #F62B25', color: '#F62B25' },
    upcoming: { bgcolor: 'transparent', border: '2px solid #D1D5DC', color: '#99A1AF' },
  }
  const labelColor = state === 'upcoming' ? '#99A1AF' : '#F62B25'
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
            fontFamily: FONT_FAMILY_INTER,
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
          fontFamily: FONT_FAMILY,
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
        fontFamily: FONT_FAMILY,
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
    fontFamily: FONT_FAMILY,
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value)
  }

  const resetCurrentQuestion = () => {
    setQuestionType('multiple_choice')
    setQuestionText('')
    setOptions(['', '', '', ''])
    setCorrectAnswer(null)
    setEditingIndex(null)
  }

  const handleAddQuestion = () => {
    if (!questionText.trim()) return
    const newQuestion: Question = {
      type: questionType,
      text: questionText,
      options: [...options],
      correctAnswer: questionType === 'multiple_choice' ? correctAnswer : null,
    }
    if (editingIndex !== null) {
      setQuestions((prev) => prev.map((q, i) => (i === editingIndex ? newQuestion : q)))
      setEditingIndex(null)
    } else {
      setQuestions((prev) => [...prev, newQuestion])
    }
    resetCurrentQuestion()
  }

  const handleEditQuestion = (idx: number) => {
    const q = questions[idx]
    setQuestionType(q.type)
    setQuestionText(q.text)
    setOptions([...q.options])
    setCorrectAnswer(q.correctAnswer)
    setEditingIndex(idx)
  }

  const handleDeleteQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx))
    if (editingIndex === idx) {
      resetCurrentQuestion()
    } else if (editingIndex !== null && editingIndex > idx) {
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
        : ['past', 'past', 'active']

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
          <Typography sx={pageTitleSx}>
            สร้างแบบทดสอบใหม่
          </Typography>
          <Typography sx={pageSubtitleSx}>
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
              fontFamily: FONT_FAMILY,
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
                    bgcolor: editingIndex === idx ? '#FEF2F2' : '#FFFFFF',
                    border: editingIndex === idx ? '2px solid #F62B25' : '1px solid #E5E7EB',
                    borderRadius: '10px',
                    px: space[24],
                    py: space[16],
                    display: 'flex',
                    flexDirection: 'column',
                    gap: space[8],
                  }}
                >
                  {/* Header row: number + text + badge + actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: space[12] }}>
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
                          fontFamily: FONT_FAMILY_INTER,
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
                          fontFamily: FONT_FAMILY,
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
                    <QuestionTypeBadge type={q.type} />
                    {/* Edit button */}
                    <Box
                      onClick={() => handleEditQuestion(idx)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        '&:hover': { bgcolor: '#F3F4F6' },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <IconEdit variant="solid" sx={{ fontSize: 14, color: '#6B7280' }} />
                    </Box>
                    {/* Delete button */}
                    <Box
                      onClick={() => handleDeleteQuestion(idx)}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        flexShrink: 0,
                        '&:hover': { bgcolor: '#F3F4F6' },
                        transition: 'background-color 0.15s',
                      }}
                    >
                      <IconDelete variant="solid" sx={{ fontSize: 14, color: '#6B7280' }} />
                    </Box>
                  </Box>

                  {/* Details: options for multiple choice / essay label */}
                  {q.type === 'multiple_choice' ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4], pl: '40px' }}>
                      {OPTION_LABELS.map((letter, optIdx) => {
                        const isCorrect = q.correctAnswer === optIdx
                        return (
                          <Typography
                            key={letter}
                            sx={{
                              fontFamily: FONT_FAMILY,
                              fontWeight: isCorrect ? 500 : 400,
                              fontSize: 13,
                              lineHeight: '20px',
                              color: isCorrect ? '#00A63E' : '#6A7282',
                            }}
                          >
                            {`${letter}. ${q.options[optIdx] || '—'}`}
                            {isCorrect && ' ✓'}
                          </Typography>
                        )
                      })}
                    </Box>
                  ) : (
                    <Typography
                      sx={{
                        fontFamily: FONT_FAMILY,
                        fontWeight: 400,
                        fontSize: 13,
                        color: '#8200DB',
                        pl: '40px',
                      }}
                    >
                      คำตอบแบบข้อเขียน
                    </Typography>
                  )}
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
                fontFamily: FONT_FAMILY,
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '28px',
                color: '#101828',
              }}
            >
              {editingIndex !== null ? `แก้ไขคำถามข้อ ${editingIndex + 1}` : 'เพิ่มคำถามใหม่'}
            </Typography>

            {/* Question type radio */}
            <Box>
              <Typography
                sx={{
                  fontFamily: FONT_FAMILY,
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
                      fontFamily: FONT_FAMILY,
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
                      fontFamily: FONT_FAMILY,
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
                  fontFamily: FONT_FAMILY,
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
                    fontFamily: FONT_FAMILY,
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
                    fontFamily: FONT_FAMILY,
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
                          fontFamily: FONT_FAMILY_INTER,
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
                            fontFamily: FONT_FAMILY,
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
                    fontFamily: FONT_FAMILY,
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
                  fontFamily: FONT_FAMILY,
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: '24px',
                  color: '#FFFFFF',
                }}
              >
                {editingIndex !== null ? '✓ บันทึกการแก้ไข' : '+ เพิ่มคำถามนี้'}
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
                  fontFamily: FONT_FAMILY,
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
                  fontFamily: FONT_FAMILY,
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
          <Box sx={{ ...cardSx, gap: space[16] }}>
            <Typography sx={sectionTitleSx}>
              ข้อมูลแบบทดสอบ
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[12] }}>
              {[
                { label: 'ชื่อ:', value: title },
                { label: 'หมวดหมู่:', value: category },
                { label: 'คำอธิบาย:', value: description },
              ].map((row) => (
                <Box key={row.label} sx={{ display: 'flex', gap: space[8], alignItems: 'baseline' }}>
                  <Typography sx={{ ...metaLabelSx, flexShrink: 0 }}>
                    {row.label}
                  </Typography>
                  <Typography sx={metaValueSx}>
                    {row.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── คำถามทั้งหมด ── */}
          <Box sx={{ ...cardSx, gap: space[16] }}>
            <Typography sx={sectionTitleSx}>
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
                          fontFamily: FONT_FAMILY,
                          fontWeight: 500,
                          fontSize: 16,
                          lineHeight: '24px',
                          color: '#101828',
                        }}
                      >
                        {`${idx + 1}. ${q.text}`}
                      </Typography>
                      <QuestionTypeBadge type={q.type} />
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
                                  fontFamily: FONT_FAMILY,
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
                                      fontFamily: FONT_FAMILY,
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
                            fontFamily: FONT_FAMILY,
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
                  fontFamily: FONT_FAMILY,
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
                  fontFamily: FONT_FAMILY,
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
