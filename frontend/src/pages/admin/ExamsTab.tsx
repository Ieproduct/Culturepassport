import { useState } from 'react'
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, Typography, IconButton, Stack, FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Card, CardContent, Chip } from '@mui/material'
import { Add, Delete } from '@mui/icons-material'
import type { GridColDef } from '@mui/x-data-grid'
import { DataTable } from '@/components/common/DataTable'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { useExams } from '@/hooks/useExams'
import type { ExamQuestion, ExamTemplate } from '@/types'

type NewQuestion = Omit<ExamQuestion, 'id'> & { id?: string }

export function ExamsTab() {
  const { examTemplates, loading, error, createExamTemplate, updateExamTemplate, deleteExamTemplate } = useExams()

  const [open, setOpen] = useState(false)
  const [editExam, setEditExam] = useState<ExamTemplate | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [passingScore, setPassingScore] = useState(60)
  const [questions, setQuestions] = useState<NewQuestion[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formError, setFormError] = useState('')

  // New question form
  const [qOpen, setQOpen] = useState(false)
  const [qText, setQText] = useState('')
  const [qType, setQType] = useState<ExamQuestion['type']>('multiple_choice')
  const [qOptions, setQOptions] = useState(['', '', '', ''])
  const [qCorrect, setQCorrect] = useState('')

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'ชื่อข้อสอบ', flex: 1, minWidth: 200 },
    {
      field: 'questions',
      headerName: 'จำนวนข้อ',
      width: 120,
      valueGetter: (_value: unknown, row: Record<string, unknown>) => {
        const q = row.questions as ExamQuestion[] | undefined
        return q?.length ?? 0
      },
    },
    { field: 'passing_score', headerName: 'คะแนนผ่าน (%)', width: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button size="small" onClick={() => handleEdit(params.row as ExamTemplate)}>แก้ไข</Button>
          <Button size="small" color="error" onClick={() => setDeleteId(params.row.id as string)}>ลบ</Button>
        </Box>
      ),
    },
  ]

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setPassingScore(60)
    setQuestions([])
    setEditExam(null)
    setFormError('')
  }

  const handleOpen = () => {
    resetForm()
    setOpen(true)
  }

  const handleEdit = (exam: ExamTemplate) => {
    setEditExam(exam)
    setTitle(exam.title)
    setDescription(exam.description ?? '')
    setPassingScore(exam.passing_score)
    setQuestions(exam.questions ?? [])
    setOpen(true)
  }

  const resetQuestionForm = () => {
    setQText('')
    setQType('multiple_choice')
    setQOptions(['', '', '', ''])
    setQCorrect('')
  }

  const handleAddQuestion = () => {
    if (!qText.trim()) return
    if (qType === 'multiple_choice' && qOptions.some((o) => !o.trim())) return
    if (!qCorrect.trim()) return

    const newQ: NewQuestion = {
      id: crypto.randomUUID(),
      text: qText.trim(),
      type: qType,
      options: qType === 'multiple_choice' ? qOptions.map((o) => o.trim()) : qType === 'true_false' ? ['จริง', 'เท็จ'] : [],
      correct_answer: qCorrect.trim(),
    }
    setQuestions((prev) => [...prev, newQ])
    setQOpen(false)
    resetQuestionForm()
  }

  const handleSave = async () => {
    if (!title.trim()) { setFormError('กรุณากรอกชื่อข้อสอบ'); return }
    if (questions.length === 0) { setFormError('กรุณาเพิ่มอย่างน้อย 1 คำถาม'); return }

    const data = {
      title: title.trim(),
      description: description.trim() || null,
      passing_score: passingScore,
      questions: questions as ExamQuestion[],
    }

    if (editExam) {
      await updateExamTemplate(editExam.id, data)
    } else {
      await createExamTemplate(data)
    }
    setOpen(false)
    resetForm()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteExamTemplate(deleteId)
    setDeleteId(null)
  }

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={handleOpen}>
          สร้างข้อสอบใหม่
        </Button>
      </Box>

      <DataTable columns={columns} rows={examTemplates} loading={loading} searchPlaceholder="ค้นหาข้อสอบ..." />

      {/* Create / Edit Exam Dialog */}
      <Dialog open={open} onClose={() => { setOpen(false); resetForm() }} maxWidth="md" fullWidth>
        <DialogTitle>{editExam ? 'แก้ไขข้อสอบ' : 'สร้างข้อสอบใหม่'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField label="ชื่อข้อสอบ" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth />
          <TextField label="คำอธิบาย" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={2} fullWidth />
          <TextField label="คะแนนผ่าน (%)" type="number" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} inputProps={{ min: 0, max: 100 }} fullWidth />

          {/* Questions List */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="subtitle1" fontWeight={600}>คำถาม ({questions.length} ข้อ)</Typography>
              <Button size="small" startIcon={<Add />} onClick={() => { resetQuestionForm(); setQOpen(true) }}>เพิ่มคำถาม</Button>
            </Box>
            <Stack spacing={1}>
              {questions.map((q, idx) => (
                <Card key={q.id ?? idx} variant="outlined">
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: '8px !important' }}>
                    <Typography variant="body2" flex={1}>{idx + 1}. {q.text}</Typography>
                    <Chip label={q.type === 'multiple_choice' ? 'ตัวเลือก' : q.type === 'true_false' ? 'จริง/เท็จ' : 'ตอบสั้น'} size="small" />
                    <IconButton size="small" onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== idx))}><Delete fontSize="small" /></IconButton>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpen(false); resetForm() }}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleSave}>บันทึก</Button>
        </DialogActions>
      </Dialog>

      {/* Add Question Dialog */}
      <Dialog open={qOpen} onClose={() => setQOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>เพิ่มคำถาม</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="คำถาม" value={qText} onChange={(e) => setQText(e.target.value)} required multiline rows={2} fullWidth />
          <FormControl fullWidth>
            <InputLabel>ประเภท</InputLabel>
            <Select value={qType} label="ประเภท" onChange={(e) => setQType(e.target.value as ExamQuestion['type'])}>
              <MenuItem value="multiple_choice">ตัวเลือก (Multiple Choice)</MenuItem>
              <MenuItem value="true_false">จริง/เท็จ (True/False)</MenuItem>
              <MenuItem value="short_answer">ตอบสั้น (Short Answer)</MenuItem>
            </Select>
          </FormControl>

          {qType === 'multiple_choice' && (
            <Stack spacing={1}>
              {qOptions.map((opt, idx) => (
                <TextField
                  key={idx}
                  label={`ตัวเลือก ${idx + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...qOptions]
                    newOpts[idx] = e.target.value
                    setQOptions(newOpts)
                  }}
                  fullWidth
                />
              ))}
              <FormControl fullWidth>
                <InputLabel>คำตอบที่ถูกต้อง</InputLabel>
                <Select value={qCorrect} label="คำตอบที่ถูกต้อง" onChange={(e) => setQCorrect(e.target.value)}>
                  {qOptions.filter((o) => o.trim()).map((opt, idx) => (
                    <MenuItem key={idx} value={opt}>{opt}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          )}

          {qType === 'true_false' && (
            <RadioGroup value={qCorrect} onChange={(e) => setQCorrect(e.target.value)}>
              <FormControlLabel value="จริง" control={<Radio />} label="จริง" />
              <FormControlLabel value="เท็จ" control={<Radio />} label="เท็จ" />
            </RadioGroup>
          )}

          {qType === 'short_answer' && (
            <TextField label="คำตอบที่ถูกต้อง" value={qCorrect} onChange={(e) => setQCorrect(e.target.value)} fullWidth />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQOpen(false)}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleAddQuestion}>เพิ่ม</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        title="ยืนยันการลบข้อสอบ"
        message="คุณต้องการลบข้อสอบนี้หรือไม่?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  )
}
