'use server'

import { randomUUID } from 'crypto'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db, rethrowDatabaseError } from '@/lib/db'
import { formResponses, forms } from '@/lib/db/schema'
import { parseAnswers } from '@/lib/forms/parse-answers'
import { toFormRecord } from '@/lib/forms/parse-fields'
import type { FormField, FormRecord, FormResponseRecord, FormResponseSummary, PublishedFormSummary } from '@/lib/forms/types'

const revalidateFormPaths = () => {
  revalidatePath('/admin')
  revalidatePath('/encuesta')
  revalidatePath('/')
}

const requireAdmin = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    throw new Error('Necesitás iniciar sesión para gestionar formularios.')
  }
  return session.user
}

const validateFormInput = (input: { title: string; fields: FormField[] }) => {
  if (input.title.trim().length === 0) {
    throw new Error('El formulario necesita un título.')
  }
  if (input.fields.length === 0) {
    throw new Error('El formulario necesita al menos una pregunta.')
  }
  input.fields.forEach((field) => {
    if (field.label.trim().length === 0) {
      throw new Error('Todas las preguntas necesitan una etiqueta.')
    }
    if (field.type === 'select' && field.options.length === 0) {
      throw new Error(`La pregunta "${field.label}" es de selección y no tiene opciones.`)
    }
  })
}

export const saveForm = async (input: {
  id: string | null
  title: string
  description: string
  fields: FormField[]
  published: boolean
}): Promise<string> => {
  await requireAdmin()
  validateFormInput(input)
  const id = input.id ?? randomUUID()
  const values = {
    title: input.title.trim(),
    description: input.description.trim(),
    fields: input.fields,
    published: input.published,
    updatedAt: new Date(),
  }
  if (input.id !== null) {
    const updated = await db.update(forms).set(values).where(eq(forms.id, input.id)).returning({ id: forms.id })
    if (updated.length === 0) {
      throw new Error('No se encontró el formulario para actualizar.')
    }
  } else {
    await db.insert(forms).values({ id, ...values })
  }
  revalidateFormPaths()
  return id
}

export const deleteForm = async (id: string) => {
  await requireAdmin()
  if (id.length === 0) {
    throw new Error('Falta el id del formulario.')
  }
  await db.delete(formResponses).where(eq(formResponses.formId, id))
  const deleted = await db.delete(forms).where(eq(forms.id, id)).returning({ id: forms.id })
  if (deleted.length === 0) {
    throw new Error('No se encontró el formulario para eliminar.')
  }
  revalidateFormPaths()
}

export const submitResponse = async (formId: string, answers: Record<string, string>) => {
  const form = await db.select({ id: forms.id }).from(forms).where(and(eq(forms.id, formId), eq(forms.published, true))).limit(1)
  if (form.length === 0) {
    throw new Error('La encuesta no está disponible.')
  }
  await db.insert(formResponses).values({ id: randomUUID(), formId, answers })
  revalidatePath('/admin')
  return { ok: true }
}

export const getAdminData = async (): Promise<{ forms: FormRecord[]; responses: FormResponseSummary[] }> => {
  await requireAdmin()
  const allForms = await db.select().from(forms).orderBy(desc(forms.updatedAt))
  const responses = await db.select({
    id: formResponses.id,
    formId: formResponses.formId,
  }).from(formResponses).orderBy(desc(formResponses.createdAt))
  return {
    forms: allForms.map((row) => toFormRecord(row)),
    responses,
  }
}

export const clearAllResponses = async () => {
  await requireAdmin()
  await db.delete(formResponses)
  revalidatePath('/admin')
}

export const getResponsesForExport = async (): Promise<{
  forms: FormRecord[]
  responses: FormResponseRecord[]
}> => {
  await requireAdmin()
  const allForms = await db.select().from(forms).orderBy(desc(forms.updatedAt))
  const rows = await db.select().from(formResponses).orderBy(formResponses.createdAt)
  return {
    forms: allForms.map((row) => toFormRecord(row)),
    responses: rows.map((row) => ({
      id: row.id,
      formId: row.formId,
      answers: parseAnswers(row.answers),
      createdAt: row.createdAt,
    })),
  }
}

export const getPublishedForms = async (): Promise<PublishedFormSummary[]> => {
  try {
    const rows = await db.select({
      id: forms.id,
      title: forms.title,
      description: forms.description,
    }).from(forms).where(eq(forms.published, true)).orderBy(desc(forms.updatedAt))
    return rows
  } catch (error) {
    rethrowDatabaseError(error)
  }
}

export const getSurveyForm = async (id: string): Promise<FormRecord | null> => {
  const rows = await db.select().from(forms).where(eq(forms.id, id)).limit(1)
  if (rows.length === 0) {
    return null
  }
  const form = toFormRecord(rows[0])
  if (form.published) {
    return form
  }
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) {
    return form
  }
  return null
}
