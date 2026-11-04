'use client'

import { Hand } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createRandom, paintFrostSheet } from '@/lib/launch/frost'

type FrostRevealProps = {
  children: React.ReactNode
  onMelt: () => void
}

const DEFAULT_PROPS: FrostRevealProps = {
  children: null,
  onMelt: () => {},
}

type Phase = 'frozen' | 'melting' | 'melted'

const MELT_THRESHOLD = 0.45
const BRUSH_RADIUS = 44
// Cada pasada saca solo una parte del hielo: hay que insistir, como cuando se derrite de verdad.
const BRUSH_STRENGTH = 0.2
const MELT_DURATION = 2200
const MAX_BLUR = 9
// Lo que tarda el canvas en desvanecerse (duration-700) más un margen.
const CANVAS_FADE_MS = 800

// Mide qué porcentaje de la escarcha ya se derritió, muestreando una grilla.
const measureCleared = (ctx: CanvasRenderingContext2D, width: number, height: number): number => {
  const data = ctx.getImageData(0, 0, width, height).data
  const step = 24
  let total = 0
  let cleared = 0
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      total += 1
      if (data[(y * width + x) * 4 + 3] < 80) {
        cleared += 1
      }
    }
  }
  return total === 0 ? 0 : cleared / total
}

// Deshielo final: el hielo se afina, se abren agujeros y chorrea hacia abajo.
const animateMelt = (canvas: HTMLCanvasElement, onDone: () => void) => {
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    onDone()
    return
  }
  const { width, height } = canvas
  const ratio = width / Math.max(1, canvas.getBoundingClientRect().width)
  const random = createRandom(Date.now())
  const drips = Array.from({ length: 34 }, () => ({
    x: random() * width,
    size: (6 + random() * 22) * ratio,
    speed: 0.7 + random() * 0.9,
    delay: random() * 0.35,
    wobble: random() * Math.PI * 2,
  }))
  const holes = Array.from({ length: 12 }, () => ({
    x: random() * width,
    y: random() * height,
    grow: 0.5 + random() * 0.8,
    delay: random() * 0.3,
  }))
  const start = performance.now()

  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / MELT_DURATION)
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = `rgba(0, 0, 0, ${0.015 + t * 0.05})`
    ctx.fillRect(0, 0, width, height)
    holes.forEach((hole) => {
      const local = Math.max(0, t - hole.delay)
      const radius = local * hole.grow * Math.max(width, height) * 0.45
      if (radius <= 0) {
        return
      }
      const gradient = ctx.createRadialGradient(hole.x, hole.y, radius * 0.4, hole.x, hole.y, radius)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.18)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(hole.x, hole.y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
    drips.forEach((drip) => {
      const local = Math.max(0, t - drip.delay)
      const tip = local * local * drip.speed * height * 1.6
      if (tip <= 0) {
        return
      }
      const x = drip.x + Math.sin(drip.wobble + tip / (60 * ratio)) * 4 * ratio
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
      ctx.fillRect(x - drip.size / 2, 0, drip.size, tip)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)'
      ctx.beginPath()
      ctx.arc(x, tip, drip.size * 0.7, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()
    if (t < 1) {
      window.requestAnimationFrame(frame)
    } else {
      onDone()
    }
  }
  window.requestAnimationFrame(frame)
}

export const FrostReveal = (props: FrostRevealProps) => {
  const attrs = {
    ...DEFAULT_PROPS,
    ...props,
  }
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const strokes = useRef(0)
  const [painted, setPainted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<Phase>('frozen')
  // Una vez que terminó de desvanecerse sacamos el canvas: invisible igual ocupa un bitmap de
  // pantalla completa (más su copia en RAM por willReadFrequently) y en iPhone eso suma para que
  // Safari mate la pestaña.
  const [canvasGone, setCanvasGone] = useState(false)
  const onMelt = useRef(attrs.onMelt)
  onMelt.current = attrs.onMelt

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas === null || phase !== 'frozen') {
      return
    }
    const paint = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = Math.round(rect.width * ratio)
      canvas.height = Math.round(rect.height * ratio)
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (ctx === null) {
        return
      }
      paintFrostSheet(ctx, canvas.width, canvas.height, ratio)
      setProgress(0)
      setPainted(true)
    }
    paint()
    let lastWidth = window.innerWidth
    const handleResize = () => {
      // En mobile la barra del navegador cambia el alto al scrollear: solo repintamos si cambia el ancho.
      if (canvas.isConnected && window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth
        paint()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (phase !== 'melted') {
      return
    }
    const timer = window.setTimeout(() => setCanvasGone(true), CANVAS_FADE_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  const melt = () => {
    if (phase !== 'frozen') {
      return
    }
    setPhase('melting')
    setProgress(1)
    onMelt.current()
    const canvas = canvasRef.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (canvas === null || reducedMotion) {
      setPhase('melted')
      return
    }
    animateMelt(canvas, () => setPhase('melted'))
  }

  const scrape = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (canvas === null || phase !== 'frozen') {
      return
    }
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (ctx === null) {
      return
    }
    const rect = canvas.getBoundingClientRect()
    const ratio = canvas.width / rect.width
    const point = { x: (event.clientX - rect.left) * ratio, y: (event.clientY - rect.top) * ratio }
    const from = lastPoint.current ?? point
    const radius = BRUSH_RADIUS * ratio
    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    const distance = Math.hypot(point.x - from.x, point.y - from.y)
    const steps = Math.max(1, Math.ceil(distance / (radius / 3)))
    for (let index = 0; index <= steps; index += 1) {
      const x = from.x + ((point.x - from.x) * index) / steps
      const y = from.y + ((point.y - from.y) * index) / steps
      const brush = ctx.createRadialGradient(x, y, 0, x, y, radius)
      brush.addColorStop(0, `rgba(0, 0, 0, ${BRUSH_STRENGTH})`)
      brush.addColorStop(0.55, `rgba(0, 0, 0, ${BRUSH_STRENGTH * 0.6})`)
      brush.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = brush
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.restore()
    lastPoint.current = point
    strokes.current += 1
    if (strokes.current % 6 === 0) {
      const cleared = measureCleared(ctx, canvas.width, canvas.height)
      setProgress(cleared)
      if (cleared >= MELT_THRESHOLD) {
        melt()
      }
    }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    // En compu alcanza con pasar el mouse (el cursor es una fuente de calor); en touch hay que frotar.
    if (event.pointerType === 'mouse' || event.buttons > 0) {
      scrape(event)
    }
  }

  const thaw = phase === 'frozen' ? Math.min(1, progress / MELT_THRESHOLD) : 1
  const blur = (1 - thaw) * MAX_BLUR

  return (
    <div className="relative">
      <div
        className={`transition-[filter] ${phase === 'frozen' ? 'duration-500' : 'duration-[2200ms]'}`}
        style={{ filter: blur > 0.2 ? `blur(${blur.toFixed(1)}px) saturate(${0.4 + thaw * 0.6})` : 'none' }}
      >
        {attrs.children}
      </div>
      {canvasGone ? null : (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          onPointerDown={(event) => {
            lastPoint.current = null
            scrape(event)
          }}
          onPointerMove={handlePointerMove}
          onPointerUp={() => {
            lastPoint.current = null
          }}
          onPointerLeave={() => {
            lastPoint.current = null
          }}
          className={`absolute inset-0 size-full touch-none transition-opacity duration-700 ${
            painted ? '' : 'bg-[linear-gradient(135deg,#d6eaff,#96c0ec,#c4e0fc)]'
          } ${phase === 'frozen' ? 'cursor-crosshair' : 'pointer-events-none'} ${phase === 'melted' ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      {phase === 'frozen' ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-3 px-6 text-center text-[#1d3557]">
          <p className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
            <Hand size={16} aria-hidden="true" className="animate-bounce" />
            Frotá la pantalla para descongelar
          </p>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-white/60">
            <div className="h-full rounded-full bg-[#f2b84b] transition-[width]" style={{ width: `${Math.round(thaw * 100)}%` }} />
          </div>
          <button
            type="button"
            onClick={melt}
            className="pointer-events-auto text-xs underline underline-offset-4 opacity-70 hover:opacity-100"
          >
            No puedo frotar, descongelalo de una
          </button>
        </div>
      ) : null}
    </div>
  )
}
