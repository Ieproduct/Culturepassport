import { supabase } from '@/lib/supabase'

/**
 * Get a signed URL for a private storage file.
 * For private buckets (e.g. mission-deliverables), the stored value is a path,
 * not a full URL. This creates a temporary signed URL for viewing/downloading.
 *
 * @param bucketName - Storage bucket name
 * @param path - File path within the bucket
 * @param expiresIn - URL expiry in seconds (default 1 hour)
 * @returns Signed URL string, or null on error
 */
export async function getSignedUrl(
  bucketName: string,
  path: string,
  expiresIn = 3600,
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(path, expiresIn)

  if (error) {
    console.error('Failed to create signed URL:', error.message)
    return null
  }
  return data.signedUrl
}
