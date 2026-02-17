// IE Design System — Typography Tokens
// Source: Figma node 2745:12139
// Font: Inter (Thai fallback: Noto Sans Thai)

import { FONT_FAMILY } from './fonts'

export const typographyTokens = {
  fontFamily: FONT_FAMILY,

  // Header — SemiBold
  h1: {
    fontFamily: FONT_FAMILY,
    fontSize: '2rem',      // 32px
    fontWeight: 600,
    lineHeight: '2.25rem', // 36px
  },
  h2: {
    fontFamily: FONT_FAMILY,
    fontSize: '1.5rem',    // 24px
    fontWeight: 600,
    lineHeight: '2.25rem', // 36px
  },
  h3: {
    fontFamily: FONT_FAMILY,
    fontSize: '1.25rem',   // 20px
    fontWeight: 600,
    lineHeight: '1.75rem', // 28px
  },
  h4: {
    fontFamily: FONT_FAMILY,
    fontSize: '1.125rem',  // 18px
    fontWeight: 600,
    lineHeight: '1.5rem',  // 24px
  },

  // Body — SemiBold (mapped to subtitle variants)
  subtitle1: {
    fontFamily: FONT_FAMILY,
    fontSize: '1.5rem',    // 24px
    fontWeight: 600,
    lineHeight: '1.75rem', // 28px
  },
  subtitle2: {
    fontFamily: FONT_FAMILY,
    fontSize: '1.25rem',   // 20px
    fontWeight: 600,
    lineHeight: '1.5rem',  // 24px
  },

  // Body — Regular
  body1: {
    fontFamily: FONT_FAMILY,
    fontSize: '1rem',      // 16px
    fontWeight: 400,
    lineHeight: '1.25rem', // 20px
  },
  body2: {
    fontFamily: FONT_FAMILY,
    fontSize: '0.875rem',  // 14px
    fontWeight: 400,
    lineHeight: '1.125rem', // 18px
  },

  // Label — Bold
  caption: {
    fontFamily: FONT_FAMILY,
    fontSize: '0.75rem',   // 12px
    fontWeight: 700,
    lineHeight: '1rem',    // 16px
  },
  overline: {
    fontFamily: FONT_FAMILY,
    fontSize: '0.625rem',  // 10px
    fontWeight: 700,
    lineHeight: '0.875rem', // 14px
    textTransform: 'uppercase' as const,
  },

  // Button
  button: {
    fontFamily: FONT_FAMILY,
    fontSize: '0.875rem',  // 14px
    fontWeight: 600,
    lineHeight: '1.25rem', // 20px
    textTransform: 'none' as const,
  },
} as const;

// Extended typography tokens for direct use in sx prop
// These map all IE Design System text styles beyond MUI's built-in variants
export const textStyles = {
  // Body SemiBold (full set)
  bodySemibold1: { fontFamily: FONT_FAMILY, fontSize: '1.5rem', fontWeight: 600, lineHeight: '1.75rem' },   // 24px
  bodySemibold2: { fontFamily: FONT_FAMILY, fontSize: '1.25rem', fontWeight: 600, lineHeight: '1.5rem' },   // 20px
  bodySemibold3: { fontFamily: FONT_FAMILY, fontSize: '1.125rem', fontWeight: 600, lineHeight: '1.375rem' }, // 18px
  bodySemibold4: { fontFamily: FONT_FAMILY, fontSize: '1rem', fontWeight: 600, lineHeight: '1.25rem' },     // 16px
  bodySemibold5: { fontFamily: FONT_FAMILY, fontSize: '0.875rem', fontWeight: 600, lineHeight: '1rem' },    // 14px

  // Body Regular (full set)
  bodyRegular1: { fontFamily: FONT_FAMILY, fontSize: '1.5rem', fontWeight: 400, lineHeight: '1.75rem' },    // 24px
  bodyRegular2: { fontFamily: FONT_FAMILY, fontSize: '1.25rem', fontWeight: 400, lineHeight: '1.5rem' },    // 20px
  bodyRegular3: { fontFamily: FONT_FAMILY, fontSize: '1.125rem', fontWeight: 400, lineHeight: '1.375rem' }, // 18px
  bodyRegular4: { fontFamily: FONT_FAMILY, fontSize: '1rem', fontWeight: 400, lineHeight: '1.25rem' },      // 16px
  bodyRegular5: { fontFamily: FONT_FAMILY, fontSize: '0.875rem', fontWeight: 400, lineHeight: '1.125rem' }, // 14px

  // Label SemiBold/Bold
  labelBold1: { fontFamily: FONT_FAMILY, fontSize: '0.75rem', fontWeight: 700, lineHeight: '1rem' },        // 12px
  labelBold2: { fontFamily: FONT_FAMILY, fontSize: '0.625rem', fontWeight: 700, lineHeight: '0.875rem' },   // 10px
  labelBold3: { fontFamily: FONT_FAMILY, fontSize: '0.5rem', fontWeight: 700, lineHeight: '0.75rem' },      // 8px

  // Label Regular
  labelRegular1: { fontFamily: FONT_FAMILY, fontSize: '0.75rem', fontWeight: 400, lineHeight: '1rem' },     // 12px
  labelRegular2: { fontFamily: FONT_FAMILY, fontSize: '0.625rem', fontWeight: 400, lineHeight: '0.875rem' }, // 10px
  labelRegular3: { fontFamily: FONT_FAMILY, fontSize: '0.5rem', fontWeight: 400, lineHeight: '0.75rem' },   // 8px
} as const;
