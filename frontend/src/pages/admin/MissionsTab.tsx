import { useState, useMemo, useEffect } from 'react'
import { Box, Typography, TextField, CircularProgress, Alert } from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as EyeIcon,
} from '@mui/icons-material'
import { space } from '@/theme/spacing'
import { useMissions } from '@/hooks/useMissions'
import { useServices } from '@/services'
import { colors } from '@/theme'

/* ─── Category color map (Figma 45:14119–45:14174) ─── */
const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'วัฒนธรรมองค์กร': { bg: '#DBEAFE', border: '#BEDBFF', text: '#1447E6' },
  'ความปลอดภัยและนโยบาย': { bg: '#FFE2E2', border: '#FFC9C9', text: '#C10007' },
  'เทคนิคการทำงาน': { bg: '#DCFCE7', border: '#B9F8CF', text: '#008236' },
  'ทีมและการสื่อสาร': { bg: '#F3E8FF', border: '#E9D4FF', text: '#8200DB' },
}
const DEFAULT_CATEGORY_COLOR = { bg: '#F3F4F6', border: '#E5E7EB', text: '#364153' }

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
        pb: '1px',
        display: 'flex',
        flexDirection: 'column',
        gap: space[8],
        height: 128,
      }}
    >
      {/* Row 1: Title + Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          height: 28,
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
          color: colors.gray[500],
          letterSpacing: '-0.15px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {description}
      </Typography>

      {/* Row 3: Badges */}
      <Box sx={{ display: 'flex', gap: space[8], alignItems: 'center', height: 26 }}>
        {catColor && categoryName && (
          <Badge bg={catColor.bg} border={catColor.border} text={catColor.text}>
            {categoryName}
          </Badge>
        )}
        <Badge bg="#F3F4F6" border="#E5E7EB" text="#364153">
          คะแนนเต็ม: {maxScore}
        </Badge>
        <Badge bg="#DCFCE7" border="#B9F8CF" text="#008236">
          👥 {assignedCount} คน
        </Badge>
      </Box>
    </Box>
  )
}

export function MissionsTab() {
  const { missions, loading, error } = useMissions()
  const { userMissions: umService } = useServices()
  const [searchText, setSearchText] = useState('')
  const [assignCounts, setAssignCounts] = useState<Record<string, number>>({})

  /* Fetch assignment counts per mission */
  useEffect(() => {
    async function loadCounts() {
      const data = await umService.fetchUserMissions()
      const counts: Record<string, number> = {}
      data.forEach((um) => {
        counts[um.mission_id] = (counts[um.mission_id] ?? 0) + 1
      })
      setAssignCounts(counts)
    }
    loadCounts()
  }, [umService])

  /* Client-side search */
  const filteredMissions = useMemo(() => {
    if (!searchText.trim()) return missions
    const lower = searchText.toLowerCase()
    return missions.filter((m) =>
      m.title.toLowerCase().includes(lower) ||
      m.description.toLowerCase().includes(lower)
    )
  }, [missions, searchText])

  /* Category name lookup from enriched missions */
  const getCategoryName = (mission: typeof missions[0]) => {
    const cat = (mission as Record<string, unknown>).categories as { name: string } | undefined
    return cat?.name || null
  }

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
        pb: '1px',
        display: 'flex',
        flexDirection: 'column',
        gap: space[16],
      }}
    >
      {error && <Alert severity="error">{error}</Alert>}

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
            color: colors.gray[500],
            letterSpacing: '-0.44px',
          }}
        >
          ภารกิจทั้งหมด
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
        {filteredMissions.length === 0 && !loading ? (
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
          filteredMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              title={mission.title}
              description={mission.description}
              categoryName={getCategoryName(mission)}
              maxScore={100}
              assignedCount={assignCounts[mission.id] ?? 0}
            />
          ))
        )}
      </Box>
    </Box>
  )
}
