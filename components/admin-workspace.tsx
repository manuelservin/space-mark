'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Sparkles } from 'lucide-react'
import { clearAllResponses, deleteForm, saveForm } from '@/app/actions/forms'
import { AdminFormEditor } from '@/components/admin-form-editor'
import { AdminFormList } from '@/components/admin-form-list'
import { AdminResponsesActions } from '@/components/admin-responses-actions'
import { createEmptyForm } from '@/lib/forms/empty-form'
import type { FormField, FormRecord, FormResponseSummary } from '@/lib/forms/types'

type AdminWorkspaceProps = {
  initialData: {
    forms: FormRecord[]
    responses: FormResponseSummary[]
  }
  userName: string
}

const DEFAULT_PROPS: AdminWorkspaceProps = {
  initialData: {
    forms: [],
    responses: [],
  },
  userName: '',
}

const countResponses = (responses: FormResponseSummary[]): Record<string, number> => {
  return responses.reduce<Record<string, number>>((counts, response) => {
    const current = counts[response.formId]
    const next = current === undefined ? 1 : current + 1
    return { ...counts, [response.formId]: next }
  }, {})
}

const findForm = (forms: FormRecord[], id: string | null): FormRecord => {
  if (id === null) {
    return createEmptyForm()
  }
  const match = forms.find((form) => form.id === id)
  if (match === undefined) {
    throw new Error('El formulario seleccionado ya no existe.')
  }
  return match
}

export const AdminWorkspace = (props: AdminWorkspaceProps) => {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }
  const router = useRouter()
  const firstForm = attrs.initialData.forms[0]
  const [forms, setForms] = useState<FormRecord[]>(attrs.initialData.forms)
  const [selectedId, setSelectedId] = useState<string | null>(firstForm === undefined ? null : firstForm.id)
  const [draft, setDraft] = useState<FormRecord>(firstForm === undefined ? createEmptyForm() : firstForm)
  const [saved, setSaved] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [responses, setResponses] = useState<FormResponseSummary[]>(attrs.initialData.responses)

  const applyDraft = (next: FormRecord) => {
    setDraft(next)
    setSaved(false)
    setError('')
  }

  const handleSelect = (id: string) => {
    const form = findForm(forms, id)
    setSelectedId(id)
    setConfirmingDelete(false)
    applyDraft(form)
  }

  const handleCreate = () => {
    setSelectedId(null)
    setConfirmingDelete(false)
    applyDraft(createEmptyForm())
  }

  const handleSave = async () => {
    setPending(true)
    setError('')
    try {
      const id = await saveForm({
        id: selectedId,
        title: draft.title,
        description: draft.description,
        fields: draft.fields,
        published: draft.published,
      })
      const stored: FormRecord = { ...draft, id }
      const nextForms = selectedId === null
        ? [stored, ...forms]
        : forms.map((form) => form.id === id ? stored : form)
      setForms(nextForms)
      setSelectedId(id)
      setDraft(stored)
      setSaved(true)
      router.refresh()
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'No se pudo guardar el formulario.'
      setError(message)
    }
    setPending(false)
  }

  const handleDelete = async () => {
    if (selectedId === null) {
      throw new Error('No hay un formulario guardado para eliminar.')
    }
    setPending(true)
    setError('')
    try {
      await deleteForm(selectedId)
      const nextForms = forms.filter((form) => form.id !== selectedId)
      setForms(nextForms)
      const next = nextForms[0]
      if (next === undefined) {
        setSelectedId(null)
        applyDraft(createEmptyForm())
      } else {
        setSelectedId(next.id)
        applyDraft(next)
      }
      setConfirmingDelete(false)
      router.refresh()
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'No se pudo eliminar el formulario.'
      setError(message)
    }
    setPending(false)
  }

  const handleExport = async () => {
    setPending(true)
    setError('')
    try {
      const result = await fetch('/api/admin/responses/export')
      if (!result.ok) {
        const text = await result.text()
        throw new Error(text)
      }
      const blob = await result.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'respuestas-spacemark.xlsx'
      link.click()
      URL.revokeObjectURL(url)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'No se pudo exportar las respuestas.'
      setError(message)
    }
    setPending(false)
  }

  const handleClearResponses = async () => {
    setPending(true)
    setError('')
    try {
      await clearAllResponses()
      setResponses([])
      setConfirmingClear(false)
      router.refresh()
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'No se pudieron limpiar las respuestas.'
      setError(message)
    }
    setPending(false)
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <aside className="fixed hidden h-screen w-64 overflow-y-auto border-r border-border bg-card p-6 lg:block">
        <a href="/" className="flex items-center gap-3 font-mono text-sm font-bold tracking-[.2em]">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles size={17} />
          </span>
          SPACEMARK
        </a>
        <nav className="mt-16 space-y-2 text-sm">
          <div className="flex items-center gap-3 rounded-xl bg-muted px-3 py-3 font-medium">
            <LayoutDashboard size={17} /> Workspace
          </div>
        </nav>
        <div className="mt-10 space-y-8">
          <AdminFormList
            forms={forms}
            selectedId={selectedId}
            counts={countResponses(responses)}
            onSelect={handleSelect}
            onCreate={handleCreate}
          />
          <AdminResponsesActions
            count={responses.length}
            pending={pending}
            confirmingClear={confirmingClear}
            onExport={handleExport}
            onAskClear={() => setConfirmingClear(true)}
            onCancelClear={() => setConfirmingClear(false)}
            onConfirmClear={handleClearResponses}
          />
        </div>
      </aside>
      <section className="lg:ml-64">
        <header className="border-b border-border bg-card px-6 py-5 lg:px-10">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Workspace / {attrs.userName}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Formularios de análisis</h1>
        </header>
        <div className="space-y-8 p-6 lg:p-10">
          <div className="space-y-8 lg:hidden">
            <AdminFormList
              forms={forms}
              selectedId={selectedId}
              counts={countResponses(responses)}
              onSelect={handleSelect}
              onCreate={handleCreate}
            />
            <AdminResponsesActions
              count={responses.length}
              pending={pending}
              confirmingClear={confirmingClear}
              onExport={handleExport}
              onAskClear={() => setConfirmingClear(true)}
              onCancelClear={() => setConfirmingClear(false)}
              onConfirmClear={handleClearResponses}
            />
          </div>
          <AdminFormEditor
            form={draft}
            isNew={selectedId === null}
            saved={saved}
            pending={pending}
            error={error}
            confirmingDelete={confirmingDelete}
            onTitle={(title) => applyDraft({ ...draft, title })}
            onDescription={(description) => applyDraft({ ...draft, description })}
            onFields={(fields: FormField[]) => applyDraft({ ...draft, fields })}
            onPublished={(published) => applyDraft({ ...draft, published })}
            onSave={handleSave}
            onAskDelete={() => setConfirmingDelete(true)}
            onCancelDelete={() => setConfirmingDelete(false)}
            onConfirmDelete={handleDelete}
          />
        </div>
      </section>
    </main>
  )
}
