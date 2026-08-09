import { useEffect, useRef, useState, useMemo } from 'react'
import { renderCard, type CardData } from '../utils/cardRenderer'

interface CardPreviewProps {
  data: CardData
  onCanvasReady: (canvas: HTMLCanvasElement) => void
}

export default function CardPreview({ data, onCanvasReady }: CardPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [rendered, setRendered] = useState(false)
  const [rendering, setRendering] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // Debounced render
  const stableData = useMemo(() => JSON.stringify({
    name: data.name,
    stack: data.stack,
    customTitle: data.customTitle,
    photoCount: data.photos.length,
  }), [data.name, data.stack, data.customTitle, data.photos.length])

  useEffect(() => {
    if (data.photos.length === 0) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(async () => {
      setRendering(true)
      try {
        const canvas = await renderCard(data)
        onCanvasReady(canvas)

        // Display in container
        if (containerRef.current) {
          containerRef.current.innerHTML = ''
          canvas.style.width = '100%'
          canvas.style.height = 'auto'
          canvas.style.borderRadius = '16px'
          containerRef.current.appendChild(canvas)
        }

        setRendered(true)
      } catch (err) {
        console.error('Card render error:', err)
      } finally {
        setRendering(false)
      }
    }, 150)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [stableData, data.photos])

  if (data.photos.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-palm border border-sand/5 flex items-center justify-center">
        <p className="font-mono text-xs text-sand/25 tracking-wide text-center px-6">
          upload a photo to see<br />your badge preview
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`aspect-[3/4] rounded-2xl overflow-hidden ${
          rendered ? 'badge-print-in' : ''
        }`}
      />
      {rendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-ink/50 rounded-2xl">
          <span className="font-mono text-xs text-amber animate-pulse">
            Rendering…
          </span>
        </div>
      )}
    </div>
  )
}
