'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'
import { formResponses, forms } from '@/lib/db/schema'
import { LAUNCH_ATTENDANCE_OPTIONS, LAUNCH_RSVP_FORM } from '@/lib/launch/config'

export type GuessHeat = 'frio' | 'tibio' | 'caliente'

// Las palabras clave viven solo en el servidor para no spoilear el producto en el bundle.
const HOT_WORDS = ['chipa', 'chipita', 'chipacito', 'pan de queso', 'pandequeso']
const WARM_WORDS = [
  'queso', 'mandioca', 'almidon', 'yuca', 'pan', 'pancito', 'panificado', 'panaderia', 'horno',
  'bocadito', 'snack', 'bolita', 'bollito', 'scon', 'grisin', 'tortilla', 'paraguay', 'congelado',
]

const normalize = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export const rateGuess = async (guess: string): Promise<GuessHeat> => {
  const text = normalize(guess).slice(0, 200)
  if (HOT_WORDS.some((word) => text.includes(word))) {
    return 'caliente'
  }
  const words = text.split(/[^a-z]+/)
  if (WARM_WORDS.some((word) => words.some((candidate) => candidate.startsWith(word)))) {
    return 'tibio'
  }
  return 'frio'
}

const ensureRsvpForm = async () => {
  await getDb()
    .insert(forms)
    .values({ ...LAUNCH_RSVP_FORM, published: false })
    .onConflictDoNothing({ target: forms.id })
}

export const submitLaunchRsvp = async (input: {
  nombre: string
  asistencia: string
  adivinanza: string
}): Promise<{ ok: true } | { ok: false; error: string }> => {
  const nombre = input.nombre.trim()
  if (nombre.length === 0 || nombre.length > 80) {
    return { ok: false, error: 'Decinos tu nombre (hasta 80 caracteres).' }
  }
  if (!LAUNCH_ATTENDANCE_OPTIONS.includes(input.asistencia)) {
    return { ok: false, error: 'Elegí si venís o no.' }
  }
  const adivinanza = input.adivinanza.trim()
  if (adivinanza.length === 0 || adivinanza.length > 200) {
    return { ok: false, error: 'Dejanos tu apuesta: ¿qué creés que es?' }
  }

  try {
    await ensureRsvpForm()
    await getDb().insert(formResponses).values({
      id: randomUUID(),
      formId: LAUNCH_RSVP_FORM.id,
      answers: { nombre, asistencia: input.asistencia, adivinanza },
    })
  } catch (error) {
    // En producción Next oculta los mensajes de error de las server actions: devolvemos uno propio.
    console.error('[lanzamiento] No se pudo guardar la confirmación', error)
    return { ok: false, error: 'No pudimos guardar tu respuesta. Probá de nuevo en un ratito.' }
  }
  revalidatePath('/admin')
  return { ok: true }
}
