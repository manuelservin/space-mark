export const getRequiredEnv = (name: string): string => {
  const value = process.env[name]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Falta la variable de entorno ${name}. Definila en Vercel (Settings → Environment Variables) o en .env.local.`,
    )
  }
  return value
}

export const getDatabaseUrl = (): string => {
  const value = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      'Falta la variable de entorno DATABASE_URL. Neon puede exponerla como DATABASE_URL o POSTGRES_URL.',
    )
  }
  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    throw new Error('DATABASE_URL no es una URL válida. En Neon: Dashboard → Connection string → copiá la URI con sslmode=require.')
  }
  if (parsed.password.length === 0) {
    throw new Error('DATABASE_URL no incluye contraseña. En Neon: Dashboard → Connection string → copiá la URI completa.')
  }
  return value
}
