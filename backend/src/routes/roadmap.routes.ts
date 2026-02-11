import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()

// GET /api/roadmap
router.get('/', authenticate, async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM roadmap_milestones ORDER BY sort_order ASC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// POST /api/roadmap
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, target_day, sort_order } = req.body
    const { rows } = await pool.query(
      `INSERT INTO roadmap_milestones (title, description, target_day, sort_order)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description || null, target_day, sort_order ?? 0]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/roadmap/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, target_day, sort_order } = req.body
    const { rows } = await pool.query(
      `UPDATE roadmap_milestones SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        target_day = COALESCE($4, target_day),
        sort_order = COALESCE($5, sort_order)
      WHERE id = $1 RETURNING *`,
      [req.params.id, title, description, target_day, sort_order]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Milestone not found' })
      return
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// DELETE /api/roadmap/:id
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM roadmap_milestones WHERE id = $1', [req.params.id])
    if (rowCount === 0) {
      res.status(404).json({ error: 'Milestone not found' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
