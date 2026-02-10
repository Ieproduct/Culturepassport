import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile, UserRole } from '@/types'

const PROFILE_FETCH_TIMEOUT = 5000

export type AuthState = {
  session: Session | null
  user: User | null
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
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string, email: string, userMeta?: Record<string, unknown>) => {
    try {
      const result = await withTimeout(
        Promise.resolve(supabase.from('profiles').select('*').eq('id', userId).single()),
        PROFILE_FETCH_TIMEOUT,
      ) as { data: Profile | null; error: unknown }
      if (!result.error && result.data) return result.data
    } catch {
      // timeout or network error — fall through to fallback
    }
    if (userMeta) return buildFallbackProfile(userId, email, userMeta)
    return null
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) {
        const p = await fetchProfile(s.user.id, s.user.email ?? '', s.user.user_metadata)
        setProfile(p)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        setSession(s)
        setUser(s?.user ?? null)

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && s?.user) {
          const p = await fetchProfile(s.user.id, s.user.email ?? '', s.user.user_metadata)
          setProfile(p)
        }

        if (event === 'SIGNED_OUT') {
          setProfile(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [fetchProfile])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })
    if (error) return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }
    return { error: null }
  }, [])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
  }, [])

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
    session: {} as Session,
    user: {} as User,
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
