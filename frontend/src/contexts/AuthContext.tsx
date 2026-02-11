import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { useServices } from '@/services'
import type { Profile, UserRole } from '@/types'
import type { AuthSessionData, AuthEvent } from '@/services/types'

const PROFILE_FETCH_TIMEOUT = 5000

export type AuthState = {
  session: AuthSessionData | null
  user: AuthSessionData['user'] | null
  profile: Profile | null
  role: UserRole | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error: string | null }>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState | undefined>(undefined)

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(
      (v) => { clearTimeout(timer); resolve(v) },
      (e: unknown) => { clearTimeout(timer); reject(e) },
    )
  })
}

function buildFallbackProfile(userId: string, email: string, meta: Record<string, unknown>): Profile | null {
  const role = meta.role as string | undefined
  if (!role) return null
  const now = new Date().toISOString()
  return {
    id: userId,
    full_name: (meta.full_name as string) ?? '',
    email,
    role,
    company_id: null,
    department_id: null,
    position_id: null,
    avatar_url: null,
    probation_start: null,
    probation_end: null,
    status: 'active',
    created_at: now,
    updated_at: now,
  } as Profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth } = useServices()
  const [session, setSession] = useState<AuthSessionData | null>(null)
  const [user, setUser] = useState<AuthSessionData['user'] | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string, email: string, userMeta?: Record<string, unknown>) => {
    try {
      const result = await withTimeout(
        auth.fetchProfile(userId),
        PROFILE_FETCH_TIMEOUT,
      )
      if (result) return result
    } catch {
      // timeout or network error — fall through to fallback
    }
    if (userMeta) return buildFallbackProfile(userId, email, userMeta)
    return null
  }, [auth])

  useEffect(() => {
    auth.getSession().then(async (result: { session: AuthSessionData | null }) => {
      const s = result.session
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        const p = await fetchProfile(s.user.id, s.user.email, s.user.user_metadata)
        setProfile(p)
      }
      setLoading(false)
    })

    const { unsubscribe } = auth.onAuthStateChange(
      async (event: AuthEvent, s: AuthSessionData | null) => {
        setSession(s)
        setUser(s?.user ?? null)

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && s?.user) {
          const p = await fetchProfile(s.user.id, s.user.email, s.user.user_metadata)
          setProfile(p)
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      },
    )

    return () => unsubscribe()
  }, [auth, fetchProfile])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await auth.signInWithPassword(email, password)
    if (error) return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
    return { error: null }
  }, [auth])

  const logout = useCallback(async () => {
    await auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
  }, [auth])

  const role = profile?.role ?? null

  return (
    <AuthContext.Provider value={{ session, user, profile, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ─── Mock provider for dev UI preview (no Supabase needed) ─── */
const MOCK_PROFILE: Profile = {
  id: 'mock-admin-001',
  full_name: 'สมชาย ผู้ดูแล',
  email: 'admin@culturepassport.dev',
  role: 'admin',
  company_id: null,
  department_id: null,
  position_id: null,
  avatar_url: null,
  probation_start: null,
  probation_end: null,
  status: 'active',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
} as Profile

export function MockAuthProvider({ children }: { children: ReactNode }) {
  const mockState: AuthState = {
    session: { user: { id: 'mock-admin-001', email: 'admin@culturepassport.dev', user_metadata: {} } },
    user: { id: 'mock-admin-001', email: 'admin@culturepassport.dev', user_metadata: {} },
    profile: MOCK_PROFILE,
    role: 'admin',
    loading: false,
    login: async () => ({ error: null }),
    logout: async () => {},
  }

  return (
    <AuthContext.Provider value={mockState}>
      {children}
    </AuthContext.Provider>
  )
}
