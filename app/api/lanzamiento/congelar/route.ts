import { NextResponse } from 'next/server'

export const maxDuration = 60

const DEFAULT_MODEL = 'gemini-2.5-flash-image'
const MAX_IMAGE_CHARS = 3_000_000
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

// Ojo: no mencionar comida en el prompt para que la IA no spoilee el producto.
const PROMPT = [
  'Edit this selfie so the person looks frozen in extreme cold, as if they were inside a giant walk-in freezer.',
  'Add frost and tiny ice crystals on the hair, eyebrows and eyelashes, a cold bluish tint on the skin,',
  'visible breath vapor, falling snow and an icy blue background.',
  'Keep the face, identity, expression and pose clearly recognizable. Photorealistic, cinematic lighting.',
  'Do not add any text, logos, food or extra people.',
].join(' ')

type GeminiPart = {
  inlineData?: { mimeType?: string; data?: string }
  inline_data?: { mime_type?: string; data?: string }
}

type GeminiResponse = {
  candidates?: { content?: { parts?: GeminiPart[] } }[]
  error?: { message?: string }
}

const parseDataUrl = (value: unknown): { mimeType: string; data: string } => {
  if (typeof value !== 'string' || value.length > MAX_IMAGE_CHARS) {
    throw new Error('La foto es demasiado grande.')
  }
  const match = /^data:(image\/[a-z]+);base64,([A-Za-z0-9+/=]+)$/.exec(value)
  if (match === null || !ALLOWED_TYPES.includes(match[1])) {
    throw new Error('El formato de la foto no es válido.')
  }
  return { mimeType: match[1], data: match[2] }
}

const findImage = (payload: GeminiResponse): string | null => {
  const parts = payload.candidates?.[0]?.content?.parts ?? []
  for (const part of parts) {
    const inline = part.inlineData ?? (part.inline_data ? { mimeType: part.inline_data.mime_type, data: part.inline_data.data } : undefined)
    if (inline?.data) {
      return `data:${inline.mimeType ?? 'image/png'};base64,${inline.data}`
    }
  }
  return null
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'La congeladora con IA no está configurada.' }, { status: 503 })
  }
  // Freno básico para que no usen la API key desde otros sitios.
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite !== null && fetchSite !== 'same-origin') {
    return NextResponse.json({ error: 'Origen no permitido.' }, { status: 403 })
  }

  let image: { mimeType: string; data: string }
  try {
    const body: unknown = await request.json()
    image = parseDataUrl(body && typeof body === 'object' && 'image' in body ? body.image : null)
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : 'Pedido inválido.'
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const model = process.env.GEMINI_IMAGE_MODEL || DEFAULT_MODEL
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: image.mimeType, data: image.data } }] }],
        generationConfig: { responseModalities: ['IMAGE'] },
      }),
      signal: AbortSignal.timeout(50_000),
    })
    const payload = (await response.json()) as GeminiResponse
    if (!response.ok) {
      console.error('[lanzamiento/congelar] Gemini respondió', response.status, payload.error?.message)
      const busy = response.status === 429
      return NextResponse.json(
        { error: busy ? 'Hay mucha gente congelándose. Probá en un ratito.' : 'La IA no pudo congelarte esta vez.' },
        { status: busy ? 429 : 502 },
      )
    }
    const result = findImage(payload)
    if (result === null) {
      return NextResponse.json({ error: 'La IA no devolvió una imagen. Probá con otra foto.' }, { status: 502 })
    }
    return NextResponse.json({ image: result })
  } catch (cause) {
    console.error('[lanzamiento/congelar] Error llamando a Gemini', cause)
    return NextResponse.json({ error: 'Hacía demasiado frío y la IA se trabó. Probá de nuevo.' }, { status: 504 })
  }
}
