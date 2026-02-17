// Shared constants, types, and styles for exam-related components
// (CreateExamForm, ExamsTab, ExamDetailView)

/* ─── Font families (re-exported from central theme) ─── */
export { FONT_FAMILY, FONT_FAMILY_LATIN as FONT_FAMILY_INTER } from '@/theme/fonts'
import { FONT_FAMILY } from '@/theme/fonts'

/* ─── Question types ─── */
export type QuestionType = 'multiple_choice' | 'essay'

export interface Question {
  type: QuestionType
  text: string
  options: [string, string, string, string]
  correctAnswer: number | null // 0-3 for multiple choice, null for essay
}

/* ─── Option labels ─── */
export const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

/* ─── Category list (shared between CreateExamForm & ExamsTab) ─── */
export const EXAM_CATEGORIES = [
  'วัฒนธรรมองค์กร',
  'เทคนิคการทำงาน',
  'ทีมและการสื่อสาร',
  'ความปลอดภัยและนโยบาย',
  'การพัฒนาทักษะ',
  'ผลิตภัณฑ์และบริการ',
  'กระบวนการทำงาน',
  'ความรู้ทางธุรกิจ',
  'เทคโนโลยีและเครื่องมือ',
  'มาตรฐานคุณภาพ',
  'อื่นๆ',
]

/* ─── Category color map (re-exported from central theme) ─── */
export { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from '@/theme/categories'

/* ─── Shared sx patterns ─── */
export const cardSx = {
  bgcolor: '#FFFFFF',
  border: '2px solid #E5E7EB',
  borderRadius: '10px',
  p: { xs: '16px', sm: '26px' },
  display: 'flex',
  flexDirection: 'column',
} as const

export const sectionTitleSx = {
  fontFamily: FONT_FAMILY,
  fontWeight: 600,
  fontSize: 18,
  lineHeight: '27px',
  letterSpacing: '-0.44px',
  color: '#101828',
} as const

export const pageTitleSx = {
  fontFamily: FONT_FAMILY,
  fontWeight: 700,
  fontSize: 24,
  lineHeight: '32px',
  color: '#101828',
  letterSpacing: '0.07px',
} as const

export const pageSubtitleSx = {
  fontFamily: FONT_FAMILY,
  fontWeight: 400,
  fontSize: 16,
  lineHeight: '24px',
  color: '#4A5565',
  letterSpacing: '-0.31px',
} as const

export const metaLabelSx = {
  fontFamily: FONT_FAMILY,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  color: '#6B7280',
} as const

export const metaValueSx = {
  fontFamily: FONT_FAMILY,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  color: '#101828',
} as const
