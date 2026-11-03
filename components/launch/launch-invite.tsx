'use client'

import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { ClueGame } from '@/components/launch/clue-game'
import { FrostReveal } from '@/components/launch/frost-reveal'
import { FrozenSelfie } from '@/components/launch/frozen-selfie'
import { LaunchRsvp } from '@/components/launch/launch-rsvp'
import { OvenCountdown } from '@/components/launch/oven-countdown'
import { LAUNCH_EVENT } from '@/lib/launch/config'

// Hielo → crema → dorado → horno.
const HEAT_STOPS: [number, number, number][] = [
  [207, 227, 250],
  [246, 231, 176],
  [242, 184, 75],
  [224, 112, 42],
]

const heatColor = (heat: number): string => {
  const scaled = Math.min(1, Math.max(0, heat)) * (HEAT_STOPS.length - 1)
  const index = Math.min(HEAT_STOPS.length - 2, Math.floor(scaled))
  const t = scaled - index
  const [from, to] = [HEAT_STOPS[index], HEAT_STOPS[index + 1]]
  const channel = (position: number) => Math.round(from[position] + (to[position] - from[position]) * t)
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`
}

type SectionProps = {
  id: string
  kicker: string
  title: string
  children: React.ReactNode
}

const Section = (props: SectionProps) => {
  return (
    <section id={props.id} className="mx-auto max-w-3xl px-5 py-20 sm:px-8 sm:py-28">
      <p className="font-mono text-xs uppercase tracking-[.25em] opacity-60">{props.kicker}</p>
      <h2 className="mt-3 text-balance text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{props.title}</h2>
      <div className="mt-10">{props.children}</div>
    </section>
  )
}

export const LaunchInvite = () => {
  const [melted, setMelted] = useState(false)
  const [scroll, setScroll] = useState(0)
  const [guess, setGuess] = useState('')
  const frame = useRef(0)

  useEffect(() => {
    const update = () => {
      frame.current = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScroll(max <= 0 ? 0 : window.scrollY / max)
    }
    const handleScroll = () => {
      if (frame.current === 0) {
        frame.current = window.requestAnimationFrame(update)
      }
    }
    update()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.cancelAnimationFrame(frame.current)
    }
  }, [])

  // Al descongelar saltamos directo a crema: entre hielo y crema el RGB intermedio queda grisáceo.
  const heat = melted ? 1 / 3 + scroll * (2 / 3) : 0
  const background = heatColor(heat)

  useEffect(() => {
    document.documentElement.style.backgroundColor = background
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', background)
  }, [background])

  useEffect(() => {
    return () => {
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  return (
    <main
      className={`min-h-screen text-[#1d2a3a] transition-colors duration-700 ${melted ? '' : 'h-svh overflow-hidden'}`}
      style={{ backgroundColor: background }}
    >
      <FrostReveal onMelt={() => setMelted(true)}>
        <header className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
          <div
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 size-[min(70vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-[2000ms] ${
              melted ? 'scale-100 bg-[#f2b84b]/70' : 'scale-50 bg-white/0'
            }`}
          />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[.3em] opacity-70">Te invitamos</p>
            <h1 className="mt-5 text-balance text-5xl font-semibold leading-[.95] tracking-[-0.06em] sm:text-7xl">
              Algo se está <span className="italic">descongelando.</span>
            </h1>
            <dl className="mt-10 grid grid-cols-1 gap-3 text-left sm:grid-cols-3">
              {[
                ['Cuándo', LAUNCH_EVENT.dateLabel],
                ['Hora', LAUNCH_EVENT.timeLabel],
                ['Dónde', LAUNCH_EVENT.placeLabel],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-white/50 px-5 py-4 backdrop-blur">
                  <dt className="font-mono text-[11px] uppercase tracking-[.2em] opacity-60">{label}</dt>
                  <dd className="mt-1 text-lg font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <a
              href="#horno"
              className={`mt-12 inline-flex items-center gap-2 text-sm font-medium transition-opacity duration-1000 ${melted ? 'opacity-80' : 'pointer-events-none opacity-0'}`}
            >
              Seguí bajando, que se calienta <ChevronDown size={16} className="animate-bounce" aria-hidden="true" />
            </a>
          </div>
        </header>
      </FrostReveal>

      {melted ? (
        <>
          <Section id="horno" kicker="Cuenta regresiva" title="Del freezer al horno.">
            <OvenCountdown />
          </Section>
          <Section id="pistas" kicker="Pistas" title="No te lo vamos a decir. Pero…">
            <ClueGame onGuess={setGuess} />
          </Section>
          <Section id="selfie" kicker="Congelate" title="Mientras tanto, te guardamos en el freezer.">
            <FrozenSelfie />
          </Section>
          <Section id="confirmar" kicker="Confirmá" title="¿Venís con hambre?">
            <LaunchRsvp guess={guess} />
          </Section>
          <footer className="px-6 pb-16 pt-6 text-center">
            <p className="text-2xl font-semibold tracking-tight">{LAUNCH_EVENT.dateLabel}. Traé hambre.</p>
            <p className="mt-2 text-sm opacity-70">Lo que es, se revela en persona.</p>
          </footer>
        </>
      ) : null}
    </main>
  )
}
