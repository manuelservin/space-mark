'use client'

import { Lock, Snowflake } from 'lucide-react'
import { useEffect, useState } from 'react'
import { rateGuess, type GuessHeat } from '@/app/actions/launch'
import { LAUNCH_CLUES } from '@/lib/launch/config'

type ClueGameProps = {
  onGuess: (guess: string) => void
}

const DEFAULT_PROPS: ClueGameProps = {
  onGuess: () => {},
}

const HEAT_COPY: Record<GuessHeat, { emoji: string; title: string; text: string }> = {
  frio: { emoji: '🥶', title: 'Frío, frío…', text: 'Ni cerca. Releé las pistas.' },
  tibio: { emoji: '🌡️', title: 'Tibio…', text: 'Vas entrando en calor.' },
  caliente: { emoji: '🔥', title: '¡Caliente!', text: 'No te vamos a confirmar nada hasta el sábado. 🤐' },
}

export const ClueGame = (props: ClueGameProps) => {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }
  const [now, setNow] = useState<number | null>(null)
  const [flipped, setFlipped] = useState<string[]>([])
  const [guess, setGuess] = useState('')
  const [heat, setHeat] = useState<GuessHeat | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setNow(Date.now())
  }, [])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const value = guess.trim()
    if (value.length === 0) {
      return
    }
    setPending(true)
    setError('')
    try {
      setHeat(await rateGuess(value))
      attrs.onGuess(value)
    } catch {
      setError('Se nos congeló el termómetro. Probá de nuevo.')
    }
    setPending(false)
  }

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {LAUNCH_CLUES.map((clue, index) => {
          const unlocked = now !== null && now >= new Date(clue.unlocksAt).getTime()
          const open = unlocked && flipped.includes(clue.id)
          return (
            <li key={clue.id}>
              <button
                type="button"
                disabled={!unlocked}
                onClick={() => setFlipped(open ? flipped.filter((id) => id !== clue.id) : [...flipped, clue.id])}
                aria-expanded={open}
                className={`flex min-h-28 w-full flex-col justify-between rounded-3xl p-5 text-left transition-all duration-500 ${
                  open ? 'bg-white/80 shadow-lg' : 'bg-white/40 backdrop-blur'
                } ${unlocked ? 'hover:-translate-y-0.5' : 'cursor-not-allowed opacity-70'}`}
              >
                <span className="font-mono text-xs uppercase tracking-[.2em] opacity-60">Pista {index + 1}</span>
                {open ? (
                  <span className="mt-3 text-lg font-medium leading-snug">{clue.text}</span>
                ) : unlocked ? (
                  <span className="mt-3 flex items-center gap-2 text-sm opacity-80">
                    <Snowflake size={16} aria-hidden="true" /> Tocá para descongelarla
                  </span>
                ) : (
                  <span className="mt-3 flex items-center gap-2 text-sm opacity-80">
                    <Lock size={16} aria-hidden="true" /> Se descongela el {clue.unlockLabel}
                  </span>
                )}
              </button>
            </li>
          )
        })}
        <li className="flex min-h-28 flex-col justify-between rounded-3xl border-2 border-dashed border-current/25 p-5 sm:col-span-2">
          <span className="font-mono text-xs uppercase tracking-[.2em] opacity-60">Última pista</span>
          <span className="mt-3 text-lg font-medium">Se revela en persona. Traé hambre.</span>
        </li>
      </ul>

      <form onSubmit={handleSubmit} className="mt-8 rounded-3xl bg-white/55 p-5 backdrop-blur">
        <label htmlFor="launch-guess" className="block text-sm font-medium">¿Qué creés que es?</label>
        <div className="mt-3 flex gap-2">
          <input
            id="launch-guess"
            value={guess}
            maxLength={200}
            onChange={(event) => setGuess(event.target.value)}
            placeholder="Arriesgá…"
            className="min-w-0 flex-1 rounded-full border border-current/20 bg-white/80 px-4 py-3 outline-none focus:border-current/50"
          />
          <button disabled={pending || guess.trim().length === 0} className="rounded-full bg-[#1d3557] px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
            {pending ? '…' : 'Medir'}
          </button>
        </div>
        {heat === null ? null : (
          <p className="mt-4 flex items-center gap-3" aria-live="polite">
            <span className="text-3xl" aria-hidden="true">{HEAT_COPY[heat].emoji}</span>
            <span>
              <strong>{HEAT_COPY[heat].title}</strong> {HEAT_COPY[heat].text}
            </span>
          </p>
        )}
        {error.length > 0 ? <p className="mt-3 text-sm text-[#8b1819]">{error}</p> : null}
      </form>
    </div>
  )
}
