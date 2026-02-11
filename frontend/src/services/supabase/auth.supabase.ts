import { supabase } from '@/lib/supabase'
import type { IAuthService, AuthEvent, AuthSessionData } from '../types'
import type { Profile } from '@/types'

export function createSupabaseAuthService(): IAuthService {
  return {
    async getSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return { session: null }
      return {
        session: {
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
            user_metadata: session.user.user_metadata ?? {},
          },
        },
      }
    },

    onAuthStateChange(callback) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          const mapped: AuthSessionData | null = session
            ? {
                user: {
                  id: session.user.id,
                  email: session.user.email ?? '',
                  user_metadata: session.user.user_metadata ?? {},
                },
              }
            : null
          callback(event as AuthEvent, mapped)
        },
      )
      return { unsubscribe: () => subscription.unsubscribe() }
    },

    async signInWithPassword(email, password) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      })
      if (error) return { error: new Error(error.message) }
      return { error: null }
    },

    async signOut() {
      await supabase.auth.signOut()
    },

    async fetchProfile(userId) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error || !data) return null
      return data as Profile
    },
  }
}
