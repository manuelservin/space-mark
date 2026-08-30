'use client'

import { useState } from 'react'
import { submitResponse } from '@/app/actions/forms'
import type { FormRecord } from '@/lib/forms/types'

type SurveyFormProps = {
  form: FormRecord
}

const DEFAULT_PROPS: SurveyFormProps = {
  form: {
    id: '',
    title: '',
    description: '',
    fields: [],
    published: false,
  },
}

export default function SurveyForm(props: SurveyFormProps) {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (attrs.form.id.length === 0) {
      throw new Error('La encuesta no tiene id.')
    }
    setPending(true)
    setError('')
    try {
      await submitResponse(attrs.form.id, answers)
      setSent(true)
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'No se pudo enviar la respuesta.'
      setError(message)
    }
    setPending(false)
  }

  if (sent) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="max-w-lg text-center">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Gracias por participar</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight">Tu respuesta ya está en órbita.</h1>
          <p className="mt-5 leading-7 text-muted-foreground">Cada respuesta ayuda a SpaceMark a encontrar una señal más clara.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:py-20">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="font-mono text-sm font-bold tracking-[.2em]">SPACEMARK</a>
        <div className="mt-20">
          <p className="font-mono text-xs uppercase tracking-[.2em] text-accent">Una pregunta para ti</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance">{attrs.form.title}</h1>
          <p className="mt-5 max-w-xl leading-7 text-muted-foreground">{attrs.form.description}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          {attrs.form.fields.map((field) => (
            <label key={field.id} className="block">
              <span className="mb-3 block text-sm font-medium">{field.label}</span>
              {field.type === 'textarea' ? (
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border border-border bg-card p-4 outline-none focus:border-accent"
                  value={answers[field.id] ?? ''}
                  onChange={(event) => setAnswers({ ...answers, [field.id]: event.target.value })}
                />
              ) : field.type === 'select' ? (
                <select
                  required
                  className="w-full rounded-xl border border-border bg-card p-4 outline-none focus:border-accent"
                  value={answers[field.id] ?? ''}
                  onChange={(event) => setAnswers({ ...answers, [field.id]: event.target.value })}
                >
                  <option value="">Selecciona una opción</option>
                  {field.options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  className="w-full rounded-xl border border-border bg-card p-4 outline-none focus:border-accent"
                  value={answers[field.id] ?? ''}
                  onChange={(event) => setAnswers({ ...answers, [field.id]: event.target.value })}
                />
              )}
            </label>
          ))}
          {error.length > 0 ? <p className="text-sm text-destructive">{error}</p> : null}
          <button disabled={pending} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
            {pending ? 'Enviando…' : 'Enviar respuesta'}
          </button>
        </form>
      </div>
    </main>
  )
}
