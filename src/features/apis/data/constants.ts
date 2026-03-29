// API Status Options
export const API_STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'ready', label: 'Ready' },
  { value: 'deployed', label: 'Deployed' },
  { value: 'deprecated', label: 'Deprecated' },
] as const

// API Status Styling (keyed by phase string from the API)
export const API_STATUS_STYLES: Record<
  string,
  {
    variant: 'default' | 'secondary' | 'outline' | 'destructive'
    className?: string
  }
> = {
  draft: { variant: 'outline' },
  ready: {
    variant: 'outline',
    className:
      'border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
  deployed: {
    variant: 'outline',
    className:
      'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400',
  },
  deprecated: {
    variant: 'outline',
    className:
      'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  },
}

// Routing Match Type Options
export const MATCH_TYPE_OPTIONS = [
  { value: 'prefix', label: 'Prefix' },
  { value: 'exact', label: 'Exact' },
  { value: 'regex', label: 'Regex' },
]

// Load Balancing Options
export const LOAD_BALANCING_OPTIONS = [
  { value: 'round-robin', label: 'Round Robin' },
  { value: 'random', label: 'Random' },
  { value: 'least-conn', label: 'Least Connections' },
]

// Scheme Options
export const SCHEME_OPTIONS = [
  { value: 'http', label: 'HTTP' },
  { value: 'https', label: 'HTTPS' },
]
