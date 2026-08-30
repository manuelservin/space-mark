import type { FormField, FormRecord } from '@/lib/forms/types'

export const createEmptyField = (): FormField => {
  return {
    id: crypto.randomUUID(),
    label: '',
    type: 'text',
    options: [],
  }
}

export const createEmptyForm = (): FormRecord => {
  return {
    id: '',
    title: '',
    description: '',
    fields: [createEmptyField()],
    published: false,
  }
}
