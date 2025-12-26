import type { Environment } from '@/data/mock/flowc-data'

// Common environment names
export const environmentNames = [
  { label: 'Production', value: 'production' },
  { label: 'Staging', value: 'staging' },
  { label: 'Development', value: 'development' },
  { label: 'Test', value: 'test' },
  { label: 'Integration', value: 'integration' },
  { label: 'Public', value: 'public' },
] as const

// Environment name styles (for badges and visual indicators)
export const environmentNameStyles: Record<
  string,
  {
    variant: 'default' | 'secondary' | 'outline' | 'destructive'
    label: string
  }
> = {
  production: {
    variant: 'default',
    label: 'Production',
  },
  staging: {
    variant: 'outline',
    label: 'Staging',
  },
  development: {
    variant: 'secondary',
    label: 'Development',
  },
  test: {
    variant: 'secondary',
    label: 'Test',
  },
  integration: {
    variant: 'default',
    label: 'Integration',
  },
  public: {
    variant: 'default',
    label: 'Public',
  },
}

// Get environment style (with fallback for custom environment names)
export function getEnvironmentStyle(name: string) {
  return (
    environmentNameStyles[name.toLowerCase()] || {
      variant: 'default' as const,
      label: name,
    }
  )
}

// Check if environment has TLS
export function hasTLS(env: Environment): boolean {
  return !!env.tlsConfig
}
