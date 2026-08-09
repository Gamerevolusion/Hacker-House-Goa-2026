/**
 * Deterministic hash from a string → number in [0, max).
 * djb2 variant, stable across sessions.
 */
export function hashString(str: string): number {
  let hash = 5381
  const lower = str.trim().toLowerCase()
  for (let i = 0; i < lower.length; i++) {
    hash = ((hash << 5) + hash + lower.charCodeAt(i)) >>> 0
  }
  return hash
}

/**
 * Pick an item from an array deterministically based on a name string.
 */
export function pickFromHash<T>(items: T[], name: string): T {
  const idx = hashString(name) % items.length
  return items[idx]
}

/**
 * Generate a builder number from a name string: #001–#500
 */
export function builderNumber(name: string): string {
  const num = (hashString(name) % 500) + 1
  return `#${String(num).padStart(3, '0')}`
}

/**
 * Builder titles per stack category, 10 each.
 */
const TITLES: Record<string, string[]> = {
  Frontend: [
    'Pixel Alchemist',
    'CSS Whisperer',
    'Component Architect',
    'Layout Surgeon',
    'UI Conjurer',
    'DOM Wrangler',
    'State Mechanic',
    'Viewport Bender',
    'Render Prophet',
    'Motion Crafter',
  ],
  Backend: [
    'API Architect',
    'Query Optimizer',
    'Server Whisperer',
    'Data Pipeline Sage',
    'Auth Guardian',
    'Cache Strategist',
    'Endpoint Sculptor',
    'Throughput Engineer',
    'Schema Warden',
    'Uptime Sentinel',
  ],
  'Full-stack': [
    'Stack Weaver',
    'End-to-End Architect',
    'Full Spectrum Builder',
    'Bridge Engineer',
    'Vertical Integrator',
    'T-shaped Hacker',
    'System Polyglot',
    'Full Loop Operator',
    'Cross-layer Crafter',
    'Stack Surgeon',
  ],
  Design: [
    'Interface Poet',
    'UX Cartographer',
    'Visual Storyteller',
    'Interaction Sculptor',
    'Design System Sage',
    'Prototype Alchemist',
    'Figma Sorcerer',
    'Usability Oracle',
    'Grid Philosopher',
    'Color Theorist',
  ],
  ML: [
    'Model Whisperer',
    'Tensor Alchemist',
    'Data Sorcerer',
    'Gradient Surfer',
    'Neural Architect',
    'Feature Engineer',
    'Loss Function Poet',
    'Inference Optimist',
    'Training Loop Monk',
    'Embedding Cartographer',
  ],
  DevOps: [
    'Pipeline Architect',
    'Container Wrangler',
    'Deploy Diplomat',
    'Infrastructure Poet',
    'CI/CD Conductor',
    'Cloud Shepherd',
    'Uptime Alchemist',
    'Config Surgeon',
    'Monitoring Sage',
    'Cluster Whisperer',
  ],
  Other: [
    'Chaos Engineer',
    'Polymath Builder',
    'Toolchain Philosopher',
    'Systems Thinker',
    'Code Wanderer',
    'Digital Craftsperson',
    'Hack Catalyst',
    'Build Alchemist',
    'Solution Architect',
    'Frontier Explorer',
  ],
}

export function getBuilderTitle(name: string, stack: string): string {
  const category = TITLES[stack] ? stack : 'Other'
  return pickFromHash(TITLES[category], name)
}

export const STACK_OPTIONS = [
  'Frontend',
  'Backend',
  'Full-stack',
  'Design',
  'ML',
  'DevOps',
  'Other',
] as const

export type StackOption = (typeof STACK_OPTIONS)[number]
