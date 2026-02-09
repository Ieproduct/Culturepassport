import { Chip } from '@mui/material'
import type { MissionStatus } from '@/types'

type StatusBadgeProps = {
  status: MissionStatus
}

const statusConfig: Record<MissionStatus, { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' }> = {
  not_started: { label: 'ยังไม่เริ่ม', color: 'default' },
  in_progress: { label: 'กำลังทำ', color: 'primary' },
  submitted: { label: 'รอ Review', color: 'warning' },
  approved: { label: 'อนุมัติ', color: 'success' },
  rejected: { label: 'ส่งกลับ', color: 'error' },
  cancelled: { label: 'ยกเลิก', color: 'default' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return <Chip label={config.label} color={config.color} size="small" />
}
