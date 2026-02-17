// IE Design System — Category Color Map
// Unified color definitions for mission/exam category badges
// Merges exam-shared's 11 categories + MissionsTab's border values

export interface CategoryColor {
  bg: string
  border: string
  text: string
}

/** Category color map — all 11 categories with bg, border, and text */
export const CATEGORY_COLORS: Record<string, CategoryColor> = {
  'วัฒนธรรมองค์กร': { bg: '#DBEAFE', border: '#BEDBFF', text: '#1447E6' },
  'ความปลอดภัยและนโยบาย': { bg: '#FFE2E2', border: '#FFC9C9', text: '#C10007' },
  'เทคนิคการทำงาน': { bg: '#DCFCE7', border: '#B9F8CF', text: '#008236' },
  'ทีมและการสื่อสาร': { bg: '#F3E8FF', border: '#E9D4FF', text: '#8200DB' },
  'การพัฒนาทักษะ': { bg: '#FFF7ED', border: '#FED7AA', text: '#9A3412' },
  'ผลิตภัณฑ์และบริการ': { bg: '#F0F9FF', border: '#BAE6FD', text: '#0369A1' },
  'กระบวนการทำงาน': { bg: '#F5F5F5', border: '#E5E5E5', text: '#525252' },
  'ความรู้ทางธุรกิจ': { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
  'เทคโนโลยีและเครื่องมือ': { bg: '#F0FDFA', border: '#99F6E4', text: '#115E59' },
  'มาตรฐานคุณภาพ': { bg: '#FDF2F8', border: '#FBCFE8', text: '#9D174D' },
  'อื่นๆ': { bg: '#F3F4F6', border: '#E5E7EB', text: '#364153' },
}

/** Default fallback for unknown categories */
export const DEFAULT_CATEGORY_COLOR: CategoryColor = { bg: '#F3F4F6', border: '#E5E7EB', text: '#364153' }
