import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getResponsesForExport } from '@/app/actions/forms'
import { buildResponsesWorkbook } from '@/lib/forms/export-workbook'

export const dynamic = 'force-dynamic'

export const GET = async () => {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session?.user) {
    return new Response('Necesitás iniciar sesión para exportar respuestas.', { status: 401 })
  }

  try {
    const data = await getResponsesForExport()
    const buffer = await buildResponsesWorkbook(data.forms, data.responses)
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="respuestas-spacemark.xlsx"',
      },
    })
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'No se pudo exportar las respuestas.'
    return new Response(message, { status: 400 })
  }
}
