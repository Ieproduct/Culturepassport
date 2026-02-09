import { useState, useMemo } from 'react'
import { Box, TextField } from '@mui/material'
import { DataGrid, type GridColDef, type GridRowsProp } from '@mui/x-data-grid'

type DataTableProps = {
  columns: GridColDef[]
  rows: GridRowsProp
  loading: boolean
  searchPlaceholder?: string
  onRowClick?: (params: { row: Record<string, unknown> }) => void
  pageSize?: number
}

export function DataTable({
  columns,
  rows,
  loading,
  searchPlaceholder = 'ค้นหา...',
  onRowClick,
  pageSize = 25,
}: DataTableProps) {
  const [searchText, setSearchText] = useState('')

  const filteredRows = useMemo(() => {
    if (!searchText) return rows
    const lower = searchText.toLowerCase()
    return rows.filter((row) =>
      Object.values(row).some((val) =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(lower)
      )
    )
  }, [rows, searchText])

  return (
    <Box>
      <TextField
        fullWidth
        placeholder={searchPlaceholder}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        size="small"
        sx={{ mb: 2 }}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize, page: 0 } },
        }}
        onRowClick={onRowClick}
        disableRowSelectionOnClick
        autoHeight
        sx={{
          '& .MuiDataGrid-cell:focus': { outline: 'none' },
          '& .MuiDataGrid-row:hover': { cursor: onRowClick ? 'pointer' : 'default' },
        }}
      />
    </Box>
  )
}
