import { useState, useMemo, useEffect } from 'react'
import { Box, Typography, TextField, CircularProgress, Alert } from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as EyeIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { space } from '@/theme/spacing'
import { useMissions } from '@/hooks/useMissions'
import { supabase } from '@/lib/supabase'

const ITEMS_PER_PAGE = 10

/* ─── Category color map (Figma 45:14119–45:14174) ─── */
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'วัฒนธรรมองค์กร': { bg: '#DBEAFE', border: '#BEDBFF', text: '#1447E6' },
  'ความปลอดภัยและนโยบาย': { bg: '#FFE2E2', border: '#FFC9C9', text: '#C10007' },
  'เทคนิคการทำงาน': { bg: '#DCFCE7', border: '#B9F8CF', text: '#008236' },
  'ทีมและการสื่อสาร': { bg: '#F3E8FF', border: '#E9D4FF', text: '#8200DB' },
}
const DEFAULT_CATEGORY_COLOR = { bg: '#F3F4F6', border: '#E5E7EB', text: '#364153' }

/* ─── Mock data matching Figma 45:14107–45:14214 exactly ─── */
const MOCK_MISSIONS = [
  {
    id: 'mock-1',
    title: 'อ่านคู่มือพนักงานใหม่',
    description: 'อ่านและทำความเข้าใจคู่มือพนักงานใหม่ทั้งหมด รวมถึงนโยบายและระเบียบข้อบังคับของบริษัท',
    categoryName: 'วัฒนธรรมองค์กร',
    maxScore: 100,
    assignedCount: 0,
  },
  {
    id: 'mock-2',
    title: 'ทำแบบทดสอบความปลอดภัย',
    description: 'ทำแบบทดสอบเกี่ยวกับความปลอดภัยในที่ทำงานและนโยบายความมั่นคงปลอดภัยทางไซเบอร์',
    categoryName: 'ความปลอดภัยและนโยบาย',
    maxScore: 100,
    assignedCount: 0,
  },
  {
    id: 'mock-3',
    title: 'ตั้งค่าอุปกรณ์และบัญชีผู้ใช้',
    description: 'ตั้งค่าคอมพิวเตอร์ บัญชีอีเมล และเครื่องมือการทำงานต่างๆ ที่จำเป็น',
    categoryName: 'เทคนิคการทำงาน',
    maxScore: 100,
    assignedCount: 3,
  },
  {
    id: 'mock-4',
    title: 'พบปะทีมงาน',
    description: 'แนะนำตัวและพบปะกับสมาชิกในทีม เข้าร่วมการประชุมทีมครั้งแรก',
    categoryName: 'ทีมและการสื่อสาร',
    maxScore: 100,
    assignedCount: 21,
  },
  {
    id: 'mock-5',
    title: 'เรียนรู้ระบบและเครื่องมือ',
    description: 'ศึกษาระบบและเครื่องมือที่ใช้ในการทำงาน เช่น Git, Jira, Slack',
    categoryName: 'เทคนิคการทำงาน',
    maxScore: 100,
    assignedCount: 21,
  },
  {
    id: 'mock-6',
    title: 'ทำข้อสอบอบรมข้อเขียน',
    description: 'ทำแบบทดสอบข้อเขียนเพื่อประเมินความเข้าใจและการประยุกต์ใช้ความรู้',
    categoryName: 'วัฒนธรรมองค์กร',
    maxScore: 100,
    assignedCount: 21,
  },
  {
    id: 'mock-7',
    title: 'เข้าร่วมปฐมนิเทศ',
    description: 'เข้าร่วมกิจกรรมปฐมนิเทศพนักงานใหม่ รับฟังนโยบายบริษัทและแนะนำทีมผู้บริหาร',
    categoryName: 'วัฒนธรรมองค์กร',
    maxScore: 100,
    assignedCount: 18,
  },
  {
    id: 'mock-8',
    title: 'ศึกษาแผนผังองค์กร',
    description: 'ทำความเข้าใจโครงสร้างองค์กร แผนกต่างๆ และสายการบังคับบัญชา',
    categoryName: 'ทีมและการสื่อสาร',
    maxScore: 100,
    assignedCount: 15,
  },
  {
    id: 'mock-9',
    title: 'ทดสอบระบบดับเพลิง',
    description: 'เข้าร่วมการฝึกซ้อมดับเพลิงและอพยพหนีไฟประจำปี พร้อมทำแบบทดสอบหลังการฝึก',
    categoryName: 'ความปลอดภัยและนโยบาย',
    maxScore: 100,
    assignedCount: 21,
  },
  {
    id: 'mock-10',
    title: 'ตั้งค่า VPN และระบบรักษาความปลอดภัย',
    description: 'ติดตั้งและตั้งค่า VPN, Antivirus และระบบ 2FA สำหรับการเข้าถึงข้อมูลบริษัท',
    categoryName: 'เทคนิคการทำงาน',
    maxScore: 100,
    assignedCount: 12,
  },
  {
    id: 'mock-11',
    title: 'นำเสนองานต่อทีม',
    description: 'เตรียมและนำเสนอแผนงาน 30 วันแรกให้ทีมและหัวหน้างานรับทราบ',
    categoryName: 'ทีมและการสื่อสาร',
    maxScore: 100,
    assignedCount: 10,
  },
  {
    id: 'mock-12',
    title: 'เรียนรู้กฎหมายแรงงาน',
    description: 'ศึกษาสิทธิและหน้าที่ตามกฎหมายแรงงาน รวมถึงสวัสดิการที่พนักงานได้รับ',
    categoryName: 'ความปลอดภัยและนโยบาย',
    maxScore: 100,
    assignedCount: 8,
  },
  {
    id: 'mock-13',
    title: 'เข้าร่วม Team Building',
    description: 'เข้าร่วมกิจกรรม Team Building เพื่อสร้างความสัมพันธ์กับเพื่อนร่วมงาน',
    categoryName: 'ทีมและการสื่อสาร',
    maxScore: 100,
    assignedCount: 21,
  },
  {
    id: 'mock-14',
    title: 'ทำแบบประเมินตนเอง',
    description: 'ทำแบบประเมินทักษะและความสามารถของตนเองเพื่อวางแผนพัฒนาการทำงาน',
    categoryName: 'วัฒนธรรมองค์กร',
    maxScore: 100,
    assignedCount: 5,
  },
  {
    id: 'mock-15',
    title: 'ศึกษาระบบ HR Self-Service',
    description: 'เรียนรู้การใช้งานระบบ HR เพื่อลาหยุด เบิกค่าใช้จ่าย และดูสลิปเงินเดือน',
    categoryName: 'เทคนิคการทำงาน',
    maxScore: 100,
    assignedCount: 19,
  },
  {
    id: 'mock-16',
    title: 'อบรมจริยธรรมทางธุรกิจ',
    description: 'เข้าอบรมเรื่องจริยธรรมทางธุรกิจ การป้องกันการทุจริต และนโยบาย Anti-Corruption',
    categoryName: 'ความปลอดภัยและนโยบาย',
    maxScore: 100,
    assignedCount: 21,
  },
  {
    id: 'mock-17',
    title: 'เข้าพบ Mentor ประจำตัว',
    description: 'พบปะ Mentor ที่ได้รับมอบหมาย วางแผนการพัฒนาและเป้าหมายสำหรับ 90 วันแรก',
    categoryName: 'ทีมและการสื่อสาร',
    maxScore: 100,
    assignedCount: 14,
  },
  {
    id: 'mock-18',
    title: 'ทำแบบทดสอบ IT Security',
    description: 'ทำแบบทดสอบความรู้ด้าน IT Security เช่น Phishing, Password Policy, Data Protection',
    categoryName: 'ความปลอดภัยและนโยบาย',
    maxScore: 100,
    assignedCount: 21,
  },
]

