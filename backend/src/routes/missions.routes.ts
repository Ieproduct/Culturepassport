import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()

// GET /api/missions
router.get('/', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT m.*, c.name as category_name, c.color_code as category_color
       FROM missions m
       LEFT JOIN categories c ON c.id = m.category_id
       WHERE m.is_deleted = false
       ORDER BY m.created_at DESC`
    )
    // Enrich with categories object to match frontend expectations
    const enriched = rows.map((r) => ({
      ...r,
      categories: r.category_name ? { name: r.category_name, color_code: r.category_color } : null,
    }))
    res.json(enriched)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// POST /api/missions
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, category_id, estimated_duration } = req.body
    const { rows } = await pool.query(
      `INSERT INTO missions (title, description, category_id, estimated_duration)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description, category_id || null, estimated_duration || null]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/missions/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, category_id, estimated_duration } = req.body
    const { rows } = await pool.query(
      `UPDATE missions SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        category_id = COALESCE($4, category_id),
        estimated_duration = COALESCE($5, estimated_duration)
      WHERE id = $1 AND is_deleted = false
      RETURNING *`,
      [req.params.id, title, description, category_id, estimated_duration]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Mission not found' })
      return
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// DELETE /api/missions/:id (soft delete)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE missions SET is_deleted = true WHERE id = $1 RETURNING id`,
      [req.params.id]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Mission not found' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
