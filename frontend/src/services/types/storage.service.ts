export type UploadOptions = {
  cacheControl?: string
  upsert?: boolean
}

export interface IStorageService {
  upload(
    bucketName: string,
    filePath: string,
    file: File,
    options?: UploadOptions,
  ): Promise<{ path: string }>
  getPublicUrl(bucketName: string, path: string): string
  getSignedUrl(bucketName: string, path: string, expiresIn?: number): Promise<string | null>
}
