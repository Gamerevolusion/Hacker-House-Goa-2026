import { drawCoverCrop, loadImage } from './imageUtils'
import { builderNumber, getBuilderTitle } from './builderData'

// ── Card dimensions (badge/ID aspect ratio, 3:4ish) ──
const CARD_W = 720
const CARD_H = 960
const DPR = 2 // render at 2x for sharpness
const W = CARD_W * DPR
const H = CARD_H * DPR

// ── Colors ──
const INK = '#0B1710'
const SAND = '#F1E7CE'
const CORAL = '#FF6A4D'
const AMBER = '#FFB74A'
const TEAL = '#1FA69B'
const PALM = '#16241C'

export interface CardData {
  name: string
  stack: string
  customTitle?: string
  photos: Blob[]
}

/**
 * Draw a rounded rectangle path.
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}

/**
 * Draw the dot-grid texture at low opacity.
 */
function drawDotGrid(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.globalAlpha = 0.04
  ctx.fillStyle = SAND
  const spacing = 24
  for (let y = 0; y < H; y += spacing) {
    for (let x = 0; x < W; x += spacing) {
      ctx.beginPath()
      ctx.arc(x, y, 1.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}

/**
 * Draw perforated edge at the top of the badge.
 */
function drawPerforatedEdge(ctx: CanvasRenderingContext2D) {
  const y = 48
  const dotR = 5
  const spacing = 28
  ctx.save()
  ctx.fillStyle = INK
  for (let x = spacing / 2; x < W; x += spacing) {
    ctx.beginPath()
    ctx.arc(x, y, dotR, 0, Math.PI * 2)
    ctx.fill()
  }
  // thin dashed line through the perforations
  ctx.strokeStyle = SAND
  ctx.globalAlpha = 0.12
  ctx.lineWidth = 1
  ctx.setLineDash([8, 12])
  ctx.beginPath()
  ctx.moveTo(0, y)
  ctx.lineTo(W, y)
  ctx.stroke()
  ctx.restore()
}

/**
 * Draw a circular clipped photo.
 */
async function drawCirclePhoto(
  ctx: CanvasRenderingContext2D,
  blob: Blob,
  cx: number, cy: number, r: number,
) {
  const img = await loadImage(blob)
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  drawCoverCrop(ctx, img, cx - r, cy - r, r * 2, r * 2)
  ctx.restore()

  // Subtle ring
  ctx.save()
  ctx.strokeStyle = SAND
  ctx.globalAlpha = 0.2
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(cx, cy, r + 2, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

/**
 * Main render function. Returns canvas element.
 */
export async function renderCard(data: CardData): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  // ── Background ──
  ctx.fillStyle = PALM
  roundRect(ctx, 0, 0, W, H, 32)
  ctx.fill()

  // ── Dot grid ──
  drawDotGrid(ctx)

  // ── Perforated edge at top ──
  drawPerforatedEdge(ctx)

  // ── Subtle inner border ──
  ctx.save()
  ctx.strokeStyle = SAND
  ctx.globalAlpha = 0.08
  ctx.lineWidth = 2
  roundRect(ctx, 24, 24, W - 48, H - 48, 24)
  ctx.stroke()
  ctx.restore()

  // ── HH GOA header ──
  const headerY = 130
  ctx.save()
  ctx.font = `700 ${36}px "Space Grotesk", sans-serif`
  ctx.fillStyle = SAND
  ctx.textAlign = 'left'
  ctx.fillText('HH GOA', 72, headerY)

  // year badge
  ctx.font = `600 ${22}px "IBM Plex Mono", monospace`
  ctx.fillStyle = AMBER
  ctx.fillText('2026', 256, headerY)

  // event subtitle
  ctx.font = `400 ${18}px "IBM Plex Mono", monospace`
  ctx.fillStyle = SAND
  ctx.globalAlpha = 0.5
  ctx.fillText('HACKER HOUSE GOA  ·  28–31 OCT', 72, headerY + 38)
  ctx.restore()

  // ── Photo(s) ──
  const photoAreaY = headerY + 80
  const numPhotos = data.photos.length

  if (numPhotos === 1) {
    // Solo: one large circle
    const r = 180
    const cx = W / 2
    const cy = photoAreaY + r + 20
    await drawCirclePhoto(ctx, data.photos[0], cx, cy, r)
  } else if (numPhotos === 2) {
    // Two overlapping circles
    const r = 140
    const cy = photoAreaY + r + 30
    await drawCirclePhoto(ctx, data.photos[0], W / 2 - 100, cy, r)
    await drawCirclePhoto(ctx, data.photos[1], W / 2 + 100, cy, r)
  } else if (numPhotos >= 3) {
    // Three: triangle arrangement
    const r = 110
    const cy1 = photoAreaY + r + 10
    const cy2 = cy1 + 160
    await drawCirclePhoto(ctx, data.photos[0], W / 2, cy1, r)
    await drawCirclePhoto(ctx, data.photos[1], W / 2 - 130, cy2, r)
    await drawCirclePhoto(ctx, data.photos[2], W / 2 + 130, cy2, r)
  }

  // ── Name ──
  const nameY = numPhotos >= 3 ? photoAreaY + 530 : numPhotos === 2 ? photoAreaY + 400 : photoAreaY + 430

  ctx.save()
  ctx.textAlign = 'center'

  // Fit name to width
  let nameFontSize = 64
  ctx.font = `700 ${nameFontSize}px "Space Grotesk", sans-serif`
  while (ctx.measureText(data.name || 'YOUR NAME').width > W - 160 && nameFontSize > 32) {
    nameFontSize -= 2
    ctx.font = `700 ${nameFontSize}px "Space Grotesk", sans-serif`
  }
  ctx.fillStyle = SAND
  ctx.fillText(data.name || 'YOUR NAME', W / 2, nameY)
  ctx.restore()

  // ── Builder title ──
  const title = data.customTitle || (data.name ? getBuilderTitle(data.name, data.stack) : 'YOUR TITLE')
  ctx.save()
  ctx.textAlign = 'center'
  ctx.font = `500 ${24}px "IBM Plex Mono", monospace`
  ctx.fillStyle = AMBER
  ctx.fillText(title, W / 2, nameY + 48)
  ctx.restore()

  // ── Stack tag ──
  if (data.stack) {
    const tagY = nameY + 90
    const tagText = data.stack.toUpperCase()
    ctx.save()
    ctx.font = `600 ${20}px "IBM Plex Mono", monospace`
    const tagW = ctx.measureText(tagText).width + 40
    const tagH = 44
    const tagX = W / 2 - tagW / 2

    ctx.fillStyle = CORAL
    ctx.globalAlpha = 0.15
    roundRect(ctx, tagX, tagY - 30, tagW, tagH, 8)
    ctx.fill()

    ctx.globalAlpha = 1
    ctx.fillStyle = CORAL
    ctx.textAlign = 'center'
    ctx.fillText(tagText, W / 2, tagY)
    ctx.restore()
  }

  // ── Builder number (bottom-right) ──
  const bNum = data.name ? builderNumber(data.name) : '#000'
  ctx.save()
  ctx.font = `500 ${20}px "IBM Plex Mono", monospace`
  ctx.fillStyle = SAND
  ctx.globalAlpha = 0.35
  ctx.textAlign = 'right'
  ctx.fillText(`${bNum} / 500`, W - 72, H - 64)
  ctx.restore()

  // ── Hashtag (bottom-left) ──
  ctx.save()
  ctx.font = `500 ${20}px "IBM Plex Mono", monospace`
  ctx.fillStyle = TEAL
  ctx.globalAlpha = 0.6
  ctx.textAlign = 'left'
  ctx.fillText('#FrameInGoa', 72, H - 64)
  ctx.restore()

  // ── Bottom accent line ──
  ctx.save()
  const grad = ctx.createLinearGradient(72, 0, W - 72, 0)
  grad.addColorStop(0, CORAL)
  grad.addColorStop(0.5, AMBER)
  grad.addColorStop(1, TEAL)
  ctx.strokeStyle = grad
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(72, H - 100)
  ctx.lineTo(W - 72, H - 100)
  ctx.stroke()
  ctx.restore()

  return canvas
}

/**
 * Export the canvas as a PNG blob.
 */
export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('Canvas toBlob failed'))
      },
      'image/png',
      1,
    )
  })
}