/* ─── Badge component (Figma 45:14119) ─── */
function Badge({ bg, border, text, children }: { bg: string; border: string; text: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        bgcolor: bg,
        border: `1px solid ${border}`,
        borderRadius: space[8],
        height: 26,
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
          color: text,
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </Typography>
    </Box>
  )
}

/* ─── Mission Card (Figma 45:14107) ─── */
function MissionCard({
  title,
  description,
  categoryName,
  maxScore,
  assignedCount,
}: {
  title: string
  description: string
  categoryName: string | null
  maxScore: number
  assignedCount: number
}) {
  const catColor = categoryName ? (CATEGORY_COLORS[categoryName] ?? DEFAULT_CATEGORY_COLOR) : null

  return (
    <Box
      sx={{
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        pt: '17px',
        px: '17px',
        pb: '17px',
        display: 'flex',
        flexDirection: 'column',
        gap: space[8],
      }}
    >
      {/* Row 1: Title + Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: space[8],
          flexWrap: 'wrap',
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 500,
            fontSize: 16,
            lineHeight: '24px',
            color: '#101828',
            letterSpacing: '-0.31px',
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            bgcolor: '#F62B25',
            borderRadius: space[8],
            height: 28,
            display: 'flex',
            alignItems: 'center',
            gap: space[6],
            px: space[12],
            cursor: 'pointer',
            flexShrink: 0,
            '&:hover': { bgcolor: '#E02520' },
          }}
        >
          <EyeIcon sx={{ fontSize: 14, color: '#FFFFFF' }} />
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 500,
              fontSize: 12,
              lineHeight: '16px',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            ดูรายละเอียด
          </Typography>
        </Box>
      </Box>

      {/* Row 2: Description */}
      <Typography
        sx={{
          fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
          fontWeight: 400,
          fontSize: 14,
          lineHeight: '20px',
          color: '#4A5565',
          letterSpacing: '-0.15px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {description}
      </Typography>

      {/* Row 3: Badges */}
      <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center', flexWrap: 'wrap' }}>
        {catColor && categoryName && (
          <Badge bg={catColor.bg} border={catColor.border} text={catColor.text}>
            {categoryName}
          </Badge>
        )}
        <Badge bg="#F3F4F6" border="#E5E7EB" text="#364153">
          คะแนนเต็ม: {maxScore}
        </Badge>
        <Badge bg="#F3F4F6" border="#E5E7EB" text="#6B7280">
          👥 {assignedCount} คน
        </Badge>
      </Box>
    </Box>
  )
}

/* ─── Pagination Button (Figma style) ─── */
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

export function MissionsTab() {
  const { missions, loading, error } = useMissions()
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [assignCounts, setAssignCounts] = useState<Record<string, number>>({})

  /* Use real data if available, otherwise fall back to mock */
  const useMock = missions.length === 0 && !loading

  /* Fetch assignment counts per mission */
  useEffect(() => {
    if (useMock) return
    async function loadCounts() {
      const { data } = await supabase
        .from('user_missions')
        .select('mission_id')
      if (!data) return
      const counts: Record<string, number> = {}
      data.forEach((um) => {
        counts[um.mission_id] = (counts[um.mission_id] ?? 0) + 1
      })
      setAssignCounts(counts)
    }
    loadCounts()
  }, [useMock])

  /* Build display list: mock or real */
  type DisplayMission = {
    id: string
    title: string
    description: string
    categoryName: string | null
    maxScore: number
    assignedCount: number
  }

  const displayMissions: DisplayMission[] = useMemo(() => {
    if (useMock) return MOCK_MISSIONS
    return missions.map((m) => {
      const cat = (m as Record<string, unknown>).categories as { name: string } | undefined
      return {
        id: m.id,
        title: m.title,
        description: m.description,
        categoryName: cat?.name ?? null,
        maxScore: 100,
        assignedCount: assignCounts[m.id] ?? 0,
      }
    })
  }, [useMock, missions, assignCounts])

  /* Client-side search */
  const filteredMissions = useMemo(() => {
    if (!searchText.trim()) return displayMissions
    const lower = searchText.toLowerCase()
    return displayMissions.filter((m) =>
      m.title.toLowerCase().includes(lower) ||
      m.description.toLowerCase().includes(lower)
    )
  }, [displayMissions, searchText])

  /* Pagination */
  const totalPages = Math.max(1, Math.ceil(filteredMissions.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedMissions = filteredMissions.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  /* Reset page when search changes */
  useEffect(() => {
    setCurrentPage(1)
  }, [searchText])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        bgcolor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '10px',
        pt: '25px',
        px: '25px',
        pb: '25px',
        display: 'flex',
        flexDirection: 'column',
        gap: space[16],
      }}
    >
      {error && !useMock && <Alert severity="error">{error}</Alert>}

      {/* ─── Header: Title + Search (45:14097) ─── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 42,
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: '27px',
            color: '#101828',
            letterSpacing: '-0.44px',
          }}
        >
          ภารกิจ
        </Typography>

        {/* Search input (45:14100) */}
        <Box sx={{ position: 'relative', width: 320 }}>
          <SearchIcon
            sx={{
              position: 'absolute',
              left: space[12],
              top: 13,
              fontSize: 16,
              color: 'rgba(10,10,10,0.5)',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
          <TextField
            fullWidth
            placeholder="ค้นหาภารกิจ..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 42,
                borderRadius: '10px',
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontSize: 16,
                letterSpacing: '-0.31px',
                '& .MuiOutlinedInput-input': {
                  pl: space[40],
                  py: space[8],
                  '&::placeholder': {
                    color: 'rgba(10,10,10,0.5)',
                    opacity: 1,
                  },
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DC',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DC',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#D1D5DC',
                  borderWidth: '1px',
                },
              },
            }}
          />
        </Box>
      </Box>

      {/* ─── Mission Cards List (45:14106) ─── */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: space[12],
        }}
      >
        {filteredMissions.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: space[12],
              py: space[48],
            }}
          >
            <SearchIcon sx={{ fontSize: 48, color: '#9CA3AF' }} />
            <Typography
              sx={{
                fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
                fontWeight: 500,
                fontSize: 16,
                lineHeight: '24px',
                color: '#6A7282',
                letterSpacing: '-0.31px',
              }}
            >
              ไม่พบภารกิจที่ตรงกับเงื่อนไขการค้นหา
            </Typography>
          </Box>
        ) : (
          paginatedMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              title={mission.title}
              description={mission.description}
              categoryName={mission.categoryName}
              maxScore={mission.maxScore}
              assignedCount={mission.assignedCount}
            />
          ))
        )}
      </Box>

      {/* ─── Pagination ─── */}
      {filteredMissions.length > ITEMS_PER_PAGE && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: space[8],
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Inter', 'Noto Sans Thai', sans-serif",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: '20px',
              color: '#6A7282',
              letterSpacing: '-0.15px',
            }}
          >
            แสดง {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredMissions.length)} จาก {filteredMissions.length} รายการ
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: space[4] }}>
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
