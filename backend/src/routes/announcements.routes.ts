import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()

// GET /api/announcements
router.get('/', authenticate, async (req, res) => {
  try {
    let query = 'SELECT * FROM announcements'
    // Non-admin only see active
    if (req.user!.role !== 'admin') {
      query += ` WHERE is_active = true`
    }
    query += ' ORDER BY published_at DESC'
    const { rows } = await pool.query(query)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// GET /api/announcements/undismissed
router.get('/undismissed', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.* FROM announcements a
       WHERE a.is_active = true
       AND a.id NOT IN (
         SELECT announcement_id FROM announcement_dismissals WHERE user_id = $1
       )
       ORDER BY a.published_at DESC`,
      [req.user!.sub]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// POST /api/announcements
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, content, is_active } = req.body
    const { rows } = await pool.query(
      `INSERT INTO announcements (title, content, is_active) VALUES ($1, $2, $3) RETURNING *`,
      [title, content, is_active ?? true]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/announcements/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, content, is_active } = req.body
    const { rows } = await pool.query(
      `UPDATE announcements SET
        title = COALESCE($2, title),
        content = COALESCE($3, content),
        is_active = COALESCE($4, is_active)
      WHERE id = $1 RETURNING *`,
      [req.params.id, title, content, is_active]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Announcement not found' })
      return
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// DELETE /api/announcements/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM announcements WHERE id = $1', [req.params.id])
    if (rowCount === 0) {
      res.status(404).json({ error: 'Announcement not found' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// POST /api/announcements/:id/dismiss
router.post('/:id/dismiss', authenticate, async (req, res) => {
  try {
    await pool.query(
      `INSERT INTO announcement_dismissals (announcement_id, user_id) VALUES ($1, $2)
       ON CONFLICT (announcement_id, user_id) DO NOTHING`,
      [req.params.id, req.user!.sub]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
