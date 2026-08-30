'use client'

import { Eye, Plus, Save, Trash2 } from 'lucide-react'
import type { FieldType, FormField, FormRecord } from '@/lib/forms/types'

type AdminFormEditorProps = {
  form: FormRecord
  isNew: boolean
  saved: boolean
  pending: boolean
  error: string
  confirmingDelete: boolean
  onTitle: (value: string) => void
  onDescription: (value: string) => void
  onFields: (fields: FormField[]) => void
  onPublished: (value: boolean) => void
  onSave: () => void
  onAskDelete: () => void
  onCancelDelete: () => void
  onConfirmDelete: () => void
}

const DEFAULT_PROPS: AdminFormEditorProps = {
  form: { id: '', title: '', description: '', fields: [], published: false },
  isNew: true,
  saved: false,
  pending: false,
  error: '',
  confirmingDelete: false,
  onTitle: () => {
    throw new Error('Falta onTitle en AdminFormEditor.')
  },
  onDescription: () => {
    throw new Error('Falta onDescription en AdminFormEditor.')
  },
  onFields: () => {
    throw new Error('Falta onFields en AdminFormEditor.')
  },
  onPublished: () => {
    throw new Error('Falta onPublished en AdminFormEditor.')
  },
  onSave: () => {
    throw new Error('Falta onSave en AdminFormEditor.')
  },
  onAskDelete: () => {
    throw new Error('Falta onAskDelete en AdminFormEditor.')
  },
  onCancelDelete: () => {
    throw new Error('Falta onCancelDelete en AdminFormEditor.')
  },
  onConfirmDelete: () => {
    throw new Error('Falta onConfirmDelete en AdminFormEditor.')
  },
}

const replaceField = (fields: FormField[], id: string, patch: Partial<FormField>): FormField[] => {
  return fields.map((field) => {
    if (field.id !== id) {
      return field
    }
    return { ...field, ...patch }
  })
}

export const AdminFormEditor = (props: AdminFormEditorProps) => {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }

  const previewHref = attrs.isNew ? '/encuesta' : `/encuesta/${attrs.form.id}`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">{attrs.isNew ? 'Nuevo formulario' : 'Editar formulario'}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">Diseña tu próxima pregunta</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href={previewHref} target="_blank" rel="noreferrer" className="rounded-full border border-border px-4 py-2 text-sm">
            Vista previa <Eye className="ml-1 inline" size={15} />
          </a>
          <button type="button" disabled={attrs.pending} onClick={attrs.onSave} className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60">
            <Save className="mr-1 inline" size={15} />
            {attrs.saved ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>

      {attrs.error.length > 0 ? <p className="text-sm text-destructive">{attrs.error}</p> : null}

      <div className="rounded-2xl border border-border bg-card p-6">
        <label className="block text-sm font-medium">
          Título
          <input
            className="mt-3 w-full rounded-xl border border-border bg-background p-4 text-2xl font-medium outline-none focus:border-accent"
            value={attrs.form.title}
            onChange={(event) => attrs.onTitle(event.target.value)}
          />
        </label>
        <label className="mt-6 block text-sm font-medium">
          Descripción
          <textarea
            rows={3}
            className="mt-3 w-full rounded-xl border border-border bg-background p-4 outline-none focus:border-accent"
            value={attrs.form.description}
            onChange={(event) => attrs.onDescription(event.target.value)}
          />
        </label>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[.16em] text-muted-foreground">Campos</p>
            <h3 className="mt-1 text-xl font-medium">Las preguntas importan</h3>
          </div>
          <button
            type="button"
            onClick={() => attrs.onFields([...attrs.form.fields, { id: crypto.randomUUID(), label: '', type: 'text', options: [] }])}
            className="rounded-full border border-border p-2"
            aria-label="Añadir pregunta"
          >
            <Plus size={17} />
          </button>
        </div>
        <div className="space-y-3">
          {attrs.form.fields.map((field, index) => (
            <div key={field.id} className="space-y-3 rounded-xl border border-border bg-background p-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-accent">0{index + 1}</span>
                <input
                  className="min-w-0 flex-1 bg-transparent p-2 outline-none"
                  value={field.label}
                  placeholder="Pregunta"
                  onChange={(event) => attrs.onFields(replaceField(attrs.form.fields, field.id, { label: event.target.value }))}
                />
                <label className="sr-only" htmlFor={`field-type-${field.id}`}>Tipo de pregunta</label>
                <select
                  id={`field-type-${field.id}`}
                  className="rounded-lg border border-border bg-card px-2 py-1 text-sm outline-none"
                  value={field.type}
                  onChange={(event) => attrs.onFields(replaceField(attrs.form.fields, field.id, { type: event.target.value as FieldType }))}
                >
                  <option value="text">Texto</option>
                  <option value="textarea">Párrafo</option>
                  <option value="select">Selección</option>
                </select>
                <button
                  type="button"
                  onClick={() => attrs.onFields(attrs.form.fields.filter((item) => item.id !== field.id))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Eliminar pregunta"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              {field.type === 'select' ? (
                <label className="block text-xs text-muted-foreground">
                  Opciones (una por línea)
                  <textarea
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-border bg-card p-2 text-sm text-foreground outline-none"
                    value={field.options.join('\n')}
                    onChange={(event) => attrs.onFields(replaceField(attrs.form.fields, field.id, {
                      options: event.target.value.split('\n').map((option) => option.trim()).filter((option) => option.length > 0),
                    }))}
                  />
                </label>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-primary p-6 text-primary-foreground">
        <div>
          <p className="text-2xl font-medium">{attrs.form.published ? 'Este formulario está publicado.' : 'Este formulario es un borrador.'}</p>
          <button
            type="button"
            onClick={() => attrs.onPublished(!attrs.form.published)}
            className="mt-4 rounded-full bg-primary-foreground px-4 py-2 text-sm text-primary"
          >
            {attrs.form.published ? 'Pasar a borrador' : 'Marcar como publicado'}
          </button>
        </div>
        {attrs.isNew ? null : attrs.confirmingDelete ? (
          <div className="flex gap-2">
            <button type="button" onClick={attrs.onConfirmDelete} className="rounded-full bg-accent px-4 py-2 text-sm text-accent-foreground">
              Confirmar borrado
            </button>
            <button type="button" onClick={attrs.onCancelDelete} className="rounded-full border border-primary-foreground/40 px-4 py-2 text-sm">
              Cancelar
            </button>
          </div>
        ) : (
          <button type="button" onClick={attrs.onAskDelete} className="rounded-full border border-primary-foreground/40 px-4 py-2 text-sm">
            Eliminar formulario
          </button>
        )}
      </div>
    </div>
  )
}
