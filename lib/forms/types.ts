export type FieldType = 'text' | 'textarea' | 'select'

export type FormField = {
  id: string
  label: string
  type: FieldType
  options: string[]
}

export type FormRecord = {
  id: string
  title: string
  description: string
  fields: FormField[]
  published: boolean
}

export type FormResponseSummary = {
  id: string
  formId: string
}

export type FormResponseRecord = {
  id: string
  formId: string
  answers: Record<string, string>
  createdAt: Date
}

export type PublishedFormSummary = {
  id: string
  title: string
  description: string
}
