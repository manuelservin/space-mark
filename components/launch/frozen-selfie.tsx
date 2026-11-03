'use client'

import { Camera, Download, Loader2, Share2, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { LAUNCH_AI_MAX_TRIES, LAUNCH_EVENT } from '@/lib/launch/config'
import { cropSelfie, dataUrlToFile, drawFrozenSelfie, loadImage } from '@/lib/launch/frost'

const TRIES_KEY = 'lanzamiento-ia-intentos'
const LABEL = `Congelado hasta el ${LAUNCH_EVENT.dateLabel.toLowerCase()}`
const DOWNLOAD_NAME = 'congelado-07-11.jpg'

const readTries = (): number => {
  try {
    return Number(window.localStorage.getItem(TRIES_KEY) ?? '0') || 0
  } catch {
    return 0
  }
}

const writeTries = (value: number) => {
  try {
    window.localStorage.setItem(TRIES_KEY, String(value))
  } catch {
    // Sin storage (modo incógnito) el tope solo dura mientras la página está abierta.
  }
}

export const FrozenSelfie = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const cropped = useRef<HTMLCanvasElement | null>(null)
  const [frozen, setFrozen] = useState<string | null>(null)
  const [aiImage, setAiImage] = useState<string | null>(null)
  const [showing, setShowing] = useState<'filtro' | 'ia'>('filtro')
  const [aiPending, setAiPending] = useState(false)
  const [tries, setTries] = useState(0)
  const [error, setError] = useState('')
  const [canShare, setCanShare] = useState(false)

  useEffect(() => {
    setTries(readTries())
    setCanShare(typeof navigator.share === 'function' && typeof navigator.canShare === 'function')
  }, [])

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (file === undefined) {
      return
    }
    setError('')
    setAiImage(null)
    setShowing('filtro')
    try {
      const image = await loadImage(file)
      cropped.current = cropSelfie(image)
      setFrozen(drawFrozenSelfie(cropped.current, { label: LABEL, applyIce: true }))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No pudimos procesar la foto.')
    }
  }

  const handleAi = async () => {
    if (cropped.current === null || tries >= LAUNCH_AI_MAX_TRIES) {
      return
    }
    setAiPending(true)
    setError('')
    try {
      const response = await fetch('/api/lanzamiento/congelar', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ image: cropped.current.toDataURL('image/jpeg', 0.85) }),
      })
      const payload = (await response.json()) as { image?: string; error?: string }
      if (!response.ok || payload.image === undefined) {
        throw new Error(payload.error ?? 'La IA no pudo congelarte esta vez.')
      }
      // Solo descontamos el intento cuando la IA devolvió una imagen (los errores no se cobran).
      const nextTries = tries + 1
      setTries(nextTries)
      writeTries(nextTries)
      const image = new Image()
      image.src = payload.image
      await image.decode()
      setAiImage(drawFrozenSelfie(image, { label: LABEL, applyIce: false }))
      setShowing('ia')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'La IA no pudo congelarte esta vez.'
      setError(`${message} Igual te quedó tu versión con filtro. 🧊`)
    }
    setAiPending(false)
  }

  const current = showing === 'ia' && aiImage !== null ? aiImage : frozen
  const triesLeft = Math.max(0, LAUNCH_AI_MAX_TRIES - tries)

  const handleDownload = async () => {
    if (current === null) {
      return
    }
    // Un blob URL descarga mejor que un data URL (en iPhone el data URL abre la imagen en otra pestaña).
    const file = await dataUrlToFile(current, DOWNLOAD_NAME)
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = DOWNLOAD_NAME
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  const handleShare = async () => {
    if (current === null) {
      return
    }
    const file = await dataUrlToFile(current, DOWNLOAD_NAME)
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text: `Me congelaron hasta el ${LAUNCH_EVENT.dateLabel} 🧊` })
      } catch {
        // El usuario cerró el menú de compartir.
      }
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-white/40 shadow-inner backdrop-blur">
        {current === null ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex size-full flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <span className="flex size-16 items-center justify-center rounded-full bg-white/80 shadow">
              <Camera size={28} aria-hidden="true" />
            </span>
            <span className="text-lg font-medium">Sacate una selfie</span>
            <span className="text-sm opacity-70">La congelamos al toque.</span>
          </button>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt="Tu selfie congelada" className="size-full object-cover" />
        )}
        {aiPending ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#cfe3fa]/80 text-center backdrop-blur-sm">
            <Loader2 size={32} className="animate-spin" aria-hidden="true" />
            <p className="px-6 font-medium">Bajando la temperatura…<br /><span className="text-sm opacity-70">Puede tardar unos segundos.</span></p>
          </div>
        ) : null}
      </div>

      <div className="space-y-4">
        <input ref={inputRef} type="file" accept="image/*" capture="user" onChange={handleFile} className="sr-only" tabIndex={-1} aria-hidden="true" />
        {current === null ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1d3557] px-5 py-3 text-sm font-medium text-white"
          >
            <Camera size={16} aria-hidden="true" /> Abrir cámara
          </button>
        ) : (
          <button
            type="button"
            onClick={handleDownload}
            disabled={aiPending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1d3557] px-5 py-3.5 text-sm font-medium text-white disabled:opacity-60"
          >
            <Download size={16} aria-hidden="true" /> Descargar imagen
          </button>
        )}

        {frozen === null ? null : (
          <>
            <button
              type="button"
              onClick={handleAi}
              disabled={aiPending || triesLeft === 0}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white/80 px-5 py-3 text-sm font-medium shadow-sm disabled:opacity-50"
            >
              <Sparkles size={16} aria-hidden="true" />
              {triesLeft === 0 ? 'Ya usaste tus congeladas con IA' : `Congelame en serio (IA · te quedan ${triesLeft})`}
            </button>

            {aiImage === null ? null : (
              <div className="flex rounded-full bg-white/50 p-1 text-sm" role="group" aria-label="Versión de la foto">
                {(['filtro', 'ia'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={showing === option}
                    onClick={() => setShowing(option)}
                    className={`flex-1 rounded-full px-3 py-2 ${showing === option ? 'bg-white shadow-sm' : 'opacity-70'}`}
                  >
                    {option === 'filtro' ? 'Filtro' : 'IA'}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              {canShare ? (
                <button type="button" onClick={handleShare} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-current/25 px-4 py-3 text-sm font-medium">
                  <Share2 size={16} aria-hidden="true" /> Compartir
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-current/25 px-4 py-3 text-sm font-medium"
              >
                <Camera size={16} aria-hidden="true" /> Sacar otra
              </button>
            </div>
          </>
        )}

        {error.length > 0 ? <p className="text-sm text-[#8b1819]" aria-live="polite">{error}</p> : null}
        <p className="text-xs leading-5 opacity-60">
          El filtro se aplica en tu celular. Si usás la versión con IA, la foto se envía a Google Gemini solo para procesarla: no la guardamos.
        </p>
      </div>
    </div>
  )
}
