// Exam Detail View — extracted from ExamsTab (Figma 52:81339)

import { Box, Typography } from '@mui/material'
import { space } from '@/theme/spacing'
import { IconChevronLeft } from '@/components/icons/IconChevronLeft'
import {
  FONT_FAMILY,
  OPTION_LABELS,
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_COLOR,
  cardSx,
  sectionTitleSx,
  pageTitleSx,
  pageSubtitleSx,
  metaLabelSx,
  metaValueSx,
} from './exam-shared'
import { QuestionTypeBadge } from './QuestionTypeBadge'
import { MOCK_QUESTIONS } from './exam-mock-data'

export function ExamDetailView({
  exam,
  onBack,
}: {
  exam: {
    id: string
    title: string
    description: string
    category: string
    questionCount: number
    duration: number
    passingScore: number
  }
  onBack: () => void
}) {
  const catColor = CATEGORY_COLORS[exam.category] ?? DEFAULT_CATEGORY_COLOR
  const questions = MOCK_QUESTIONS[exam.id] ?? []

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[16] }}>
      {/* ═══ Header: Back icon + Title ═══ */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: space[12],
          minHeight: 60,
        }}
      >
        <Box
          onClick={onBack}
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            '&:hover': { bgcolor: '#F3F4F6' },
            transition: 'background-color 0.15s',
          }}
        >
          <IconChevronLeft variant="solid" sx={{ fontSize: 24, color: '#364153' }} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <Typography sx={pageTitleSx}>{exam.title}</Typography>
          <Typography sx={pageSubtitleSx}>ดูรายละเอียดแบบทดสอบ</Typography>
        </Box>
      </Box>

      {/* ═══ ข้อมูลทั่วไป card ═══ */}
      <Box sx={{ ...cardSx, gap: space[16] }}>
        <Typography sx={sectionTitleSx}>ข้อมูลทั่วไป</Typography>

        {/* 2x2 grid info rows */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: space[12],
          }}
        >
          {/* หมวดหมู่ */}
          <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center' }}>
            <Typography sx={{ ...metaLabelSx, flexShrink: 0 }}>หมวดหมู่:</Typography>
            <Box
              sx={{
                bgcolor: catColor.bg,
                borderRadius: '4px',
                height: 28,
                display: 'inline-flex',
                alignItems: 'center',
                px: space[8],
              }}
            >
              <Typography
                sx={{
                  fontFamily: FONT_FAMILY,
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: catColor.text,
                }}
              >
                {exam.category}
              </Typography>
            </Box>
          </Box>
          {/* จำนวนข้อ */}
          <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center' }}>
            <Typography sx={metaLabelSx}>จำนวนข้อ:</Typography>
            <Typography sx={metaValueSx}>{exam.questionCount} ข้อ</Typography>
          </Box>
          {/* ระยะเวลา */}
          <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center' }}>
            <Typography sx={metaLabelSx}>ระยะเวลา:</Typography>
            <Typography sx={metaValueSx}>{exam.duration} นาที</Typography>
          </Box>
          {/* คะแนนผ่าน */}
          <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center' }}>
            <Typography sx={metaLabelSx}>คะแนนผ่าน:</Typography>
            <Typography sx={metaValueSx}>{exam.passingScore}%</Typography>
          </Box>
        </Box>

        {/* คำอธิบาย */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <Typography sx={metaLabelSx}>คำอธิบาย:</Typography>
          <Typography
            sx={{
              fontFamily: FONT_FAMILY,
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: '#364153',
            }}
          >
            {exam.description}
          </Typography>
        </Box>
      </Box>

      {/* ═══ คำถามทั้งหมด ═══ */}
      <Box sx={{ ...cardSx, gap: space[16] }}>
        <Typography sx={sectionTitleSx}>คำถามทั้งหมด</Typography>

        {/* Question list */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[16] }}>
          {questions.map((q, idx) => {
            const isMultiple = q.type === 'multiple_choice'
            return (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: space[12],
                }}
              >
                {/* Question header: number + text + badge */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: space[8], flexWrap: 'wrap' }}>
                  <Typography
                    sx={{
                      fontFamily: FONT_FAMILY,
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: '24px',
                      letterSpacing: '-0.31px',
                      color: '#101828',
                    }}
                  >
                    {`${idx + 1}. ${q.text}`}
                  </Typography>
                  <QuestionTypeBadge type={q.type} />
                </Box>

                {/* Answer content */}
                {isMultiple ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[6] }}>
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
                            py: space[6],
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
                                height: 20,
                                display: 'inline-flex',
                                alignItems: 'center',
                                px: space[8],
                                flexShrink: 0,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontFamily: FONT_FAMILY,
                                  fontWeight: 500,
                                  fontSize: 12,
                                  lineHeight: '16px',
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
                ) : (
                  /* Essay answer preview */
                  <Box
                    sx={{
                      bgcolor: '#FAF5FF',
                      border: '1px solid #E9D4FF',
                      borderRadius: '8px',
                      p: space[12],
                      display: 'flex',
                      flexDirection: 'column',
                      gap: space[4],
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: FONT_FAMILY,
                        fontWeight: 500,
                        fontSize: 14,
                        lineHeight: '20px',
                        color: '#8200DB',
                      }}
                    >
                      📝 คำตอบแบบข้อเขียน
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: FONT_FAMILY,
                        fontWeight: 400,
                        fontSize: 12,
                        lineHeight: '16px',
                        color: '#A855F7',
                      }}
                    >
                      จำกัดความยาว: คำ
                    </Typography>
                    <Box
                      sx={{
                        bgcolor: '#FFFFFF',
                        border: '1px solid #E9D4FF',
                        borderRadius: '6px',
                        p: space[8],
                        mt: space[4],
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: FONT_FAMILY,
                          fontWeight: 400,
                          fontSize: 14,
                          lineHeight: '20px',
                          color: 'rgba(10,10,10,0.4)',
                          fontStyle: 'italic',
                        }}
                      >
                        พนักงานพิมพ์คำตอบที่นี่...
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Divider between questions */}
                {idx < questions.length - 1 && (
                  <Box sx={{ height: '1px', bgcolor: '#E5E7EB', mt: space[4] }} />
                )}
              </Box>
            )
          })}
        </Box>
      </Box>
    </Box>
  )
}
