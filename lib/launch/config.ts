import type { FormField } from '@/lib/forms/types'

// Datos del evento.
export const LAUNCH_EVENT = {
  startsAt: '2026-11-07T12:30:00-03:00',
  dateLabel: 'Sábado 07.11',
  timeLabel: '12:30 h',
  placeLabel: 'Aula 20',
}

// Desde cuándo el "horno" empieza a precalentarse (marca -18 °C).
export const LAUNCH_HEATING_FROM = '2026-11-03T00:00:00-03:00'

export const LAUNCH_FREEZER_TEMP = -18
export const LAUNCH_OVEN_TEMP = 200

export type LaunchClue = {
  id: string
  text: string
  unlocksAt: string
  unlockLabel: string
}

// Cada pista se destraba un día distinto para que vuelvan a entrar.
export const LAUNCH_CLUES: LaunchClue[] = [
  { id: 'litoral', text: 'Nace en el Litoral, pero viaja a todos lados.', unlocksAt: '2026-11-03T00:00:00-03:00', unlockLabel: 'martes' },
  { id: 'mate', text: 'Se lleva muy bien con el mate.', unlocksAt: '2026-11-04T00:00:00-03:00', unlockLabel: 'miércoles' },
  { id: 'redondo', text: 'Es redondo, pero no es una pelota.', unlocksAt: '2026-11-05T00:00:00-03:00', unlockLabel: 'jueves' },
  { id: 'frio', text: 'Duerme en el frío. Se despierta en minutos.', unlocksAt: '2026-11-06T00:00:00-03:00', unlockLabel: 'viernes' },
]

export const LAUNCH_ATTENDANCE_OPTIONS = ['Voy', 'No puedo']

// Las confirmaciones se guardan como respuestas de este formulario (visible en /admin).
export const LAUNCH_RSVP_FORM_ID = 'lanzamiento-0711'

export const LAUNCH_RSVP_FORM = {
  id: LAUNCH_RSVP_FORM_ID,
  title: 'Lanzamiento 07.11 — Confirmaciones',
  description: 'Respuestas de la invitación interactiva en /lanzamiento.',
  fields: [
    { id: 'nombre', label: 'Nombre', type: 'text', options: [] },
    { id: 'asistencia', label: '¿Venís?', type: 'select', options: LAUNCH_ATTENDANCE_OPTIONS },
    { id: 'adivinanza', label: '¿Qué creés que es?', type: 'textarea', options: [] },
  ] satisfies FormField[],
}

export const LAUNCH_AI_MAX_TRIES = 3
