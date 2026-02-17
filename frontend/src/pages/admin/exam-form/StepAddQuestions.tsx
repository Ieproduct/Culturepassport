// Step 2: Add Questions for CreateExamForm wizard (Figma 51:15273)

import { Box, Typography, TextField, Radio, RadioGroup, FormControlLabel } from '@mui/material'
import { FONT_FAMILY, FONT_FAMILY_LATIN } from '@/theme/fonts'
import { space } from '@/theme/spacing'
import { IconEdit } from '@/components/icons/IconEdit'
import { IconDelete } from '@/components/icons/IconDelete'
import { OPTION_LABELS, type Question, type QuestionType } from '../exam-shared'
import { QuestionTypeBadge } from '../QuestionTypeBadge'

type StepAddQuestionsProps = {
  questions: Question[]
  questionType: QuestionType
  setQuestionType: (v: QuestionType) => void
  questionText: string
  setQuestionText: (v: string) => void
  options: [string, string, string, string]
  correctAnswer: number | null
  setCorrectAnswer: (v: number | null) => void
  editingIndex: number | null
  handleAddQuestion: () => void
  handleEditQuestion: (idx: number) => void
  handleDeleteQuestion: (idx: number) => void
  handleOptionChange: (index: number, value: string) => void
  onBack: () => void
  onNext: () => void
}

export function StepAddQuestions({
  questions,
  questionType,
  setQuestionType,
  questionText,
  setQuestionText,
  options,
  correctAnswer,
  setCorrectAnswer,
  editingIndex,
  handleAddQuestion,
  handleEditQuestion,
  handleDeleteQuestion,
  handleOptionChange,
  onBack,
  onNext,
}: StepAddQuestionsProps) {
  return (
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
                      fontFamily: FONT_FAMILY_LATIN,
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
                      fontFamily: FONT_FAMILY_LATIN,
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
          onClick={onBack}
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
          onClick={questions.length > 0 ? onNext : undefined}
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
  )
}
