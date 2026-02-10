// IE Design System — Spacing Tokens
// Source: Spacing.json (Figma)
// Naming: space[N] matches Figma "Spacing - N" exactly
//
// Usage in MUI sx:
//   import { space } from '@/theme/spacing'
//   <Box sx={{ p: space[24], gap: space[16], mt: space[8] }}>

export const space = {
  0: '0px',
  2: '2px',
  3: '3px',
  4: '4px',
  6: '6px',
  8: '8px',
  12: '12px',
  16: '16px',
  20: '20px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
  56: '56px',
  64: '64px',
  72: '72px',
  80: '80px',
  88: '88px',
  96: '96px',
  104: '104px',
  120: '120px',
  128: '128px',
  144: '144px',
  168: '168px',
  200: '200px',
  256: '256px',
  328: '328px',
  400: '400px',
} as const

// MUI theme spacing base (8px grid)
export const SPACING_BASE = 8

// Legacy mapping (MUI multiplier → px) — kept for backward compatibility
export const spacingTokens = {
  0: 0,
  0.25: 2,
  0.375: 3,
  0.5: 4,
  0.75: 6,
  1: 8,
  1.5: 12,
  2: 16,
  2.5: 20,
  3: 24,
  4: 32,
  5: 40,
  6: 48,
  7: 56,
  8: 64,
  9: 72,
  10: 80,
  11: 88,
  12: 96,
  13: 104,
  15: 120,
  16: 128,
  18: 144,
  21: 168,
  25: 200,
  32: 256,
  41: 328,
  50: 400,
} as const
