import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()

// GET /api/exams/templates
router.get('/templates', authenticate, async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM exam_templates ORDER BY created_at DESC')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// POST /api/exams/templates
router.post('/templates', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, passing_score, questions } = req.body
    const { rows } = await pool.query(
      `INSERT INTO exam_templates (title, description, passing_score, questions)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, description || null, passing_score, JSON.stringify(questions || [])]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/exams/templates/:id
router.put('/templates/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { title, description, passing_score, questions } = req.body
    const { rows } = await pool.query(
      `UPDATE exam_templates SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        passing_score = COALESCE($4, passing_score),
        questions = COALESCE($5, questions)
      WHERE id = $1 RETURNING *`,
      [req.params.id, title, description, passing_score, questions ? JSON.stringify(questions) : null]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Template not found' })
      return
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// DELETE /api/exams/templates/:id
router.delete('/templates/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM exam_templates WHERE id = $1', [req.params.id])
    if (rowCount === 0) {
      res.status(404).json({ error: 'Template not found' })
      return
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// GET /api/exams/scores
router.get('/scores', authenticate, async (req, res) => {
  try {
    const { user_id } = req.query
    const conditions: string[] = []
    const params: unknown[] = []
    let idx = 1

    if (user_id) { conditions.push(`es.user_id = $${idx++}`); params.push(user_id) }

    // Employee can only see own
    if (req.user!.role === 'employee') {
      conditions.push(`es.user_id = $${idx++}`)
      params.push(req.user!.sub)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await pool.query(
      `SELECT es.*, et.title as exam_title
       FROM exam_scores es
       LEFT JOIN exam_templates et ON et.id = es.exam_template_id
       ${where}
       ORDER BY es.taken_at DESC`,
      params
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
