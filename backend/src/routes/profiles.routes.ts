import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()

// GET /api/profiles
router.get('/', authenticate, async (req, res) => {
  try {
    const { role, status, company_id, department_id, position_id } = req.query
    const conditions: string[] = []
    const params: unknown[] = []
    let idx = 1

    if (role) { conditions.push(`role = $${idx++}`); params.push(role) }
    if (status) { conditions.push(`status = $${idx++}`); params.push(status) }
    if (company_id) { conditions.push(`company_id = $${idx++}`); params.push(company_id) }
    if (department_id) { conditions.push(`department_id = $${idx++}`); params.push(department_id) }
    if (position_id) { conditions.push(`position_id = $${idx++}`); params.push(position_id) }

    // Manager can only see own department
    if (req.user!.role === 'manager') {
      const mgrResult = await pool.query('SELECT department_id FROM profiles WHERE id = $1', [req.user!.sub])
      const deptId = mgrResult.rows[0]?.department_id
      if (deptId) {
        conditions.push(`department_id = $${idx++}`)
        params.push(deptId)
      }
    }
    // Employee can only see self
    if (req.user!.role === 'employee') {
      conditions.push(`id = $${idx++}`)
      params.push(req.user!.sub)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows } = await pool.query(`SELECT * FROM profiles ${where} ORDER BY created_at DESC`, params)
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/profiles/:id
router.put('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params
    const { full_name, email, role, company_id, department_id, position_id, avatar_url, probation_start, probation_end } = req.body

    const { rows } = await pool.query(
      `UPDATE profiles SET
        full_name = COALESCE($2, full_name),
        email = COALESCE($3, email),
        role = COALESCE($4, role),
        company_id = COALESCE($5, company_id),
        department_id = COALESCE($6, department_id),
        position_id = COALESCE($7, position_id),
        avatar_url = COALESCE($8, avatar_url),
        probation_start = COALESCE($9, probation_start),
        probation_end = COALESCE($10, probation_end)
      WHERE id = $1
      RETURNING *`,
      [id, full_name, email, role, company_id, department_id, position_id, avatar_url, probation_start, probation_end]
    )

    if (rows.length === 0) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// PUT /api/profiles/:id/deactivate
router.put('/:id/deactivate', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `UPDATE profiles SET status = 'inactive' WHERE id = $1 RETURNING *`,
      [req.params.id]
    )
    if (rows.length === 0) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
