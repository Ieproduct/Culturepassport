import { Router } from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth.js'
import { uploadFile, getPublicUrl, getSignedUrl } from '../services/storage.service.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

// POST /api/storage/upload
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file provided' })
      return
    }

    const bucketName = req.body.bucket || 'mission-deliverables'
    const filePath = req.body.path || `${req.user!.sub}/${Date.now()}-${req.file.originalname}`

    const path = await uploadFile(bucketName, filePath, req.file.buffer, req.file.mimetype)
    res.json({ path })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// GET /api/storage/public-url
router.get('/public-url', authenticate, (req, res) => {
  const bucket = req.query.bucket as string
  const path = req.query.path as string
  if (!bucket || !path) {
    res.status(400).json({ error: 'bucket and path are required' })
    return
  }
  res.json({ url: getPublicUrl(bucket, path) })
})

// GET /api/storage/signed-url
router.get('/signed-url', authenticate, async (req, res) => {
  try {
    const bucket = req.query.bucket as string
    const path = req.query.path as string
    const expiresIn = parseInt(req.query.expires_in as string || '3600', 10)
    if (!bucket || !path) {
      res.status(400).json({ error: 'bucket and path are required' })
      return
    }
    const url = await getSignedUrl(bucket, path, expiresIn)
    res.json({ url })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
