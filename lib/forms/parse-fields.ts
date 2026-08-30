import type { FieldType, FormField, FormRecord } from '@/lib/forms/types'

const FIELD_TYPES: FieldType[] = ['text', 'textarea', 'select']

const isFieldType = (value: unknown): value is FieldType => {
  return FIELD_TYPES.some((type) => type === value)
}

export const parseFormFields = (value: unknown): FormField[] => {
  if (!Array.isArray(value)) {
    throw new Error('Los campos del formulario no son una lista válida.')
  }

  return value.map((item, index) => {
    if (item === null || typeof item !== 'object') {
      throw new Error(`El campo ${index + 1} no es un objeto válido.`)
    }

    const record = item as Record<string, unknown>
    if (typeof record.id !== 'string' || record.id.length === 0) {
      throw new Error(`El campo ${index + 1} no tiene id.`)
    }
    if (typeof record.label !== 'string') {
      throw new Error(`El campo ${index + 1} no tiene etiqueta.`)
    }
    if (!isFieldType(record.type)) {
      throw new Error(`El campo ${index + 1} tiene un tipo inválido.`)
    }

    let options: string[] = []
    if (record.options !== undefined) {
      if (!Array.isArray(record.options) || record.options.some((option) => typeof option !== 'string')) {
        throw new Error(`El campo ${index + 1} tiene opciones inválidas.`)
      }
      options = record.options
    }

    return {
      id: record.id,
      label: record.label,
      type: record.type,
      options,
    }
  })
}

export const toFormRecord = (row: {
  id: string
  title: string
  description: string
  fields: unknown
  published: boolean
}): FormRecord => {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    fields: parseFormFields(row.fields),
    published: row.published,
  }
}
