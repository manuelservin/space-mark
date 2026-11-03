'use client'

import { useState } from 'react'
import { submitLaunchRsvp } from '@/app/actions/launch'
import { LAUNCH_EVENT } from '@/lib/launch/config'

type LaunchRsvpProps = {
  guess: string
}

const DEFAULT_PROPS: LaunchRsvpProps = {
  guess: '',
}

export const LaunchRsvp = (props: LaunchRsvpProps) => {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }
  const [name, setName] = useState('')
  const [attending, setAttending] = useState<'Voy' | 'No puedo'>('Voy')
  const [guess, setGuess] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const guessValue = guess ?? attrs.guess

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPending(true)
    setError('')
    try {
      const result = await submitLaunchRsvp({
        nombre: name,
        asistencia: attending,
        adivinanza: guessValue,
      })
      if (result.ok) {
        setSent(true)
      } else {
        setError(result.error)
      }
    } catch {
      setError('No pudimos guardar tu respuesta. Revisá tu conexión y probá de nuevo.')
    }
    setPending(false)
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-white/65 p-8 text-center backdrop-blur" aria-live="polite">
        <p className="text-5xl" aria-hidden="true">{attending === 'Voy' ? '🔥' : '🧊'}</p>
        <p className="mt-4 text-2xl font-semibold">
          {attending === 'Voy' ? `¡Listo, ${name.trim()}! Te esperamos con hambre.` : `Una pena, ${name.trim()}. Te guardamos en el freezer.`}
        </p>
        <p className="mt-2 opacity-70">
          {attending === 'Voy' ? `Nos vemos el ${LAUNCH_EVENT.dateLabel.toLowerCase()} · ${LAUNCH_EVENT.timeLabel}.` : 'Si cambiás de idea, volvé a abrir la invitación.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl bg-white/55 p-6 backdrop-blur">
      <label className="block">
        <span className="text-sm font-medium">Tu nombre</span>
        <input
          required
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          className="mt-2 w-full rounded-full border border-current/20 bg-white/80 px-4 py-3 outline-none focus:border-current/50"
        />
      </label>

      <fieldset>
        <legend className="text-sm font-medium">¿Venís?</legend>
        <div className="mt-2 flex rounded-full bg-white/50 p-1">
          {(['Voy', 'No puedo'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={attending === option}
              onClick={() => setAttending(option)}
              className={`flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${attending === option ? 'bg-white shadow-sm' : 'opacity-70'}`}
            >
              {option === 'Voy' ? 'Voy 🙌' : 'No puedo 😢'}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="text-sm font-medium">Tu apuesta: ¿qué es?</span>
        <input
          required
          maxLength={200}
          value={guessValue}
          onChange={(event) => setGuess(event.target.value)}
          placeholder="Arriesgá, el sábado vemos"
          className="mt-2 w-full rounded-full border border-current/20 bg-white/80 px-4 py-3 outline-none focus:border-current/50"
        />
      </label>

      {error.length > 0 ? <p className="text-sm text-[#8b1819]">{error}</p> : null}
      <button disabled={pending} className="w-full rounded-full bg-[#1d3557] px-6 py-3.5 text-sm font-medium text-white disabled:opacity-60">
        {pending ? 'Guardando…' : 'Confirmar'}
      </button>
    </form>
  )
}
