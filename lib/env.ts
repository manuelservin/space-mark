export const getRequiredEnv = (name: string): string => {
  const value = process.env[name]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Falta la variable de entorno ${name}. Copiá .env.example a .env.local y completá el valor.`)
  }
  return value
}

export const getDatabaseUrl = (): string => {
  const value = getRequiredEnv('DATABASE_URL')
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
