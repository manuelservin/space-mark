import { betterAuth } from 'better-auth'
import { getPool } from '@/lib/db'
import { getRequiredEnv } from '@/lib/env'

const getOrigin = (value?: string) => {
  if (!value) return ''
  return value.startsWith('http://') || value.startsWith('https://')
    ? value
    : `https://${value}`
}

const createAuth = () => {
  const baseURL = getOrigin(
    process.env.BETTER_AUTH_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      process.env.VERCEL_URL ||
      process.env.V0_RUNTIME_URL ||
      'http://localhost:3000',
  )

  const origins = [
    'http://localhost:3000',
    baseURL,
    ...[
      process.env.V0_RUNTIME_URL,
      process.env.V0_DEV_APP_URL,
      process.env.V0_BUILD_URL,
      process.env.V0_SANDBOX_URL,
      process.env.VERCEL_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ].map(getOrigin),
  ].filter(Boolean)

  return betterAuth({
    database: getPool(),
    baseURL,
    secret: getRequiredEnv('BETTER_AUTH_SECRET'),
    emailAndPassword: { enabled: true, autoSignIn: true },
    trustedOrigins: origins,
    ...(process.env.NODE_ENV === 'development'
      ? {
          advanced: {
            defaultCookieAttributes: {
              sameSite: 'none' as const,
              secure: true,
            },
          },
        }
      : {}),
    session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
  })
}

type AuthInstance = ReturnType<typeof createAuth>

let authInstance: AuthInstance | null = null

export const getAuth = (): AuthInstance => {
  if (authInstance === null) {
    authInstance = createAuth()
  }
  return authInstance
}
