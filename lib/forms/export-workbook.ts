import ExcelJS from 'exceljs'
import type { FormRecord, FormResponseRecord } from '@/lib/forms/types'

const sanitizeSheetName = (title: string, index: number): string => {
  const cleaned = title.replace(/[:\\/?*\[\]]/g, ' ').replace(/\s+/g, ' ').trim()
  const base = cleaned.length === 0 ? `Formulario ${index + 1}` : cleaned
  return base.slice(0, 31)
}

const uniqueHeaders = (labels: string[]): string[] => {
  const seen: Record<string, number> = {}
  return labels.map((label) => {
    const current = seen[label]
    if (current === undefined) {
      seen[label] = 1
      return label
    }
    const next = current + 1
    seen[label] = next
    return `${label} (${next})`
  })
}

export const buildResponsesWorkbook = async (
  formList: FormRecord[],
  responses: FormResponseRecord[],
): Promise<Buffer> => {
  if (responses.length === 0) {
    throw new Error('No hay respuestas para exportar.')
  }

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Space Mark'
  workbook.created = new Date()

  const formsWithResponses = formList.filter((form) => {
    return responses.some((response) => response.formId === form.id)
  })

  if (formsWithResponses.length === 0) {
    throw new Error('Hay respuestas, pero no coinciden con ningún formulario actual.')
  }

  formsWithResponses.forEach((form, index) => {
    const sheet = workbook.addWorksheet(sanitizeSheetName(form.title, index))
    const headers = uniqueHeaders(['Fecha', ...form.fields.map((field) => field.label)])
    sheet.addRow(headers)
    sheet.getRow(1).font = { bold: true }

    const formResponses = responses.filter((response) => response.formId === form.id)
    formResponses.forEach((response) => {
      const values = form.fields.map((field) => {
        const answer = response.answers[field.id]
        if (answer === undefined) {
          return ''
        }
        return answer
      })
      sheet.addRow([response.createdAt, ...values])
    })

    sheet.getColumn(1).numFmt = 'yyyy-mm-dd hh:mm'
    sheet.columns.forEach((column) => {
      column.width = 28
    })
  })

  const buffer = await workbook.xlsx.writeBuffer()
  return Buffer.from(buffer)
}
