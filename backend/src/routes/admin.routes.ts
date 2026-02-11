import { Router } from 'express'
import { pool } from '../config/database.js'
import { authenticate } from '../middleware/auth.js'
import { authorize } from '../middleware/authorize.js'
import { createUserWithCredentials } from '../services/auth.service.js'

const router = Router()

// POST /api/admin/create-user
router.post('/create-user', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { email, password, full_name, role, company_name, department_name, position_name } = req.body

    // Resolve names to IDs
    let company_id: string | null = null
    let department_id: string | null = null
    let position_id: string | null = null

    if (company_name) {
      const { rows } = await pool.query('SELECT id FROM companies WHERE name = $1', [company_name])
      company_id = rows[0]?.id ?? null
    }
    if (department_name) {
      const { rows } = await pool.query('SELECT id FROM departments WHERE name = $1', [department_name])
      department_id = rows[0]?.id ?? null
    }
    if (position_name) {
      const { rows } = await pool.query('SELECT id FROM positions WHERE name = $1', [position_name])
      position_id = rows[0]?.id ?? null
    }

    const profile = await createUserWithCredentials(
      { full_name, email, role, company_id, department_id, position_id },
      password
    )
    res.status(201).json({ profile })
  } catch (err) {
    const pgErr = err as { code?: string }
    if (pgErr.code === '23505') {
      res.status(409).json({ error: 'User with this email already exists' })
      return
    }
    res.status(500).json({ error: (err as Error).message })
  }
})

