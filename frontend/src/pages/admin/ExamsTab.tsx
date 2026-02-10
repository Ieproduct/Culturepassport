import { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Description as ExamIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Category as CategoryIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { IconEdit } from '@/components/icons/IconEdit'
import { IconDelete } from '@/components/icons/IconDelete'
import { IconChevronLeft } from '@/components/icons/IconChevronLeft'
import { space } from '@/theme/spacing'
import { useExams } from '@/hooks/useExams'
import { CreateExamForm, type ExamInitialData } from './CreateExamForm'

const ITEMS_PER_PAGE = 10

/* ─── Category list (Figma 46:14654–46:14676) ─── */
const CATEGORIES = [
  'ทุกหมวดหมู่',
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
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
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
const DEFAULT_CATEGORY_COLOR = { bg: '#F3F4F6', text: '#364153' }

/* ─── Mock question type ─── */
type MockQuestion = {
  type: 'multiple_choice' | 'essay'
  text: string
  options: [string, string, string, string]
  correctAnswer: number | null
}

/* ─── Mock questions for exam-1 (Figma 52:81339) ─── */
const MOCK_QUESTIONS: Record<string, MockQuestion[]> = {
  'exam-1': [
    {
      type: 'multiple_choice',
      text: 'อะไรคือสิ่งสำคัญที่สุดในการรักษาความปลอดภัยของข้อมูล?',
      options: [
        'ใช้รหัสผ่านที่แข็งแกร่งและไม่แชร์ให้ผู้อื่น',
        'ใช้รหัสผ่านเดียวกันทุกระบบเพื่อความสะดวก',
        'เขียนรหัสผ่านไว้บน Post-it',
        'แชร์รหัสผ่านกับเพื่อนร่วมงานที่ใกล้ชิด',
      ],
      correctAnswer: 0,
    },
    {
      type: 'multiple_choice',
      text: 'ถ้าคุณได้รับอีเมลที่ดูน่าสงสัยจากคนที่ไม่รู้จัก คุณควรทำอย่างไร?',
      options: [
        'เปิดดูและคลิกลิงก์เพื่อดูว่าเป็นอะไร',
        'ลบทิ้งและรายงานให้ IT ทราบ',
        'ส่งต่อให้เพื่อนร่วมงาน',
        'ตอบกลับเพื่อถามว่าเป็นใคร',
      ],
      correctAnswer: 1,
    },
    {
      type: 'essay',
      text: 'การทำงานในพื้นที่สาธารณะ (เช่น ร้านกาแฟ) ควรระวังอะไรมากที่สุด?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'ระยะเวลาในการเปลี่ยนรหัสผ่านที่แนะนำคือทุกๆ กี่เดือน?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'USB ที่เจอตามพื้นในออฟฟิศ ควรทำอย่างไร?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'Two-Factor Authentication (2FA) คืออะไร?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'Phishing คืออะไร?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'การสำรองข้อมูล (Backup) ควรทำบ่อยแค่ไหน?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'Wi-Fi สาธารณะที่ไม่มีรหัสผ่าน มีความเสี่ยงอย่างไร?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
    {
      type: 'essay',
      text: 'ถ้าคุณสงสัยว่าบัญชีของคุณถูกแฮก ควรทำอย่างไรเป็นอันดับแรก?',
      options: ['', '', '', ''],
      correctAnswer: null,
    },
  ],
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const

/* ─── Mock data matching Figma 46:14678 exactly ─── */
const MOCK_EXAMS = [
  {
    id: 'exam-1',
    title: 'แบบทดสอบความปลอดภัยทางไซเบอร์',
    description: 'ทดสอบความรู้เกี่ยวกับการรักษาความปลอดภัยข้อมูลและระบบสารสนเทศ',
    category: 'ความปลอดภัยและนโยบาย',
    questionCount: 10,
    duration: 15,
    passingScore: 70,
    isActive: true,
  },
  {
    id: 'exam-2',
    title: 'แบบทดสอบวัฒนธรรมองค์กร',
    description: 'ทดสอบความเข้าใจเกี่ยวกับวัฒนธรรม ค่านิยม และสิทธิประโยชน์ของบริษัท',
    category: 'วัฒนธรรมองค์กร',
    questionCount: 10,
    duration: 10,
    passingScore: 70,
    isActive: true,
  },
  {
    id: 'exam-3',
    title: 'แบบทดสอบ Git และ DevOps',
    description: 'ทดสอบความรู้เกี่ยวกับการใช้งาน Git, Version Control และเครื่องมือ DevOps',
    category: 'เทคนิคการทำงาน',
    questionCount: 10,
    duration: 12,
    passingScore: 70,
    isActive: true,
  },
  {
    id: 'exam-4',
    title: 'แบบประเมินทัศนคติและค่านิยม (มีข้อเขียน)',
    description: 'ประเมินทัศนคติ ค่านิยม และความเข้าใจในวัฒนธรรมองค์กร ผ่านคำถามปรนัยและข้อเขียน',
    category: 'วัฒนธรรมองค์กร',
    questionCount: 12,
    duration: 20,
    passingScore: 70,
    isActive: true,
  },
  {
    id: 'exam-5',
    title: 'ข้อสอบอบรมข้อเขียน',
    description: 'แบบทดสอบข้อเขียนเพื่อประเมินความเข้าใจและการประยุกต์ใช้ความรู้ในการทำงาน',
    category: 'วัฒนธรรมองค์กร',
    questionCount: 5,
    duration: 30,
    passingScore: 60,
    isActive: true,
  },
  {
    id: 'exam-6',
    title: 'แบบทดสอบปลายภาค (ข้อกาและข้อเขียนผสม)',
    description: 'แบบทดสอบครอบคลุมความรู้ทั้งหมด ประกอบด้วยข้อกาและข้อเขียน',
    category: 'วัฒนธรรมองค์กร',
    questionCount: 12,
    duration: 45,
    passingScore: 70,
    isActive: true,
  },
]

/* ─── Stats Card (Figma 46:14589) ─── */
function StatsCard({
  icon,
  iconBgColor,
  label,
  value,
}: {
  icon: React.ReactNode
  iconBgColor: string
  label: string
  value: number
}) {
  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: '2px solid #E5E7EB',
        borderRadius: '10px',
        height: 88,
        pt: '18px',
        px: '18px',
        pb: '18px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: space[12],
          height: 52,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            bgcolor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: '#4A5565',
              letterSpacing: '-0.15px',
            }}
          >
            {label}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              lineHeight: '32px',
              color: '#101828',
              letterSpacing: '0.07px',
            }}
          >
            {value}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Action Icon Button (Figma 46:14710) ─── */
function ActionButton({
  icon,
  onClick,
}: {
  icon: React.ReactNode
  onClick?: () => void
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        width: 36,
        height: 36,
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
      {icon}
    </Box>
  )
}

/* ─── Exam Card (Figma 46:14679) ─── */
function ExamCard({
  title,
  description,
  category,
  questionCount,
  duration,
  passingScore,
  isActive,
  onView,
  onEdit,
  onDelete,
}: {
  title: string
  description: string
  category: string
  questionCount: number
  duration: number
  passingScore: number
  isActive: boolean
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  const catColor = CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: '2px solid #E5E7EB',
        borderRadius: '10px',
        p: { xs: '16px', sm: '26px' },
        display: 'flex',
        flexDirection: 'column',
        gap: space[8],
      }}
    >
      {/* Row: Content left + Actions right */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Left: title, badge, description, meta */}
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: space[8] }}>
          {/* Title + Status badge */}
          <Box sx={{ display: 'flex', gap: space[12], alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                lineHeight: '28px',
                color: '#101828',
                letterSpacing: '-0.44px',
              }}
            >
              {title}
            </Typography>
            <Box
              sx={{
                bgcolor: isActive ? '#DCFCE7' : '#FEF2F2',
                borderRadius: '9999px',
                height: 24,
                display: 'inline-flex',
                alignItems: 'center',
                px: space[12],
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 12,
                  lineHeight: '16px',
                  color: isActive ? '#016630' : '#E7000B',
                }}
              >
                {isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
              </Typography>
            </Box>
          </Box>

          {/* Description */}
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '24px',
              color: '#4A5565',
              letterSpacing: '-0.31px',
            }}
          >
            {description}
          </Typography>

          {/* Meta row */}
          <Box sx={{ display: 'flex', gap: { xs: space[8], sm: space[4] }, alignItems: 'center', flexWrap: 'wrap', rowGap: space[8] }}>
            {/* Category */}
            <Box sx={{ display: 'flex', gap: space[4], alignItems: 'center' }}>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#364153',
                  letterSpacing: '-0.15px',
                }}
              >
                หมวดหมู่:
              </Typography>
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
                    fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                    fontWeight: 400,
                    fontSize: 14,
                    lineHeight: '20px',
                    color: catColor.text,
                    letterSpacing: '-0.15px',
                  }}
                >
                  {category}
                </Typography>
              </Box>
            </Box>

            {/* Question count */}
            <Box sx={{ display: 'flex', gap: space[4], alignItems: 'center', ml: { xs: 0, sm: space[12] } }}>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#364153',
                  letterSpacing: '-0.15px',
                }}
              >
                จำนวนข้อ:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#4A5565',
                  letterSpacing: '-0.15px',
                }}
              >
                {questionCount} ข้อ
              </Typography>
            </Box>

            {/* Duration */}
            <Box sx={{ display: 'flex', gap: space[4], alignItems: 'center', ml: { xs: 0, sm: space[12] } }}>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#364153',
                  letterSpacing: '-0.15px',
                }}
              >
                ระยะเวลา:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#4A5565',
                  letterSpacing: '-0.15px',
                }}
              >
                {duration} นาที
              </Typography>
            </Box>

            {/* Passing score */}
            <Box sx={{ display: 'flex', gap: space[4], alignItems: 'center', ml: { xs: 0, sm: space[12] } }}>
              <Typography
                sx={{
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#364153',
                  letterSpacing: '-0.15px',
                }}
              >
                คะแนนผ่าน:
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: '20px',
                  color: '#4A5565',
                  letterSpacing: '-0.15px',
                }}
              >
                {passingScore}%
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right: Action icons (Figma 46:14710) */}
        <Box
          sx={{
            display: 'flex',
            gap: space[8],
            alignItems: 'center',
            height: 36,
            flexShrink: 0,
            ml: space[16],
          }}
        >
          <ActionButton icon={<ViewIcon sx={{ fontSize: 20, color: '#6B7280' }} />} onClick={onView} />
          <ActionButton icon={<IconEdit variant="solid" sx={{ fontSize: 16, color: '#6B7280' }} />} onClick={onEdit} />
          <ActionButton icon={<IconDelete variant="solid" sx={{ fontSize: 16, color: '#6B7280' }} />} onClick={onDelete} />
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Pagination Button ─── */
function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <Box
      onClick={disabled ? undefined : onClick}
      sx={{
        width: 36,
        height: 36,
        borderRadius: space[8],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        bgcolor: active ? '#F62B25' : 'transparent',
        border: active ? 'none' : '1px solid #E5E7EB',
        opacity: disabled ? 0.4 : 1,
        '&:hover': disabled
          ? {}
          : { bgcolor: active ? '#E02520' : '#F9FAFB' },
        transition: 'background-color 0.15s',
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 14,
          lineHeight: '20px',
          color: active ? '#FFFFFF' : '#364153',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

/* ─── Display exam type ─── */
type DisplayExam = {
  id: string
  title: string
  description: string
  category: string
  questionCount: number
  duration: number
  passingScore: number
  isActive: boolean
}

/* ─── Exam Detail View (Figma 52:81339) ─── */
function ExamDetailView({
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
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              lineHeight: '32px',
              color: '#101828',
              letterSpacing: '0.07px',
            }}
          >
            {exam.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '24px',
              color: '#4A5565',
              letterSpacing: '-0.31px',
            }}
          >
            ดูรายละเอียดแบบทดสอบ
          </Typography>
        </Box>
      </Box>

      {/* ═══ ข้อมูลทั่วไป card ═══ */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '2px solid #E5E7EB',
          borderRadius: '10px',
          p: { xs: '16px', sm: '26px' },
          display: 'flex',
          flexDirection: 'column',
          gap: space[16],
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: '27px',
            letterSpacing: '-0.44px',
            color: '#101828',
          }}
        >
          ข้อมูลทั่วไป
        </Typography>

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
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: '#6B7280',
                flexShrink: 0,
              }}
            >
              หมวดหมู่:
            </Typography>
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
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
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
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: '#6B7280',
              }}
            >
              จำนวนข้อ:
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: '#101828',
              }}
            >
              {exam.questionCount} ข้อ
            </Typography>
          </Box>
          {/* ระยะเวลา */}
          <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center' }}>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: '#6B7280',
              }}
            >
              ระยะเวลา:
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: '#101828',
              }}
            >
              {exam.duration} นาที
            </Typography>
          </Box>
          {/* คะแนนผ่าน */}
          <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center' }}>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: '#6B7280',
              }}
            >
              คะแนนผ่าน:
            </Typography>
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 14,
                lineHeight: '20px',
                color: '#101828',
              }}
            >
              {exam.passingScore}%
            </Typography>
          </Box>
        </Box>

        {/* คำอธิบาย */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '20px',
              color: '#6B7280',
            }}
          >
            คำอธิบาย:
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
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
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '2px solid #E5E7EB',
          borderRadius: '10px',
          p: { xs: '16px', sm: '26px' },
          display: 'flex',
          flexDirection: 'column',
          gap: space[16],
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: '27px',
            letterSpacing: '-0.44px',
            color: '#101828',
          }}
        >
          คำถามทั้งหมด
        </Typography>

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
                      fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: '24px',
                      letterSpacing: '-0.31px',
                      color: '#101828',
                    }}
                  >
                    {`${idx + 1}. ${q.text}`}
                  </Typography>
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
                        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                        fontWeight: 400,
                        fontSize: 12,
                        lineHeight: '16px',
                        color: isMultiple ? '#1447E6' : '#8200DB',
                      }}
                    >
                      {isMultiple ? 'ปรนัย' : 'ข้อเขียน'}
                    </Typography>
                  </Box>
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
                              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
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
                                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
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
                        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
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
                        fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
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
                          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
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

