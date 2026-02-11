import type { IStorageService } from '@/services/types'

/**
 * Get a signed URL for a private storage file.
 * For private buckets (e.g. mission-deliverables), the stored value is a path,
 * not a full URL. This creates a temporary signed URL for viewing/downloading.
 *
 * @param storageService - The storage service instance
 * @param bucketName - Storage bucket name
 * @param path - File path within the bucket
 * @param expiresIn - URL expiry in seconds (default 1 hour)
 * @returns Signed URL string, or null on error
 */
export async function getSignedUrl(
  storageService: IStorageService,
  bucketName: string,
  path: string,
  expiresIn = 3600,
): Promise<string | null> {
  return storageService.getSignedUrl(bucketName, path, expiresIn)
}
