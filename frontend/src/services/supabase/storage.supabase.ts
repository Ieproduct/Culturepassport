import { supabase } from '@/lib/supabase'
import type { IStorageService } from '../types'

export function createSupabaseStorageService(): IStorageService {
  return {
    async upload(bucketName, filePath, file, options?) {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: options?.cacheControl ?? '3600',
          upsert: options?.upsert ?? false,
        })
      if (error) throw error
      return { path: data.path }
    },

    getPublicUrl(bucketName, path) {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(path)
      return data.publicUrl
    },

    async getSignedUrl(bucketName, path, expiresIn = 3600) {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(path, expiresIn)
      if (error) {
        console.error('Failed to create signed URL:', error.message)
        return null
      }
      return data.signedUrl
    },
  }
}
