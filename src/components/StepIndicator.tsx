interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  labels: string[]
}

export default function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3 px-1 py-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNum = i + 1
        const isActive = stepNum === currentStep
        const isDone = stepNum < currentStep
        return (
          <div key={i} className="flex items-center gap-2">
            <span
              className={`step-marker transition-colors duration-200 ${
                isActive
                  ? 'text-coral'
                  : isDone
                    ? 'text-teal'
                    : 'text-sand/30'
              }`}
            >
              {String(stepNum).padStart(2, '0')}
            </span>
            <span
              className={`font-mono text-[0.625rem] tracking-wider uppercase transition-colors duration-200 ${
                isActive
                  ? 'text-sand/80'
                  : isDone
                    ? 'text-sand/40'
                    : 'text-sand/20'
              }`}
            >
              {labels[i]}
            </span>
            {i < totalSteps - 1 && (
              <span className="text-sand/15 mx-1">·</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
