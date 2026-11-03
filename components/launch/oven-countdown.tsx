'use client'

import { useEffect, useState } from 'react'
import { LAUNCH_EVENT, LAUNCH_FREEZER_TEMP, LAUNCH_HEATING_FROM, LAUNCH_OVEN_TEMP } from '@/lib/launch/config'

type Remaining = { days: number; hours: number; minutes: number; seconds: number; temperature: number; done: boolean }

const computeRemaining = (now: number): Remaining => {
  const target = new Date(LAUNCH_EVENT.startsAt).getTime()
  const start = new Date(LAUNCH_HEATING_FROM).getTime()
  const left = Math.max(0, target - now)
  const progress = Math.min(1, Math.max(0, (now - start) / (target - start)))
  return {
    days: Math.floor(left / 86_400_000),
    hours: Math.floor(left / 3_600_000) % 24,
    minutes: Math.floor(left / 60_000) % 60,
    seconds: Math.floor(left / 1000) % 60,
    temperature: Math.round(LAUNCH_FREEZER_TEMP + (LAUNCH_OVEN_TEMP - LAUNCH_FREEZER_TEMP) * progress),
    done: left === 0,
  }
}

const pad = (value: number) => String(value).padStart(2, '0')

export const OvenCountdown = () => {
  const [remaining, setRemaining] = useState<Remaining | null>(null)

  useEffect(() => {
    const tick = () => setRemaining(computeRemaining(Date.now()))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])

  const temperature = remaining === null ? LAUNCH_FREEZER_TEMP : remaining.temperature
  const fill = ((temperature - LAUNCH_FREEZER_TEMP) / (LAUNCH_OVEN_TEMP - LAUNCH_FREEZER_TEMP)) * 100
  const units = remaining === null
    ? [['--', 'días'], ['--', 'horas'], ['--', 'min'], ['--', 'seg']]
    : [[pad(remaining.days), 'días'], [pad(remaining.hours), 'horas'], [pad(remaining.minutes), 'min'], [pad(remaining.seconds), 'seg']]

  return (
    <div className="grid gap-8 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="flex items-end gap-4" aria-label={`El horno está a ${temperature} grados`}>
        <div className="relative h-48 w-9 rounded-full border-2 border-current/25 bg-white/50 p-1">
          <div
            className="absolute inset-x-1 bottom-1 rounded-full bg-gradient-to-t from-[#e0702a] via-[#f2b84b] to-[#8ec5ff] transition-[height] duration-1000"
            style={{ height: `calc(${Math.max(6, fill)}% - 8px)` }}
          />
        </div>
        <div>
          <p className="font-mono text-6xl font-semibold tabular-nums tracking-tight">
            {temperature}
            <span className="text-3xl">°C</span>
          </p>
          <p className="mt-1 text-sm opacity-70">de {LAUNCH_FREEZER_TEMP} °C a {LAUNCH_OVEN_TEMP} °C</p>
        </div>
      </div>
      <div>
        <p className="text-lg font-medium">
          {remaining?.done ? '¡Ding! El horno ya está listo.' : 'El horno se está precalentando…'}
        </p>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {units.map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white/55 px-2 py-3 text-center backdrop-blur">
              <p className="font-mono text-3xl font-semibold tabular-nums">{value}</p>
              <p className="text-xs uppercase tracking-widest opacity-60">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
