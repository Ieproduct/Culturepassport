import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()

// GET /api/user-missions
router.get('/', authenticate, async (req, res) => {
  try {
    const { user_id, status, mission_id } = req.query
    const conditions: string[] = []
    const params: unknown[] = []
    let idx = 1

    if (user_id) { conditions.push(`um.user_id = $${idx++}`); params.push(user_id) }
    if (status) { conditions.push(`um.status = $${idx++}`); params.push(status) }
    if (mission_id) { conditions.push(`um.mission_id = $${idx++}`); params.push(mission_id) }

    // Employee can only see own
    if (req.user!.role === 'employee') {
      conditions.push(`um.user_id = $${idx++}`)
      params.push(req.user!.sub)
    }
    // Manager can see department
    if (req.user!.role === 'manager') {
      const mgrResult = await pool.query('SELECT department_id FROM profiles WHERE id = $1', [req.user!.sub])
      const deptId = mgrResult.rows[0]?.department_id
      if (deptId) {
        conditions.push(`um.user_id IN (SELECT id FROM profiles WHERE department_id = $${idx++})`)
        params.push(deptId)
      }
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await pool.query(
      `SELECT um.*, m.title as mission_title, m.description as mission_description, p.full_name as user_name
       FROM user_missions um
       LEFT JOIN missions m ON m.id = um.mission_id
       LEFT JOIN profiles p ON p.id = um.user_id
       ${where}
       ORDER BY um.created_at DESC`,
      params
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// POST /api/user-missions/assign
router.post('/assign', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { mission_id, user_ids } = req.body
    if (!mission_id || !Array.isArray(user_ids) || user_ids.length === 0) {
      res.status(400).json({ error: 'mission_id and user_ids[] are required' })
      return
    }

    const values = user_ids.map((_: string, i: number) => `($1, $${i + 2})`).join(', ')
    const params = [mission_id, ...user_ids]

    const { rows } = await pool.query(
      `INSERT INTO user_missions (mission_id, user_id) VALUES ${values}
       ON CONFLICT (mission_id, user_id) DO NOTHING
       RETURNING *`,
      params
    )
    res.status(201).json(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/user-missions/:id/start
router.put('/:id/start', authenticate, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE user_missions SET status = 'in_progress', started_at = now()
       WHERE id = $1 AND status = 'not_started'
       RETURNING *`,
      [req.params.id]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Mission not found or already started' })
      return
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/user-missions/:id/submit
router.put('/:id/submit', authenticate, async (req, res) => {
  try {
    const { submitted_content, submitted_file_url } = req.body
    const { rows } = await pool.query(
      `UPDATE user_missions SET
        status = 'submitted',
        submitted_content = $2,
        submitted_file_url = $3,
        submitted_at = now()
      WHERE id = $1 AND status IN ('in_progress', 'rejected')
      RETURNING *`,
      [req.params.id, submitted_content || null, submitted_file_url || null]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Mission not found or not in submittable state' })
      return
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/user-missions/:id/review
router.put('/:id/review', authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { approved, score, feedback } = req.body
    const { rows } = await pool.query(
      `UPDATE user_missions SET
        status = $2,
        feedback_score = $3,
        feedback_text = $4,
        reviewed_at = now()
      WHERE id = $1
      RETURNING *`,
      [req.params.id, approved ? 'approved' : 'rejected', score || null, feedback || null]
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

export default router
