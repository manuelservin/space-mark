import { setDefaultResultOrder } from 'node:dns'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import { getDatabaseUrl } from '@/lib/env'

// En Windows, Node a veces resuelve primero IPv6 y Neon falla con ENOTFOUND.
setDefaultResultOrder('ipv4first')

let poolInstance: Pool | null = null

const createPool = (): Pool => {
  return new Pool({
    connectionString: getDatabaseUrl(),
    connectionTimeoutMillis: 10000,
  })
}

export const getPool = (): Pool => {
  if (poolInstance === null) {
    poolInstance = createPool()
  }
  return poolInstance
}

const createDb = () => {
  return drizzle(getPool(), { schema })
}

type AppDb = ReturnType<typeof createDb>

let dbInstance: AppDb | null = null

export const getDb = (): AppDb => {
  if (dbInstance === null) {
    dbInstance = createDb()
  }
  return dbInstance
}

const collectErrorCodes = (error: unknown): string[] => {
  const codes: string[] = []
  let current: unknown = error
  while (current && typeof current === 'object') {
    if ('code' in current && typeof current.code === 'string') {
      codes.push(current.code)
    }
    current = 'cause' in current ? current.cause : undefined
  }
  return codes
}

export const rethrowDatabaseError = (error: unknown): never => {
  const codes = collectErrorCodes(error)
  if (codes.includes('ENOTFOUND')) {
    throw new Error(
      'No se pudo resolver el host de Neon (DNS). Revisá la conexión a internet y que DATABASE_URL sea la URI actual del dashboard.',
    )
  }
  throw error
}
