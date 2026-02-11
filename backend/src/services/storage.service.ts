import { Client } from 'minio'
import { env } from '../config/env.js'

export const minioClient = new Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: env.MINIO_USE_SSL,
  accessKey: env.MINIO_ACCESS_KEY,
  secretKey: env.MINIO_SECRET_KEY,
})

export async function uploadFile(
  bucketName: string,
  objectName: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  await minioClient.putObject(bucketName, objectName, buffer, buffer.length, {
    'Content-Type': contentType,
  })
  return objectName
}

export function getPublicUrl(bucketName: string, objectName: string): string {
  return `${env.MINIO_PUBLIC_URL}/${bucketName}/${objectName}`
}

export async function getSignedUrl(
  bucketName: string,
  objectName: string,
  expiresIn = 3600
): Promise<string> {
  return minioClient.presignedGetObject(bucketName, objectName, expiresIn)
}
