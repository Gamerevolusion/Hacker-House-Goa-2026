import { STACK_OPTIONS, getBuilderTitle, type StackOption } from '../utils/builderData'

interface DetailsFormProps {
  name: string
  stack: StackOption
  customStack: string
  onNameChange: (name: string) => void
  onStackChange: (stack: StackOption) => void
  onCustomStackChange: (custom: string) => void
}

export default function DetailsForm({
  name,
  stack,
  customStack,
  onNameChange,
  onStackChange,
  onCustomStackChange,
}: DetailsFormProps) {
  const resolvedStack = stack === 'Other' && customStack ? customStack : stack
  const builderTitle = name ? getBuilderTitle(name, stack) : ''

  return (
    <div className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <label
          htmlFor="builder-name"
          className="font-mono text-[0.6875rem] text-sand/50 tracking-wider uppercase block"
        >
          Name
        </label>
        <input
          id="builder-name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="What do they call you?"
          className="w-full bg-palm border border-sand/10 rounded-xl px-4 py-3 text-sand font-display text-lg placeholder:text-sand/20 focus:border-teal/40 transition-colors"
          maxLength={40}
          autoComplete="off"
        />
      </div>

      {/* Stack/Role */}
      <div className="space-y-2">
        <label
          htmlFor="builder-stack"
          className="font-mono text-[0.6875rem] text-sand/50 tracking-wider uppercase block"
        >
          Stack / Role
        </label>
        <select
          id="builder-stack"
          value={stack}
          onChange={(e) => onStackChange(e.target.value as StackOption)}
          className="w-full bg-palm border border-sand/10 rounded-xl px-4 py-3 text-sand font-body text-base cursor-pointer focus:border-teal/40 transition-colors pr-10"
        >
          {STACK_OPTIONS.map((opt) => (
            <option key={opt} value={opt} className="bg-ink text-sand">
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Custom stack input when "Other" */}
      {stack === 'Other' && (
        <div className="space-y-2">
          <label
            htmlFor="custom-stack"
            className="font-mono text-[0.6875rem] text-sand/50 tracking-wider uppercase block"
          >
            Your role
          </label>
          <input
            id="custom-stack"
            type="text"
            value={customStack}
            onChange={(e) => onCustomStackChange(e.target.value)}
            placeholder="e.g. Blockchain, AR/VR, Web3"
            className="w-full bg-palm border border-sand/10 rounded-xl px-4 py-3 text-sand font-body text-base placeholder:text-sand/20 focus:border-teal/40 transition-colors"
            maxLength={24}
            autoComplete="off"
          />
        </div>
      )}

      {/* Builder Title (read-only, live) */}
      {name && (
        <div className="space-y-2">
          <span className="font-mono text-[0.6875rem] text-sand/50 tracking-wider uppercase block">
            Builder title
          </span>
          <div className="flex items-center gap-2 px-4 py-3 bg-palm/50 border border-sand/5 rounded-xl">
            <span className="text-amber font-mono text-sm font-medium">
              {builderTitle}
            </span>
            <span className="text-sand/20 font-mono text-[0.625rem]">
              — assigned by hash
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
