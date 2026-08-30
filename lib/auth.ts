import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'
import { getRequiredEnv } from '@/lib/env'

const origins = process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '', process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : ''].filter(Boolean)

export const auth = betterAuth({
  database: pool,
  baseURL: getRequiredEnv('BETTER_AUTH_URL'),
  secret: getRequiredEnv('BETTER_AUTH_SECRET'),
  emailAndPassword: { enabled: true, autoSignIn: true },
  trustedOrigins: origins,
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
})

