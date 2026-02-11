import type { IAuthService, AuthEvent, AuthSessionData } from '../types'
import type { Profile } from '@/types'
import { get, post, setToken, clearToken } from './http-client'

type LoginResponse = {
  access_token: string
  profile: Profile
}

type SessionResponse = {
  user: { id: string; email: string }
  profile: Profile
}

export function createApiAuthService(): IAuthService {
  // Store callback for state change notifications
  let stateCallback: ((event: AuthEvent, session: AuthSessionData | null) => void) | null = null

  return {
    async getSession() {
      try {
        const data = await get<SessionResponse>('/auth/session')
        return {
          session: {
            user: {
              id: data.user.id,
              email: data.user.email,
              user_metadata: {},
            },
          },
        }
      } catch {
        return { session: null }
      }
    },

    onAuthStateChange(callback) {
      stateCallback = callback
      // Check session on mount
      this.getSession().then((result) => {
        callback('INITIAL_SESSION', result.session)
      })
      return {
        unsubscribe: () => {
          stateCallback = null
        },
      }
    },

    async signInWithPassword(email, password) {
      try {
        const data = await post<LoginResponse>('/auth/login', { email, password })
        setToken(data.access_token)
        if (stateCallback) {
          stateCallback('SIGNED_IN', {
            user: {
              id: data.profile.id,
              email: data.profile.email,
              user_metadata: {},
            },
          })
        }
        return { error: null }
      } catch (err) {
        return { error: err as Error }
      }
    },

    async signOut() {
      clearToken()
      if (stateCallback) {
        stateCallback('SIGNED_OUT', null)
      }
    },

    async fetchProfile(userId) {
      try {
        const profiles = await get<Profile[]>(`/profiles?role=&status=`)
        return profiles.find((p) => p.id === userId) ?? null
      } catch {
        return null
      }
    },
  }
}
