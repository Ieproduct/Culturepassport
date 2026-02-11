import type { IStorageService } from '../types'
import { get, apiRequest } from './http-client'

export function createApiStorageService(): IStorageService {
  return {
    async upload(bucketName, filePath, file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('bucket', bucketName)
      formData.append('path', filePath)

      const result = await apiRequest<{ path: string }>('/storage/upload', {
        method: 'POST',
        body: formData,
      })
      return { path: result.path }
    },

    getPublicUrl(bucketName, path) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
      return `${baseUrl}/storage/public-url?bucket=${encodeURIComponent(bucketName)}&path=${encodeURIComponent(path)}`
    },

    async getSignedUrl(bucketName, path, expiresIn = 3600) {
      try {
        const result = await get<{ url: string }>(
          `/storage/signed-url?bucket=${encodeURIComponent(bucketName)}&path=${encodeURIComponent(path)}&expires_in=${expiresIn}`,
        )
        return result.url
      } catch {
        return null
      }
    },
  }
}
