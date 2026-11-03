// Dibujo de escarcha en canvas: se usa para la invitación congelada y para el filtro de selfie.

export type Random = () => number

export const createRandom = (seed: number): Random => {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const drawBranch = (
  ctx: CanvasRenderingContext2D,
  random: Random,
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number,
) => {
  const endX = x + Math.cos(angle) * length
  const endY = y + Math.sin(angle) * length
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(endX, endY)
  ctx.stroke()
  if (depth <= 0 || length < 4) {
    return
  }
  const children = 2 + Math.floor(random() * 2)
  for (let index = 0; index < children; index += 1) {
    const t = 0.35 + random() * 0.6
    const startX = x + (endX - x) * t
    const startY = y + (endY - y) * t
    const side = random() > 0.5 ? 1 : -1
    drawBranch(ctx, random, startX, startY, angle + side * (0.5 + random() * 0.5), length * (0.35 + random() * 0.3), depth - 1)
  }
  drawBranch(ctx, random, endX, endY, angle + (random() - 0.5) * 0.5, length * 0.7, depth - 1)
}

// Cristales tipo helecho que crecen desde los bordes hacia adentro.
export const drawFrostCrystals = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  random: Random,
  options: { count: number; scale: number; alpha: number },
) => {
  ctx.save()
  ctx.lineCap = 'round'
  for (let index = 0; index < options.count; index += 1) {
    const edge = Math.floor(random() * 4)
    const along = random()
    const x = edge === 0 ? along * width : edge === 1 ? width : edge === 2 ? along * width : 0
    const y = edge === 0 ? 0 : edge === 1 ? along * height : edge === 2 ? height : along * height
    const inward = [Math.PI / 2, Math.PI, -Math.PI / 2, 0][edge]
    const angle = inward + (random() - 0.5) * 1.4
    ctx.strokeStyle = `rgba(255, 255, 255, ${options.alpha * (0.4 + random() * 0.6)})`
    ctx.lineWidth = (0.6 + random() * 1.4) * options.scale
    drawBranch(ctx, random, x, y, angle, (40 + random() * 110) * options.scale, 4)
  }
  ctx.restore()
}

export const drawSnow = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  random: Random,
  options: { count: number; scale: number },
) => {
  ctx.save()
  for (let index = 0; index < options.count; index += 1) {
    const radius = (0.8 + random() * 2.6) * options.scale
    ctx.fillStyle = `rgba(255, 255, 255, ${0.35 + random() * 0.55})`
    ctx.beginPath()
    ctx.arc(random() * width, random() * height, radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()
}

// Grietas con efecto "grabado": una línea clara y otra oscura apenas desplazada.
const drawCracks = (ctx: CanvasRenderingContext2D, width: number, height: number, random: Random, scale: number) => {
  ctx.save()
  ctx.lineJoin = 'round'
  for (let index = 0; index < 9; index += 1) {
    const points: [number, number][] = []
    let x = random() * width
    let y = random() * height
    let angle = random() * Math.PI * 2
    const segments = 6 + Math.floor(random() * 8)
    for (let step = 0; step < segments; step += 1) {
      points.push([x, y])
      angle += (random() - 0.5) * 0.9
      const length = (18 + random() * 46) * scale
      x += Math.cos(angle) * length
      y += Math.sin(angle) * length
    }
    points.push([x, y])
    const trace = (offset: number) => {
      ctx.beginPath()
      points.forEach(([pointX, pointY], position) => {
        if (position === 0) {
          ctx.moveTo(pointX + offset, pointY + offset)
        } else {
          ctx.lineTo(pointX + offset, pointY + offset)
        }
      })
      ctx.stroke()
    }
    ctx.lineWidth = 1.2 * scale
    ctx.strokeStyle = 'rgba(70, 115, 170, 0.35)'
    trace(1.2 * scale)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)'
    trace(0)
  }
  ctx.restore()
}

// Hielo translúcido: deja ver (borroso) lo que quedó atrapado adentro.
export const paintFrostSheet = (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
  const random = createRandom(711)
  ctx.clearRect(0, 0, width, height)

  const base = ctx.createLinearGradient(0, 0, width, height)
  base.addColorStop(0, 'rgba(214, 234, 255, 0.62)')
  base.addColorStop(0.5, 'rgba(150, 192, 236, 0.5)')
  base.addColorStop(1, 'rgba(196, 224, 252, 0.64)')
  ctx.fillStyle = base
  ctx.fillRect(0, 0, width, height)

  // Bordes más blancos y espesos, como un vidrio escarchado.
  const edge = ctx.createRadialGradient(
    width / 2, height / 2, Math.min(width, height) * 0.35,
    width / 2, height / 2, Math.max(width, height) * 0.72,
  )
  edge.addColorStop(0, 'rgba(255, 255, 255, 0)')
  edge.addColorStop(0.6, 'rgba(240, 248, 255, 0.25)')
  edge.addColorStop(1, 'rgba(250, 253, 255, 0.95)')
  ctx.fillStyle = edge
  ctx.fillRect(0, 0, width, height)

  const grain = Math.max(2, Math.round(3 * scale))
  for (let y = 0; y < height; y += grain) {
    for (let x = 0; x < width; x += grain) {
      const shade = random()
      if (shade > 0.6) {
        ctx.fillStyle = `rgba(255, 255, 255, ${(shade - 0.6) * 0.7})`
        ctx.fillRect(x, y, grain, grain)
      } else if (shade < 0.1) {
        ctx.fillStyle = `rgba(80, 125, 185, ${(0.1 - shade) * 1.4})`
        ctx.fillRect(x, y, grain, grain)
      }
    }
  }

  // Brillo diagonal de bloque de hielo.
  ctx.save()
  const sheen = ctx.createLinearGradient(0, 0, width, height)
  sheen.addColorStop(0.18, 'rgba(255, 255, 255, 0)')
  sheen.addColorStop(0.26, 'rgba(255, 255, 255, 0.32)')
  sheen.addColorStop(0.3, 'rgba(255, 255, 255, 0.08)')
  sheen.addColorStop(0.36, 'rgba(255, 255, 255, 0.22)')
  sheen.addColorStop(0.44, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = sheen
  ctx.fillRect(0, 0, width, height)
  ctx.restore()

  drawCracks(ctx, width, height, random, scale)
  drawFrostCrystals(ctx, width, height, random, { count: 34, scale: scale * 0.75, alpha: 0.8 })
}

const clamp = (value: number) => (value < 0 ? 0 : value > 255 ? 255 : value)

// Pasa la foto a tonos de hielo: desatura, enfría y sube el contraste.
const icePixels = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const image = ctx.getImageData(0, 0, width, height)
  const data = image.data
  for (let index = 0; index < data.length; index += 4) {
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]
    const light = 0.299 * r + 0.587 * g + 0.114 * b
    const contrasted = (light - 128) * 1.15 + 128
    const iceR = contrasted * 0.78 + 18
    const iceG = contrasted * 0.92 + 30
    const iceB = contrasted * 1.04 + 58
    data[index] = clamp(r * 0.25 + iceR * 0.75)
    data[index + 1] = clamp(g * 0.25 + iceG * 0.75)
    data[index + 2] = clamp(b * 0.25 + iceB * 0.75)
  }
  ctx.putImageData(image, 0, 0)
}

