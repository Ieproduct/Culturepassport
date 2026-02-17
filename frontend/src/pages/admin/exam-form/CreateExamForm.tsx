// CreateExamForm — 3-step wizard orchestrator
// Step components extracted to StepBasicInfo, StepAddQuestions, StepReview

import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import type { Dayjs } from 'dayjs'
import { space } from '@/theme/spacing'
import { FONT_FAMILY } from '@/theme/fonts'
import { pageTitleSx, pageSubtitleSx, type Question, type QuestionType } from '../exam-shared'
import { StepIndicator, type StepState } from './exam-form-shared'
import { StepBasicInfo } from './StepBasicInfo'
import { StepAddQuestions } from './StepAddQuestions'
import { StepReview } from './StepReview'

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
      {/* Header: Title + Cancel button */}
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

      {/* Stepper */}
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

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <StepBasicInfo
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          handleCategoryChange={handleCategoryChange}
          dueDate={dueDate}
          setDueDate={setDueDate}
          isStep1Valid={isStep1Valid}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {/* Step 2: Add Questions */}
      {currentStep === 2 && (
        <StepAddQuestions
          questions={questions}
          questionType={questionType}
          setQuestionType={setQuestionType}
          questionText={questionText}
          setQuestionText={setQuestionText}
          options={options}
          correctAnswer={correctAnswer}
          setCorrectAnswer={setCorrectAnswer}
          editingIndex={editingIndex}
          handleAddQuestion={handleAddQuestion}
          handleEditQuestion={handleEditQuestion}
          handleDeleteQuestion={handleDeleteQuestion}
          handleOptionChange={handleOptionChange}
          onBack={() => setCurrentStep(1)}
          onNext={() => setCurrentStep(3)}
        />
      )}

      {/* Step 3: Review & Confirm */}
      {currentStep === 3 && (
        <StepReview
          title={title}
          description={description}
          category={category}
          questions={questions}
          onBack={() => setCurrentStep(2)}
          onSubmit={onCancel}
        />
      )}
    </Box>
  )
}
