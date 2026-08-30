'use client'

import { Download, Eraser } from 'lucide-react'

type AdminResponsesActionsProps = {
  count: number
  pending: boolean
  confirmingClear: boolean
  onExport: () => void
  onAskClear: () => void
  onCancelClear: () => void
  onConfirmClear: () => void
}

const DEFAULT_PROPS: AdminResponsesActionsProps = {
  count: 0,
  pending: false,
  confirmingClear: false,
  onExport: () => {
    throw new Error('Falta onExport en AdminResponsesActions.')
  },
  onAskClear: () => {
    throw new Error('Falta onAskClear en AdminResponsesActions.')
  },
  onCancelClear: () => {
    throw new Error('Falta onCancelClear en AdminResponsesActions.')
  },
  onConfirmClear: () => {
    throw new Error('Falta onConfirmClear en AdminResponsesActions.')
  },
}

export const AdminResponsesActions = (props: AdminResponsesActionsProps) => {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }

  return (
    <div className="space-y-3">
      <p className="font-mono text-xs uppercase tracking-[.16em] text-muted-foreground">Respuestas</p>
      <p className="text-sm text-muted-foreground">{attrs.count} recibidas</p>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={attrs.pending}
          onClick={attrs.onExport}
          className="rounded-full border border-border px-3 py-2 text-left text-sm disabled:opacity-60"
        >
          <Download className="mr-2 inline" size={15} />
          Exportar Excel
        </button>
        {attrs.confirmingClear ? (
          <div className="space-y-2">
            <p className="text-xs text-destructive">Esto borra todas las respuestas. No se puede deshacer.</p>
            <button
              type="button"
              disabled={attrs.pending}
              onClick={attrs.onConfirmClear}
              className="w-full rounded-full bg-accent px-3 py-2 text-sm text-accent-foreground disabled:opacity-60"
            >
              Confirmar limpieza
            </button>
            <button
              type="button"
              disabled={attrs.pending}
              onClick={attrs.onCancelClear}
              className="w-full rounded-full border border-border px-3 py-2 text-sm disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={attrs.pending}
            onClick={attrs.onAskClear}
            className="rounded-full border border-border px-3 py-2 text-left text-sm disabled:opacity-60"
          >
            <Eraser className="mr-2 inline" size={15} />
            Limpiar respuestas
          </button>
        )}
      </div>
    </div>
  )
}
