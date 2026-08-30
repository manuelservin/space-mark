export const parseAnswers = (value: unknown): Record<string, string> => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Una respuesta tiene un formato inválido.')
  }

  const entries = Object.entries(value)
  return entries.reduce<Record<string, string>>((answers, [key, raw]) => {
    if (typeof raw !== 'string') {
      throw new Error(`La respuesta del campo ${key} no es texto.`)
    }
    return { ...answers, [key]: raw }
  }, {})
}
