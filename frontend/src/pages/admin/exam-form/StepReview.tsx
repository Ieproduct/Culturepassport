// Step 3: Review & Confirm for CreateExamForm wizard

import { Box, Typography } from '@mui/material'
import { FONT_FAMILY } from '@/theme/fonts'
import { space } from '@/theme/spacing'
import {
  cardSx,
  sectionTitleSx,
  metaLabelSx,
  metaValueSx,
  OPTION_LABELS,
  type Question,
} from '../exam-shared'
import { QuestionTypeBadge } from '../QuestionTypeBadge'

type StepReviewProps = {
  title: string
  description: string
  category: string
  questions: Question[]
  onBack: () => void
  onSubmit: () => void
}

export function StepReview({
  title,
  description,
  category,
  questions,
  onBack,
  onSubmit,
}: StepReviewProps) {
  return (
    <>
      {/* ข้อมูลแบบทดสอบ summary card */}
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

      {/* คำถามทั้งหมด */}
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

      {/* Bottom navigation buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
            ย้อนกลับแก้ไข
          </Typography>
        </Box>

        <Box
          onClick={onSubmit}
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
  )
}
