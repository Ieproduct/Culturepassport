import { useState, useRef, type ChangeEvent } from 'react'
import { Box, Typography, Button, LinearProgress } from '@mui/material'
import { CloudUpload as UploadIcon } from '@mui/icons-material'
import { useServices } from '@/services'

type FileUploadProps = {
  bucketName: string
  filePath: string
  onUploadComplete: (url: string) => void
  onError: (error: string) => void
  maxSizeMB?: number
  acceptedTypes?: string[]
  isPublicBucket?: boolean
}

export function FileUpload({
  bucketName,
  filePath,
  onUploadComplete,
  onError,
  maxSizeMB = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.png'],
  isPublicBucket = false,
}: FileUploadProps) {
  const { storage: storageService } = useServices()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const maxBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxBytes) {
      onError(`ไฟล์ต้องมีขนาดไม่เกิน ${maxSizeMB} MB`)
      return
    }

    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!acceptedTypes.includes(ext)) {
      onError(`รองรับเฉพาะไฟล์ประเภท: ${acceptedTypes.join(', ')}`)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) return
    setUploading(true)
    setProgress(0)

    try {
      const ext = selectedFile.name.split('.').pop()
      const fileName = `${filePath}.${ext}`

      const { path } = await storageService.upload(bucketName, fileName, selectedFile, {
        cacheControl: '3600',
        upsert: false,
      })

      setProgress(100)
      if (isPublicBucket) {
        const publicUrl = storageService.getPublicUrl(bucketName, path)
        onUploadComplete(publicUrl)
      } else {
        // For private buckets, store the path — consumers use getSignedUrl() to create signed URLs
        onUploadComplete(path)
      }
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (err) {
      onError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <Box>
      <Box
        sx={{
          border: 2,
          borderStyle: 'dashed',
          borderColor: 'divider',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          backgroundColor: 'action.hover',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          accept={acceptedTypes.join(',')}
          style={{ display: 'none' }}
          id="file-upload-input"
        />
        <label htmlFor="file-upload-input">
          <Button variant="outlined" component="span" disabled={uploading} startIcon={<UploadIcon />}>
            เลือกไฟล์
          </Button>
        </label>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          รองรับ: {acceptedTypes.join(', ')} (สูงสุด {maxSizeMB} MB)
        </Typography>
      </Box>

      {selectedFile && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            ไฟล์ที่เลือก: {selectedFile.name}
          </Typography>
          <Button variant="contained" onClick={handleUpload} disabled={uploading} fullWidth>
            {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
          </Button>
        </Box>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      )}
    </Box>
  )
}
