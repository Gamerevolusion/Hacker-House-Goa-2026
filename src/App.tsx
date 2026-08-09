import { useState, useCallback, useRef, useEffect } from 'react'
import StepIndicator from './components/StepIndicator'
import UploadZone from './components/UploadZone'
import DetailsForm from './components/DetailsForm'
import CardPreview from './components/CardPreview'
import ActionBar from './components/ActionBar'
import type { StackOption } from './utils/builderData'
import type { CardData } from './utils/cardRenderer'

const STEP_LABELS = ['upload', 'details', 'generate', 'share']

export default function App() {
  const [photos, setPhotos] = useState<Blob[]>([])
  const [name, setName] = useState('')
  const [stack, setStack] = useState<StackOption>('Frontend')
  const [customStack, setCustomStack] = useState('')
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null)

  const currentStep = photos.length === 0 ? 1 : name.trim() ? (canvas ? 4 : 3) : 2

  const cardData: CardData = {
    name: name.trim(),
    stack: stack === 'Other' && customStack ? customStack : stack,
    photos,
  }

  const handleCanvasReady = useCallback((c: HTMLCanvasElement) => {
    setCanvas(c)
  }, [])

  const hasPhotos = photos.length > 0

  return (
    <div className="min-h-dvh bg-ink flex flex-col">
      {/* Header */}
      <header className="px-5 pt-6 pb-2 max-w-5xl mx-auto w-full">
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="font-display text-2xl font-bold text-sand tracking-tight">
            HH GOA
          </h1>
          <span className="font-mono text-xs text-amber font-medium tracking-wide">
            2026
          </span>
        </div>
        <p className="font-mono text-[0.625rem] text-sand/40 tracking-wider uppercase">
          Builder ID Card Generator
        </p>
      </header>

      {/* Step indicator */}
      <div className="px-5 max-w-5xl mx-auto w-full">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={4}
          labels={STEP_LABELS}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 px-5 pb-28 max-w-5xl mx-auto w-full">
        <div className={`${hasPhotos ? 'lg:grid lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start' : ''}`}>
          {/* Left: upload + form */}
          <div className="space-y-6 max-w-lg">
            {/* Step 1: Upload */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <span className="step-marker text-coral">01</span>
                <span className="font-mono text-[0.625rem] text-sand/50 tracking-wider uppercase">
                  upload
                </span>
              </div>
              <UploadZone photos={photos} onPhotosChange={setPhotos} />
            </section>

            {/* Step 2: Details */}
            {hasPhotos && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="step-marker text-coral">02</span>
                  <span className="font-mono text-[0.625rem] text-sand/50 tracking-wider uppercase">
                    details
                  </span>
                </div>
                <DetailsForm
                  name={name}
                  stack={stack}
                  customStack={customStack}
                  onNameChange={setName}
                  onStackChange={setStack}
                  onCustomStackChange={setCustomStack}
                />
              </section>
            )}
          </div>

          {/* Right: preview (single instance, responsive positioning) */}
          {hasPhotos && (
            <div className="mt-6 lg:mt-0 lg:sticky lg:top-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="step-marker text-coral">03</span>
                <span className="font-mono text-[0.625rem] text-sand/50 tracking-wider uppercase">
                  preview
                </span>
              </div>
              <CardPreview data={cardData} onCanvasReady={handleCanvasReady} />
            </div>
          )}
        </div>

        {/* How-to blurb */}
        {!hasPhotos && (
          <div className="mt-10 p-5 bg-palm rounded-2xl border border-sand/5 max-w-lg">
            <h2 className="font-display text-sm font-bold text-sand mb-3">
              Make your badge in 30 seconds
            </h2>
            <ol className="space-y-2.5 font-body text-sm text-sand/50">
              <li className="flex gap-3">
                <span className="font-mono text-coral text-xs mt-0.5 shrink-0">01</span>
                <span>Drop your photo (HEIC from iPhone works too)</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-coral text-xs mt-0.5 shrink-0">02</span>
                <span>Enter your name & pick your stack</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-coral text-xs mt-0.5 shrink-0">03</span>
                <span>Preview updates live — your badge prints itself</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-coral text-xs mt-0.5 shrink-0">04</span>
                <span>Download the PNG or share straight to X with #FrameInGoa</span>
              </li>
            </ol>
          </div>
        )}
      </main>

      <ActionBar canvas={canvas} name={name} />

      <footer className="px-5 pb-24 pt-6 max-w-5xl mx-auto w-full text-center">
        <p className="font-mono text-[0.5625rem] text-sand/20 tracking-wide">
          HH GOA 2026 · 28–31 OCT · GOA, INDIA
        </p>
        <p className="font-mono text-[0.5rem] text-sand/15 mt-1">
          No fluff. Ship things that matter.
        </p>
      </footer>
    </div>
  )
}
