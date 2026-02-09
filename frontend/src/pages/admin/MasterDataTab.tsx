import { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Alert, Typography, Card, CardContent, IconButton, Stack, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import { Add, Delete, Edit, ExpandMore } from '@mui/icons-material'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useMasterData } from '@/hooks/useMasterData'

type EntityType = 'company' | 'department' | 'position' | 'category'

export function MasterDataTab() {
  const md = useMasterData()

  const [entityType, setEntityType] = useState<EntityType | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteType, setDeleteType] = useState<EntityType | null>(null)

  // Form fields
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [parentId, setParentId] = useState('')
  const [level, setLevel] = useState<number | ''>('')
  const [description, setDescription] = useState('')
  const [colorCode, setColorCode] = useState('')

  const resetForm = () => {
    setName('')
    setCode('')
    setParentId('')
    setLevel('')
    setDescription('')
    setColorCode('')
    setEditId(null)
    setEntityType(null)
  }

  const handleSave = async () => {
    if (!name.trim() || !entityType) return
    try {
      if (entityType === 'company') {
        if (editId) await md.updateCompany(editId, { name: name.trim(), code: code.trim() })
        else await md.createCompany(name.trim(), code.trim())
      } else if (entityType === 'department') {
        if (editId) await md.updateDepartment(editId, { name: name.trim() })
        else await md.createDepartment(name.trim(), parentId)
      } else if (entityType === 'position') {
        if (editId) await md.updatePosition(editId, { name: name.trim(), level: level !== '' ? Number(level) : null })
        else await md.createPosition(name.trim(), parentId, level !== '' ? Number(level) : undefined)
      } else if (entityType === 'category') {
        if (editId) await md.updateCategory(editId, { name: name.trim(), description: description.trim() || null, color_code: colorCode.trim() || null })
        else await md.createCategory(name.trim(), description.trim() || undefined, colorCode.trim() || undefined)
      }
      resetForm()
    } catch {
      // error is set in hook
    }
  }

  const handleDelete = async () => {
    if (!deleteId || !deleteType) return
    try {
      if (deleteType === 'company') await md.deleteCompany(deleteId)
      else if (deleteType === 'department') await md.deleteDepartment(deleteId)
      else if (deleteType === 'position') await md.deletePosition(deleteId)
      else if (deleteType === 'category') await md.deleteCategory(deleteId)
    } catch {
      // error is set in hook
    }
    setDeleteId(null)
    setDeleteType(null)
  }

  return (
    <Box>
      {md.error && <Alert severity="error" sx={{ mb: 2 }}>{md.error}</Alert>}

      {/* Companies */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight={600}>บริษัท ({md.companies.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button size="small" startIcon={<Add />} onClick={() => { resetForm(); setEntityType('company') }} sx={{ mb: 1 }}>เพิ่มบริษัท</Button>
          <Stack spacing={1}>
            {md.companies.map((c) => (
              <Card key={c.id} variant="outlined">
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '8px !important' }}>
                  <Typography flex={1}>{c.name} ({c.code})</Typography>
                  <IconButton size="small" onClick={() => { setEntityType('company'); setEditId(c.id); setName(c.name); setCode(c.code) }}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => { setDeleteId(c.id); setDeleteType('company') }}><Delete fontSize="small" /></IconButton>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Departments */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight={600}>แผนก ({md.departments.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button size="small" startIcon={<Add />} onClick={() => { resetForm(); setEntityType('department') }} sx={{ mb: 1 }}>เพิ่มแผนก</Button>
          <Stack spacing={1}>
            {md.departments.map((d) => {
              const company = md.companies.find((c) => c.id === d.company_id)
              return (
                <Card key={d.id} variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '8px !important' }}>
                    <Typography flex={1}>{d.name} {company ? `(${company.name})` : ''}</Typography>
                    <IconButton size="small" onClick={() => { setEntityType('department'); setEditId(d.id); setName(d.name); setParentId(d.company_id) }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => { setDeleteId(d.id); setDeleteType('department') }}><Delete fontSize="small" /></IconButton>
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Positions */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight={600}>ตำแหน่ง ({md.positions.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button size="small" startIcon={<Add />} onClick={() => { resetForm(); setEntityType('position') }} sx={{ mb: 1 }}>เพิ่มตำแหน่ง</Button>
          <Stack spacing={1}>
            {md.positions.map((p) => {
              const dept = md.departments.find((d) => d.id === p.department_id)
              return (
                <Card key={p.id} variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '8px !important' }}>
                    <Typography flex={1}>{p.name} {p.level != null ? `(Level ${p.level})` : ''} {dept ? `— ${dept.name}` : ''}</Typography>
                    <IconButton size="small" onClick={() => { setEntityType('position'); setEditId(p.id); setName(p.name); setParentId(p.department_id); setLevel(p.level ?? '') }}><Edit fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => { setDeleteId(p.id); setDeleteType('position') }}><Delete fontSize="small" /></IconButton>
                  </CardContent>
                </Card>
              )
            })}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Categories */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography fontWeight={600}>หมวดหมู่ ({md.categories.length})</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button size="small" startIcon={<Add />} onClick={() => { resetForm(); setEntityType('category') }} sx={{ mb: 1 }}>เพิ่มหมวดหมู่</Button>
          <Stack spacing={1}>
            {md.categories.map((cat) => (
              <Card key={cat.id} variant="outlined">
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '8px !important' }}>
                  {cat.color_code && <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: cat.color_code }} />}
                  <Typography flex={1}>{cat.name}{cat.description ? ` — ${cat.description}` : ''}</Typography>
                  <IconButton size="small" onClick={() => { setEntityType('category'); setEditId(cat.id); setName(cat.name); setDescription(cat.description ?? ''); setColorCode(cat.color_code ?? '') }}><Edit fontSize="small" /></IconButton>
                  <IconButton size="small" onClick={() => { setDeleteId(cat.id); setDeleteType('category') }}><Delete fontSize="small" /></IconButton>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Add/Edit Dialog */}
      <Dialog open={!!entityType} onClose={resetForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editId ? 'แก้ไข' : 'เพิ่ม'}
          {entityType === 'company' ? 'บริษัท' : entityType === 'department' ? 'แผนก' : entityType === 'position' ? 'ตำแหน่ง' : 'หมวดหมู่'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="ชื่อ" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />

          {entityType === 'company' && (
            <TextField label="รหัสบริษัท" value={code} onChange={(e) => setCode(e.target.value)} required fullWidth />
          )}

          {entityType === 'department' && !editId && (
            <FormControl fullWidth required>
              <InputLabel>บริษัท</InputLabel>
              <Select value={parentId} label="บริษัท" onChange={(e) => setParentId(e.target.value)}>
                {md.companies.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
          )}

          {entityType === 'position' && (
            <>
              {!editId && (
                <FormControl fullWidth required>
                  <InputLabel>แผนก</InputLabel>
                  <Select value={parentId} label="แผนก" onChange={(e) => setParentId(e.target.value)}>
                    {md.departments.map((d) => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                  </Select>
                </FormControl>
              )}
              <TextField label="Level" type="number" value={level} onChange={(e) => setLevel(e.target.value === '' ? '' : Number(e.target.value))} fullWidth />
            </>
          )}

          {entityType === 'category' && (
            <>
              <TextField label="คำอธิบาย" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} fullWidth />
              <TextField label="รหัสสี (เช่น #FF0000)" value={colorCode} onChange={(e) => setColorCode(e.target.value)} fullWidth />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSave}>บันทึก</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="ยืนยันการลบ"
        message="คุณต้องการลบรายการนี้หรือไม่?"
        onConfirm={handleDelete}
        onCancel={() => { setDeleteId(null); setDeleteType(null) }}
      />
    </Box>
  )
}
