// Shared constants, types, and styles for exam-related components
// (CreateExamForm, ExamsTab, ExamDetailView)

/* ─── Font families ─── */
export const FONT_FAMILY = "'Inter', 'Noto Sans Thai', sans-serif"
export const FONT_FAMILY_INTER = "'Inter', sans-serif"

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

/* ─── Category color map (Figma exam card badges) ─── */
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  'ความปลอดภัยและนโยบาย': { bg: '#FFE2E2', text: '#9F0712' },
  'วัฒนธรรมองค์กร': { bg: '#DBEAFE', text: '#193CB8' },
  'เทคนิคการทำงาน': { bg: '#DCFCE7', text: '#016630' },
  'ทีมและการสื่อสาร': { bg: '#F3E8FF', text: '#8200DB' },
  'การพัฒนาทักษะ': { bg: '#FFF7ED', text: '#9A3412' },
  'ผลิตภัณฑ์และบริการ': { bg: '#F0F9FF', text: '#0369A1' },
  'กระบวนการทำงาน': { bg: '#F5F5F5', text: '#525252' },
  'ความรู้ทางธุรกิจ': { bg: '#FFFBEB', text: '#92400E' },
  'เทคโนโลยีและเครื่องมือ': { bg: '#F0FDFA', text: '#115E59' },
  'มาตรฐานคุณภาพ': { bg: '#FDF2F8', text: '#9D174D' },
  'อื่นๆ': { bg: '#F3F4F6', text: '#364153' },
}
export const DEFAULT_CATEGORY_COLOR = { bg: '#F3F4F6', text: '#364153' }

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
