/**
 * HEIC → JPEG conversion using heic2any.
 * Returns a Blob of type image/jpeg.
 */
export async function convertHeic(file: File): Promise<Blob> {
  const heic2any = (await import('heic2any')).default
  const result = await heic2any({
    blob: file,
    toType: 'image/jpeg',
    quality: 0.9,
  })
  // heic2any can return a single blob or array
  if (Array.isArray(result)) return result[0]
  return result
}

/**
 * Check if file is HEIC/HEIF by extension or MIME.
 */
export function isHeic(file: File): boolean {
  const ext = file.name.toLowerCase()
  return (
    ext.endsWith('.heic') ||
    ext.endsWith('.heif') ||
    file.type === 'image/heic' ||
    file.type === 'image/heif'
  )
}

/**
 * Load a File/Blob into an HTMLImageElement.
 */
export function loadImage(source: Blob | string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (typeof source !== 'string') URL.revokeObjectURL(img.src)
      resolve(img)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = typeof source === 'string' ? source : URL.createObjectURL(source)
  })
}

/**
 * Draw image to canvas with cover-crop (fill area, center-crop overflow).
 */
export function drawCoverCrop(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const imgRatio = img.naturalWidth / img.naturalHeight
  const slotRatio = w / h

  let sx: number, sy: number, sw: number, sh: number

  if (imgRatio > slotRatio) {
    // image wider than slot: crop sides
    sh = img.naturalHeight
    sw = sh * slotRatio
    sx = (img.naturalWidth - sw) / 2
    sy = 0
  } else {
    // image taller than slot: crop top/bottom
    sw = img.naturalWidth
    sh = sw / slotRatio
    sx = 0
    sy = (img.naturalHeight - sh) / 2
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}
