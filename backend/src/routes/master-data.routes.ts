import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'

const router = Router()

// ─── Helper: generic CRUD for simple master tables ───
function crudRoutes(tableName: string, requiredFields: string[]) {
  const sub = Router()

  // GET (all authenticated users)
  sub.get('/', authenticate, async (_req, res) => {
    try {
      const { rows } = await pool.query(`SELECT * FROM ${tableName} ORDER BY created_at DESC`)
      res.json(rows)
    } catch (err) {
      res.status(500).json({ error: (err as Error).message })
    }
  })

  // POST (admin only)
  sub.post('/', authenticate, authorize('admin'), async (req, res) => {
    try {
      const fields = Object.keys(req.body).filter((k) => req.body[k] !== undefined)
      if (requiredFields.some((f) => !req.body[f])) {
        res.status(400).json({ error: `Required fields: ${requiredFields.join(', ')}` })
        return
      }
      const values = fields.map((_, i) => `$${i + 1}`)
      const { rows } = await pool.query(
        `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${values.join(', ')}) RETURNING *`,
        fields.map((f) => req.body[f])
      )
      res.status(201).json(rows[0])
    } catch (err) {
      res.status(500).json({ error: (err as Error).message })
    }
  })

  // PUT (admin only)
  sub.put('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
      const fields = Object.keys(req.body).filter((k) => req.body[k] !== undefined && k !== 'id')
      if (fields.length === 0) {
        res.status(400).json({ error: 'No fields to update' })
        return
      }
      const sets = fields.map((f, i) => `${f} = $${i + 2}`)
      const { rows } = await pool.query(
        `UPDATE ${tableName} SET ${sets.join(', ')} WHERE id = $1 RETURNING *`,
        [req.params.id, ...fields.map((f) => req.body[f])]
      )
      if (rows.length === 0) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      res.json(rows[0])
    } catch (err) {
      res.status(500).json({ error: (err as Error).message })
    }
  })

  // DELETE (admin only)
  sub.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
      const { rowCount } = await pool.query(`DELETE FROM ${tableName} WHERE id = $1`, [req.params.id])
      if (rowCount === 0) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      res.json({ success: true })
    } catch (err) {
      const pgErr = err as { code?: string }
      if (pgErr.code === '23503') {
        res.status(409).json({ error: 'Cannot delete: item is referenced by other records' })
        return
      }
      res.status(500).json({ error: (err as Error).message })
    }
  })

  return sub
}

router.use('/companies', crudRoutes('companies', ['name', 'code']))
router.use('/departments', crudRoutes('departments', ['name', 'company_id']))
router.use('/positions', crudRoutes('positions', ['name', 'department_id']))
router.use('/categories', crudRoutes('categories', ['name']))

export default router
