import type { Profile } from '@/types'

export type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'INITIAL_SESSION'

export type AuthUser = {
  id: string
  email: string
  user_metadata: Record<string, unknown>
}

export type AuthSessionData = {
  user: AuthUser
}

export interface IAuthService {
  getSession(): Promise<{ session: AuthSessionData | null }>
  onAuthStateChange(
    callback: (event: AuthEvent, session: AuthSessionData | null) => void,
  ): { unsubscribe: () => void }
  signInWithPassword(email: string, password: string): Promise<{ error: Error | null }>
  signOut(): Promise<void>
  fetchProfile(userId: string): Promise<Profile | null>
}
