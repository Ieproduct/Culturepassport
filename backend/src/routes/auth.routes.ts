import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authenticateUser } from '../services/auth.service.js'

const router = Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }

    const result = await authenticateUser(email, password)
    if (!result) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    res.json({ access_token: result.token, profile: result.profile })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  // JWT is stateless — client discards the token
  res.json({ message: 'Logged out' })
})

// GET /api/auth/session
router.get('/session', authenticate, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profiles WHERE id = $1', [req.user!.sub])
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }
    res.json({
      user: { id: req.user!.sub, email: req.user!.email },
      profile: result.rows[0],
    })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
