// Shared components and styles for the CreateExamForm wizard steps

import { Box, Typography } from '@mui/material'
import { FONT_FAMILY, FONT_FAMILY_LATIN } from '@/theme/fonts'
import { space } from '@/theme/spacing'

/* ─── Step Indicator (Figma 50:15055 / 51:15273) ─── */
export type StepState = 'past' | 'active' | 'upcoming'

export function StepIndicator({ step, label, state }: { step: number; label: string; state: StepState }) {
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
            fontFamily: FONT_FAMILY_LATIN,
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
export function FormLabel({ children, required = false }: { children: React.ReactNode; required?: boolean }) {
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
export const inputSx = {
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