export const SELFIE_WIDTH = 1080
export const SELFIE_HEIGHT = 1350

const drawCover = (ctx: CanvasRenderingContext2D, source: CanvasImageSource, sourceWidth: number, sourceHeight: number, width: number, height: number) => {
  const ratio = Math.max(width / sourceWidth, height / sourceHeight)
  const drawWidth = sourceWidth * ratio
  const drawHeight = sourceHeight * ratio
  ctx.drawImage(source, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
}

export const loadImage = (file: Blob): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve(image)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No pudimos leer la foto. Probá con otra.'))
    }
    image.src = url
  })
}

// Recorta la foto a 4:5 (formato ideal para historias y WhatsApp).
export const cropSelfie = (image: HTMLImageElement): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  canvas.width = SELFIE_WIDTH
  canvas.height = SELFIE_HEIGHT
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    throw new Error('Tu navegador no soporta canvas.')
  }
  drawCover(ctx, image, image.naturalWidth, image.naturalHeight, SELFIE_WIDTH, SELFIE_HEIGHT)
  return canvas
}

export const drawFrozenSelfie = (source: HTMLCanvasElement | HTMLImageElement, options: { label: string; applyIce: boolean }): string => {
  const canvas = document.createElement('canvas')
  canvas.width = SELFIE_WIDTH
  canvas.height = SELFIE_HEIGHT
  const ctx = canvas.getContext('2d')
  if (ctx === null) {
    throw new Error('Tu navegador no soporta canvas.')
  }
  const sourceWidth = source instanceof HTMLImageElement ? source.naturalWidth : source.width
  const sourceHeight = source instanceof HTMLImageElement ? source.naturalHeight : source.height
  drawCover(ctx, source, sourceWidth, sourceHeight, SELFIE_WIDTH, SELFIE_HEIGHT)

  if (options.applyIce) {
    icePixels(ctx, SELFIE_WIDTH, SELFIE_HEIGHT)
    const vignette = ctx.createRadialGradient(
      SELFIE_WIDTH / 2, SELFIE_HEIGHT * 0.45, SELFIE_WIDTH * 0.3,
      SELFIE_WIDTH / 2, SELFIE_HEIGHT * 0.45, SELFIE_HEIGHT * 0.78,
    )
    vignette.addColorStop(0, 'rgba(230, 242, 255, 0)')
    vignette.addColorStop(0.7, 'rgba(225, 240, 255, 0.45)')
    vignette.addColorStop(1, 'rgba(245, 250, 255, 0.92)')
    ctx.fillStyle = vignette
    ctx.fillRect(0, 0, SELFIE_WIDTH, SELFIE_HEIGHT)
    const random = createRandom(Date.now())
    drawFrostCrystals(ctx, SELFIE_WIDTH, SELFIE_HEIGHT, random, { count: 70, scale: 1.05, alpha: 0.75 })
    drawSnow(ctx, SELFIE_WIDTH, SELFIE_HEIGHT, random, { count: 140, scale: 1.4 })
  }

  ctx.save()
  ctx.fillStyle = 'rgba(16, 38, 66, 0.72)'
  ctx.fillRect(0, SELFIE_HEIGHT - 120, SELFIE_WIDTH, 120)
  ctx.fillStyle = '#ffffff'
  ctx.font = '600 44px "Geist", system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillText(options.label, 48, SELFIE_HEIGHT - 60)
  ctx.textAlign = 'right'
  ctx.font = '500 40px "Geist Mono", ui-monospace, monospace'
  ctx.fillText('-18 °C', SELFIE_WIDTH - 48, SELFIE_HEIGHT - 60)
  ctx.restore()

  return canvas.toDataURL('image/jpeg', 0.88)
}

export const dataUrlToFile = async (dataUrl: string, name: string): Promise<File> => {
  const response = await fetch(dataUrl)
  const blob = await response.blob()
  return new File([blob], name, { type: blob.type })
}
