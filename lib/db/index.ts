import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'
import { getDatabaseUrl } from '@/lib/env'

export const pool = new Pool({ connectionString: getDatabaseUrl() })
export const db = drizzle(pool, { schema })
