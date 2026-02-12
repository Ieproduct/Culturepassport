import { Box, Typography } from '@mui/material'
import { space } from '@/theme/spacing'
import { FONT_FAMILY } from './exam-shared'

/**
 * Badge showing question type: ปรนัย (blue) or ข้อเขียน (purple).
 * Extracted from CreateExamForm Step 3 & ExamDetailView — identical rendering.
 */
export function QuestionTypeBadge({ type }: { type: 'multiple_choice' | 'essay' }) {
  const isMultiple = type === 'multiple_choice'
  return (
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
          fontFamily: FONT_FAMILY,
          fontWeight: 400,
          fontSize: 12,
          lineHeight: '16px',
          color: isMultiple ? '#1447E6' : '#8200DB',
        }}
      >
        {isMultiple ? 'ปรนัย' : 'ข้อเขียน'}
      </Typography>
    </Box>
  )
}