// GET /api/admin/overview-stats
router.get('/overview-stats', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const [profilesRes, missionsRes, umRes] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM profiles WHERE role = 'employee' AND status = 'active'`),
      pool.query(`SELECT COUNT(*) FROM missions WHERE is_deleted = false`),
      pool.query(`SELECT id, status FROM user_missions`),
    ])

    const totalEmployees = parseInt(profilesRes.rows[0].count, 10)
    const totalMissions = parseInt(missionsRes.rows[0].count, 10)
    const allUserMissions = umRes.rows
    const approved = allUserMissions.filter((um) => um.status === 'approved').length
    const completionRate = allUserMissions.length > 0 ? Math.round((approved / allUserMissions.length) * 100) : 0
    const pendingCount = allUserMissions.filter((um) => um.status === 'submitted').length

    res.json({
      totalEmployees,
      totalMissions,
      completionRate,
      pendingCount,
      allUserMissions,
    })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// GET /api/admin/export-data
router.get('/export-data', authenticate, authorize('admin'), async (req, res) => {
  try {
    const profileFilter = req.query.user_ids
      ? (req.query.user_ids as string).split(',')
      : null

    let umQuery = 'SELECT * FROM user_missions'
    const umParams: unknown[] = []
    if (profileFilter && profileFilter.length > 0) {
      umQuery += ` WHERE user_id = ANY($1)`
      umParams.push(profileFilter)
    }

    const { rows: umRows } = await pool.query(umQuery, umParams)

    const missionIds = [...new Set(umRows.map((r) => r.mission_id))]
    const userIds = [...new Set(umRows.map((r) => r.user_id))]

    const [missionsRes, profilesRes] = await Promise.all([
      missionIds.length > 0
        ? pool.query(`SELECT id, title FROM missions WHERE id = ANY($1)`, [missionIds])
        : { rows: [] },
      userIds.length > 0
        ? pool.query(`SELECT id, full_name, email, role FROM profiles WHERE id = ANY($1)`, [userIds])
        : { rows: [] },
    ])

    const missionMap = new Map(missionsRes.rows.map((m) => [m.id, m]))
    const profileMap = new Map(profilesRes.rows.map((p) => [p.id, p]))

    const exportRows = umRows.map((row) => {
      const mission = missionMap.get(row.mission_id)
      const profile = profileMap.get(row.user_id)
      return {
        mission_title: mission?.title ?? '',
        user_name: profile?.full_name ?? '',
        user_email: profile?.email ?? '',
        user_role: profile?.role ?? '',
        status: row.status,
        feedback_score: row.feedback_score,
        started_at: row.started_at,
        submitted_at: row.submitted_at,
        reviewed_at: row.reviewed_at,
      }
    })

    res.json(exportRows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// GET /api/admin/pending-missions
router.get('/pending-missions', authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    let query = `SELECT um.* FROM user_missions um WHERE um.status = 'submitted'`
    const params: unknown[] = []

    // Manager: scope to department
    if (req.user!.role === 'manager') {
      const mgrResult = await pool.query('SELECT department_id FROM profiles WHERE id = $1', [req.user!.sub])
      const deptId = mgrResult.rows[0]?.department_id
      if (deptId) {
        query += ` AND um.user_id IN (SELECT id FROM profiles WHERE department_id = $1)`
        params.push(deptId)
      }
    }

    const { rows } = await pool.query(query, params)
    const missionIds = [...new Set(rows.map((r) => r.mission_id))]
    const userIds = [...new Set(rows.map((r) => r.user_id))]

    const [missionsRes, profilesRes] = await Promise.all([
      missionIds.length > 0
        ? pool.query(`SELECT id, title FROM missions WHERE id = ANY($1)`, [missionIds])
        : { rows: [] },
      userIds.length > 0
        ? pool.query(`SELECT id, full_name FROM profiles WHERE id = ANY($1)`, [userIds])
        : { rows: [] },
    ])

    const missionMap = new Map(missionsRes.rows.map((m) => [m.id, m.title]))
    const profileMap = new Map(profilesRes.rows.map((p) => [p.id, p.full_name]))

    const result = rows.map((item) => ({
      id: item.id,
      mission_id: item.mission_id,
      user_id: item.user_id,
      status: item.status,
      submitted_content: item.submitted_content,
      submitted_file_url: item.submitted_file_url,
      submitted_at: item.submitted_at,
      mission_title: missionMap.get(item.mission_id) ?? 'Mission',
      employee_name: profileMap.get(item.user_id) ?? 'Employee',
    }))

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// GET /api/admin/team-members
router.get('/team-members', authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { company_id, department_id, position_id } = req.query
    const conditions: string[] = [`role = 'employee'`, `status = 'active'`]
    const params: unknown[] = []
    let idx = 1

    if (company_id) { conditions.push(`company_id = $${idx++}`); params.push(company_id) }
    if (department_id) { conditions.push(`department_id = $${idx++}`); params.push(department_id) }
    if (position_id) { conditions.push(`position_id = $${idx++}`); params.push(position_id) }

    // Manager: scope to department
    if (req.user!.role === 'manager') {
      const mgrResult = await pool.query('SELECT department_id FROM profiles WHERE id = $1', [req.user!.sub])
      const deptId = mgrResult.rows[0]?.department_id
      if (deptId) {
        conditions.push(`department_id = $${idx++}`)
        params.push(deptId)
      }
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
    const { rows: profiles } = await pool.query(`SELECT * FROM profiles ${where}`, params)

    // Enrich with mission stats (batch query instead of N+1)
    const profileIds = profiles.map((p) => p.id)
    const { rows: missions } = profileIds.length > 0
      ? await pool.query(`SELECT user_id, status FROM user_missions WHERE user_id = ANY($1)`, [profileIds])
      : { rows: [] as Array<{ user_id: string; status: string }> }

    const missionsByUser = new Map<string, Array<{ status: string }>>()
    for (const m of missions) {
      const arr = missionsByUser.get(m.user_id) || []
      arr.push(m)
      missionsByUser.set(m.user_id, arr)
    }

    const enriched = profiles.map((p) => {
      const userMissions = missionsByUser.get(p.id) || []
      const total = userMissions.length
      const completed = userMissions.filter((m) => m.status === 'approved').length
      const pending = userMissions.filter((m) => m.status === 'submitted').length
      return {
        ...p,
        total_missions: total,
        completed_missions: completed,
        pending_review: pending,
        progress_percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      }
    })

    res.json(enriched)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

// GET /api/admin/member-exam-scores/:memberId
router.get('/member-exam-scores/:memberId', authenticate, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT es.*, et.title as exam_title
       FROM exam_scores es
       LEFT JOIN exam_templates et ON et.id = es.exam_template_id
       WHERE es.user_id = $1
       ORDER BY es.taken_at DESC`,
      [req.params.memberId]
    )

    const result = rows.map((s) => ({
      title: s.exam_title ?? 'Exam',
      score: s.score,
      total: s.total,
      passed: s.passed,
    }))

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
