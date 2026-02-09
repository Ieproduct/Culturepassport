// IE Design System — Spacing Tokens
// Source: space system.json (Figma)
// Base unit: 8px grid system (Constitution Principle II)

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
} as const;

// MUI spacing base = 8px
// Usage: theme.spacing(1) = 8px, theme.spacing(2) = 16px, etc.
export const SPACING_BASE = 8;
