import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/database.js'
import { env } from '../config/env.js'
import type { JwtPayload } from '../middleware/auth.js'

const SALT_ROUNDS = 10

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: JwtPayload): string {
  // expiresIn expects ms StringValue — cast from env string
  return jwt.sign({ sub: payload.sub, email: payload.email, role: payload.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as unknown as number,
  })
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}

export async function authenticateUser(email: string, password: string) {
  const result = await pool.query(
    `SELECT p.*, ac.password_hash
     FROM profiles p
     JOIN auth_credentials ac ON ac.profile_id = p.id
     WHERE p.email = $1 AND p.status = 'active'`,
    [email]
  )

  if (result.rows.length === 0) return null

  const user = result.rows[0]
  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) return null

  const { password_hash: _, ...profile } = user
  const token = signToken({ sub: profile.id, email: profile.email, role: profile.role })

  return { token, profile }
}

export async function createUserWithCredentials(
  profileData: {
    full_name: string
    email: string
    role: string
    company_id?: string | null
    department_id?: string | null
    position_id?: string | null
  },
  password: string
) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const profileResult = await client.query(
      `INSERT INTO profiles (full_name, email, role, company_id, department_id, position_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [profileData.full_name, profileData.email, profileData.role,
       profileData.company_id || null, profileData.department_id || null, profileData.position_id || null]
    )
    const profile = profileResult.rows[0]

    const hash = await hashPassword(password)
    await client.query(
      `INSERT INTO auth_credentials (profile_id, password_hash) VALUES ($1, $2)`,
      [profile.id, hash]
    )

    await client.query('COMMIT')
    return profile
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}
