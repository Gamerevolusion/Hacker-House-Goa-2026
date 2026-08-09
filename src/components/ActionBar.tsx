import { useState } from 'react'
import { canvasToBlob } from '../utils/cardRenderer'
import { uploadCardImage, createSharePage, openTwitterShare } from '../utils/firebase'
import { v4 as uuidv4 } from 'uuid'

interface ActionBarProps {
  canvas: HTMLCanvasElement | null
  name: string
}

export default function ActionBar({ canvas, name }: ActionBarProps) {
  const [sharing, setSharing] = useState(false)
  const [shareError, setShareError] = useState('')

  const handleDownload = async () => {
    if (!canvas) return

    try {
      const blob = await canvasToBlob(canvas)
      const url = URL.createObjectURL(blob)

      // Create download link — works on iOS Safari + mobile Chrome
      const a = document.createElement('a')
      a.href = url
      a.download = `hhgoa-2026-${name.trim().toLowerCase().replace(/\s+/g, '-') || 'builder'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
    }
  }

  const handleShareToX = async () => {
    if (!canvas) return

    setSharing(true)
    setShareError('')

    try {
      const blob = await canvasToBlob(canvas)
      const id = uuidv4()

      // Upload to Firebase Storage
      const imageUrl = await uploadCardImage(blob, id)

      // Create OG share page via Cloud Function
      const shareUrl = await createSharePage(imageUrl, id)

      // Open Twitter intent
      openTwitterShare(shareUrl, window.location.origin)
    } catch (err) {
      console.error('Share failed:', err)
      // Fallback: share without image preview
      setShareError('Image upload failed — sharing without preview')
      const caption = encodeURIComponent(
        `I'm building at HH Goa 2026 🌴 #FrameInGoa — make yours: ${window.location.origin}`
      )
      window.open(
        `https://twitter.com/intent/tweet?text=${caption}`,
        '_blank',
        'noopener,noreferrer',
      )
    } finally {
      setSharing(false)
    }
  }

  const isReady = !!canvas

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-ink/95 backdrop-blur-sm border-t border-sand/8 safe-bottom z-50">
      <div className="max-w-lg mx-auto px-4 py-3 flex gap-3">
        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={!isReady}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-display font-medium text-base transition-all ${
            isReady
              ? 'bg-coral text-ink hover:bg-coral/90 active:scale-[0.98]'
              : 'bg-palm text-sand/25 cursor-not-allowed'
          }`}
          style={{ minHeight: '52px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download card
        </button>

        {/* Share to X */}
        <button
          onClick={handleShareToX}
          disabled={!isReady || sharing}
          className={`flex-1 flex items-center justify-center gap-2 rounded-xl font-display font-medium text-base transition-all ${
            isReady && !sharing
              ? 'bg-palm border border-sand/15 text-sand hover:border-teal/40 active:scale-[0.98]'
              : 'bg-palm border border-sand/5 text-sand/25 cursor-not-allowed'
          }`}
          style={{ minHeight: '52px' }}
        >
          {sharing ? (
            <span className="font-mono text-xs text-amber animate-pulse">
              Uploading…
            </span>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share to X
            </>
          )}
        </button>
      </div>
      {shareError && (
        <p className="text-center font-mono text-[0.625rem] text-amber/60 pb-2">
          {shareError}
        </p>
      )}
    </div>
  )
}
