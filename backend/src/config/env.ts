export const env = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://cp_dev:cp_dev_password_2024@localhost:5440/culturepassport_dev',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

  // MinIO
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT || 'localhost',
  MINIO_PORT: parseInt(process.env.MINIO_PORT || '9010', 10),
  MINIO_USE_SSL: process.env.MINIO_USE_SSL === 'true',
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY || 'minio_dev',
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY || 'minio_dev_password_2024',
  MINIO_PUBLIC_URL: process.env.MINIO_PUBLIC_URL || 'http://localhost:9010',
} as const
