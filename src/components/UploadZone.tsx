import { useRef, useState, useCallback } from 'react'
import { isHeic, convertHeic } from '../utils/imageUtils'

interface UploadZoneProps {
  photos: Blob[]
  onPhotosChange: (photos: Blob[]) => void
}

export default function UploadZone({ photos, onPhotosChange }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [converting, setConverting] = useState(false)

  const processFile = useCallback(
    async (file: File): Promise<Blob> => {
      if (isHeic(file)) {
        setConverting(true)
        try {
          const converted = await convertHeic(file)
          return converted
        } finally {
          setConverting(false)
        }
      }
      return file
    },
    [],
  )

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const allowed = 3 - photos.length
      const toProcess = Array.from(files).slice(0, allowed)

      for (const file of toProcess) {
        const blob = await processFile(file)
        onPhotosChange([...photos, blob])
        // Update photos reference for next iteration
        photos = [...photos, blob]
      }
    },
    [photos, onPhotosChange, processFile],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleFiles(e.target.files)
      }
      // Reset input so same file can be re-selected
      e.target.value = ''
    },
    [handleFiles],
  )

  const removePhoto = useCallback(
    (index: number) => {
      const next = photos.filter((_, i) => i !== index)
      onPhotosChange(next)
    },
    [photos, onPhotosChange],
  )

  const hasPhotos = photos.length > 0

  return (
    <div className="space-y-4">
      {/* Photo previews */}
      {hasPhotos && (
        <div className="flex gap-3 flex-wrap">
          {photos.map((blob, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(blob)}
                alt={`Photo ${i + 1}`}
                className="w-20 h-20 rounded-xl object-cover ring-1 ring-sand/10"
              />
              <button
                onClick={() => removePhoto(i)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-coral text-ink flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove photo ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {photos.length < 3 && (
        <button
          type="button"
          className={`upload-zone rounded-2xl w-full flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            hasPhotos ? 'py-6 px-4' : 'py-14 px-6'
          } ${isDragOver ? 'drag-over' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          {converting ? (
            <span className="font-mono text-sm text-amber animate-pulse">
              Converting HEIC…
            </span>
          ) : hasPhotos ? (
            <>
              <span className="text-sand/40 text-2xl">+</span>
              <span className="font-mono text-xs text-sand/40 tracking-wide">
                add teammate ({3 - photos.length} left)
              </span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-palm flex items-center justify-center mb-1">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-sand/60"
                >
                  <path
                    d="M12 5v14m-7-7h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-display text-base text-sand/80 font-medium">
                Drop your photo here
              </span>
              <span className="font-mono text-[0.625rem] text-sand/35 tracking-wider uppercase">
                JPG · PNG · HEIC — tap or drag
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
        className="hidden"
        onChange={handleInputChange}
        multiple={photos.length < 2}
      />
    </div>
  )
}
