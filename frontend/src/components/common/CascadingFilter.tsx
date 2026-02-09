import { Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import type { Company, Department, Position } from '@/types'

type CascadingFilterProps = {
  selectedCompany: string | null
  selectedDepartment: string | null
  selectedPosition: string | null
  onCompanyChange: (value: string | null) => void
  onDepartmentChange: (value: string | null) => void
  onPositionChange: (value: string | null) => void
  companies: Company[]
  departments: Department[]
  positions: Position[]
}

export function CascadingFilter({
  selectedCompany,
  selectedDepartment,
  selectedPosition,
  onCompanyChange,
  onDepartmentChange,
  onPositionChange,
  companies,
  departments,
  positions,
}: CascadingFilterProps) {
  const handleCompanyChange = (value: string) => {
    onCompanyChange(value || null)
    onDepartmentChange(null)
    onPositionChange(null)
  }

  const handleDepartmentChange = (value: string) => {
    onDepartmentChange(value || null)
    onPositionChange(null)
  }

  const filteredDepartments = departments.filter(
    (d) => !selectedCompany || d.company_id === selectedCompany
  )

  const filteredPositions = positions.filter(
    (p) => !selectedDepartment || p.department_id === selectedDepartment
  )

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%' }}>
      <FormControl fullWidth size="small">
        <InputLabel>บริษัท</InputLabel>
        <Select
          value={selectedCompany ?? ''}
          label="บริษัท"
          onChange={(e) => handleCompanyChange(e.target.value)}
        >
          <MenuItem value="">ทั้งหมด</MenuItem>
          {companies.map((c) => (
            <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" disabled={!selectedCompany}>
        <InputLabel>แผนก</InputLabel>
        <Select
          value={selectedDepartment ?? ''}
          label="แผนก"
          onChange={(e) => handleDepartmentChange(e.target.value)}
        >
          <MenuItem value="">ทั้งหมด</MenuItem>
          {filteredDepartments.map((d) => (
            <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth size="small" disabled={!selectedDepartment}>
        <InputLabel>ตำแหน่ง</InputLabel>
        <Select
          value={selectedPosition ?? ''}
          label="ตำแหน่ง"
          onChange={(e) => onPositionChange(e.target.value || null)}
        >
          <MenuItem value="">ทั้งหมด</MenuItem>
          {filteredPositions.map((p) => (
            <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Stack>
  )
}