export function ExamsTab() {
  const { examTemplates, loading, error } = useExams()
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ทุกหมวดหมู่')
  const [currentPage, setCurrentPage] = useState(1)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingExam, setEditingExam] = useState<ExamInitialData | null>(null)
  const [viewingExam, setViewingExam] = useState<DisplayExam | null>(null)
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set())

  /* Use real data if available, otherwise fall back to mock */
  const useMock = examTemplates.length === 0 && !loading

  /* Build display list */
  const displayExams: DisplayExam[] = useMemo(() => {
    const raw = useMock
      ? MOCK_EXAMS
      : examTemplates.map((e) => ({
          id: e.id,
          title: e.title,
          description: e.description ?? '',
          category: 'อื่นๆ',
          questionCount: e.questions?.length ?? 0,
          duration: 15,
          passingScore: e.passing_score,
          isActive: true,
        }))
    return raw.filter((e) => !deletedIds.has(e.id))
  }, [useMock, examTemplates, deletedIds])

  /* Compute stats from display exams */
  const stats = useMemo(() => {
    const total = displayExams.length
    const active = displayExams.filter((e) => e.isActive).length
    const inactive = total - active
    const categories = new Set(displayExams.map((e) => e.category)).size
    return { total, active, inactive, categories }
  }, [displayExams])

  /* Client-side search + category filter */
  const filteredExams = useMemo(() => {
    let result = displayExams
    if (selectedCategory !== 'ทุกหมวดหมู่') {
      result = result.filter((e) => e.category === selectedCategory)
    }
    if (searchText.trim()) {
      const lower = searchText.toLowerCase()
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(lower) ||
          e.description.toLowerCase().includes(lower)
      )
    }
    return result
  }, [displayExams, searchText, selectedCategory])

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filteredExams.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedExams = filteredExams.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  /* Reset page when search/filter changes */
  useEffect(() => {
    setCurrentPage(1)
  }, [searchText, selectedCategory])

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
  }

  const handleEdit = (exam: DisplayExam) => {
    setEditingExam({
      id: exam.id,
      title: exam.title,
      description: exam.description,
      category: exam.category,
    })
    setShowCreateForm(true)
  }

  const handleView = (exam: DisplayExam) => {
    setViewingExam(exam)
  }

  const handleDelete = (examId: string) => {
    setDeletedIds((prev) => new Set(prev).add(examId))
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    )
  }

  /* Show exam detail view */
  if (viewingExam) {
    return (
      <ExamDetailView
        exam={viewingExam}
        onBack={() => setViewingExam(null)}
      />
    )
  }

  /* Show create/edit form */
  if (showCreateForm) {
    return (
      <CreateExamForm
        onCancel={() => {
          setShowCreateForm(false)
          setEditingExam(null)
        }}
        initialData={editingExam ?? undefined}
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[16] }}>
      {error && !useMock && <Alert severity="error">{error}</Alert>}

      {/* ═══ Header: Title + Subtitle + Button (Figma 46:14577) ═══ */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: space[12],
          minHeight: 60,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: space[4] }}>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              lineHeight: '32px',
              color: '#101828',
              letterSpacing: '0.07px',
            }}
          >
            จัดการแบบทดสอบ
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 16,
              lineHeight: '24px',
              color: '#4A5565',
              letterSpacing: '-0.31px',
            }}
          >
            สร้างและจัดการเทมเพลตแบบทดสอบสำหรับ Onboarding
          </Typography>
        </Box>

        <Box
          onClick={() => { setEditingExam(null); setShowCreateForm(true) }}
          sx={{
            bgcolor: '#F62B25',
            height: 40,
            borderRadius: '10px',
            boxShadow: '0px 4px 6px rgba(0,0,0,0.1), 0px 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: space[8],
            px: space[16],
            cursor: 'pointer',
            flexShrink: 0,
            '&:hover': { bgcolor: '#E02520' },
            transition: 'background-color 0.15s',
          }}
        >
          <AddIcon sx={{ fontSize: 20, color: '#FFFFFF' }} />
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: '24px',
              color: '#FFFFFF',
              textAlign: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            สร้างแบบทดสอบใหม่
          </Typography>
        </Box>
      </Box>

      {/* ═══ Stats Cards Grid (Figma 46:14589) ═══ */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          '@media (min-width: 350px)': { gridTemplateColumns: '1fr 1fr' },
          '@media (min-width: 900px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
          gap: space[16],
        }}
      >
        <StatsCard
          icon={<ExamIcon sx={{ fontSize: 24, color: '#2563EB' }} />}
          iconBgColor="#DBEAFE"
          label="แบบทดสอบทั้งหมด"
          value={useMock ? 6 : stats.total}
        />
        <StatsCard
          icon={<ActiveIcon sx={{ fontSize: 24, color: '#16A34A' }} />}
          iconBgColor="#DCFCE7"
          label="เปิดใช้งาน"
          value={useMock ? 6 : stats.active}
        />
        <StatsCard
          icon={<InactiveIcon sx={{ fontSize: 24, color: '#E7000B' }} />}
          iconBgColor="#FFE2E2"
          label="ปิดใช้งาน"
          value={useMock ? 0 : stats.inactive}
        />
        <StatsCard
          icon={<CategoryIcon sx={{ fontSize: 24, color: '#9333EA' }} />}
          iconBgColor="#F3E8FF"
          label="หมวดหมู่"
          value={useMock ? 11 : stats.categories}
        />
      </Box>

      {/* ═══ Search + Filter (Figma 46:14642) ═══ */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          border: '2px solid #E5E7EB',
          borderRadius: '10px',
          pt: '18px',
          px: '18px',
          pb: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: space[12],
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: '28px',
            color: '#6B7280',
            letterSpacing: '-0.44px',
          }}
        >
          ค้นหารายการ
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            width: '100%',
            gap: space[16],
          }}
        >
          {/* Search input (Figma 46:14644) */}
          <Box sx={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <SearchIcon
              sx={{
                position: 'absolute',
                left: space[12],
                top: 12,
                fontSize: 20,
                color: 'rgba(10,10,10,0.5)',
                zIndex: 1,
                pointerEvents: 'none',
              }}
            />
            <TextField
              placeholder="ค้นหาแบบทดสอบ..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                width: '100%',
                '& .MuiOutlinedInput-root': {
                  height: 44,
                  borderRadius: '10px',
                  fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                  fontSize: 16,
                  letterSpacing: '-0.31px',
                  pl: '40px',
                  '& fieldset': {
                    borderWidth: '2px',
                    borderColor: '#D1D5DC',
                  },
                  '&:hover fieldset': {
                    borderColor: '#D1D5DC',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#F62B25',
                  },
                },
                '& .MuiOutlinedInput-input': {
                  padding: '8px 16px 8px 0',
                  '&::placeholder': {
                    color: 'rgba(10,10,10,0.5)',
                    opacity: 1,
                  },
                },
              }}
            />
          </Box>

          {/* Filter icon + Dropdown (Figma 46:14650) */}
          <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center', flexShrink: 0, width: { xs: '100%', sm: 'auto' } }}>
            <FilterIcon sx={{ fontSize: 20, color: '#6B7280', flexShrink: 0 }} />
            <Select
              value={selectedCategory}
              onChange={handleCategoryChange}
              size="small"
              sx={{
                height: 41,
                borderRadius: '10px',
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontSize: 16,
                letterSpacing: '-0.31px',
                minWidth: 200,
                width: { xs: '100%', sm: 'auto' },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '2px',
                  borderColor: '#D1D5DC',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DC',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#F62B25',
                },
              }}
            >
              {CATEGORIES.map((cat) => (
                <MenuItem
                  key={cat}
                  value={cat}
                  sx={{
                    fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                    fontSize: 16,
                    letterSpacing: '-0.31px',
                    color: '#0A0A0A',
                  }}
                >
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>
      </Box>

      {/* ═══ Exam Cards List (Figma 46:14678) ═══ */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: space[16],
        }}
      >
        {paginatedExams.map((exam) => (
          <ExamCard
            key={exam.id}
            {...exam}
            onView={() => handleView(exam)}
            onEdit={() => handleEdit(exam)}
            onDelete={() => handleDelete(exam.id)}
          />
        ))}
      </Box>

      {/* ═══ Pagination ═══ */}
      {filteredExams.length > ITEMS_PER_PAGE && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'center' },
            justifyContent: 'space-between',
            gap: space[8],
            pt: space[8],
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: '#6B7280',
              letterSpacing: '-0.15px',
            }}
          >
            แสดง {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–
            {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredExams.length)} จาก{' '}
            {filteredExams.length} รายการ
          </Typography>

          <Box sx={{ display: 'flex', gap: space[4], alignItems: 'center' }}>
            <PaginationButton
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeftIcon sx={{ fontSize: 18 }} />
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationButton
                key={page}
                active={page === safeCurrentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationButton>
            ))}
            <PaginationButton
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRightIcon sx={{ fontSize: 18 }} />
            </PaginationButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}
