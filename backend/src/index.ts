import express from 'express'
import cors from 'cors'
import { env } from './config/env.js'
import { errorHandler } from './middleware/error-handler.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import profilesRoutes from './routes/profiles.routes.js'
import missionsRoutes from './routes/missions.routes.js'
import userMissionsRoutes from './routes/user-missions.routes.js'
import announcementsRoutes from './routes/announcements.routes.js'
import roadmapRoutes from './routes/roadmap.routes.js'
import masterDataRoutes from './routes/master-data.routes.js'
import examsRoutes from './routes/exams.routes.js'
import storageRoutes from './routes/storage.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/profiles', profilesRoutes)
app.use('/api/missions', missionsRoutes)
app.use('/api/user-missions', userMissionsRoutes)
app.use('/api/announcements', announcementsRoutes)
app.use('/api/roadmap', roadmapRoutes)
app.use('/api/master-data', masterDataRoutes)
app.use('/api/exams', examsRoutes)
app.use('/api/storage', storageRoutes)
app.use('/api/admin', adminRoutes)

// Error handler
app.use(errorHandler)

// Start
app.listen(env.PORT, () => {
  console.log(`CulturePassport API running on port ${env.PORT} (${env.NODE_ENV})`)
})
