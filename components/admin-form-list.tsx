'use client'

import { FilePlus2 } from 'lucide-react'
import type { FormRecord } from '@/lib/forms/types'

type AdminFormListProps = {
  forms: FormRecord[]
  selectedId: string | null
  counts: Record<string, number>
  onSelect: (id: string) => void
  onCreate: () => void
}

const DEFAULT_PROPS: AdminFormListProps = {
  forms: [],
  selectedId: null,
  counts: {},
  onSelect: () => {
    throw new Error('Falta onSelect en AdminFormList.')
  },
  onCreate: () => {
    throw new Error('Falta onCreate en AdminFormList.')
  },
}

export const AdminFormList = (props: AdminFormListProps) => {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[.16em] text-muted-foreground">Formularios</p>
        <button type="button" onClick={attrs.onCreate} className="rounded-full border border-border p-2 text-foreground" aria-label="Crear formulario">
          <FilePlus2 size={16} />
        </button>
      </div>
      {attrs.forms.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no hay formularios.</p>
      ) : (
        <ul className="space-y-2">
          {attrs.forms.map((form) => {
            const isActive = attrs.selectedId === form.id
            const count = attrs.counts[form.id]
            const responseLabel = count === undefined ? '0' : String(count)
            return (
              <li key={form.id}>
                <button
                  type="button"
                  onClick={() => attrs.onSelect(form.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left ${isActive ? 'border-accent bg-muted' : 'border-border bg-background'}`}
                >
                  <span className="block truncate text-sm font-medium">{form.title.length === 0 ? 'Sin título' : form.title}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {form.published ? 'Publicado' : 'Borrador'} · {responseLabel} respuestas
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
